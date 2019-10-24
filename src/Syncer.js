// @flow

import EventEmitter from "events";
import assembleRelatives from "./assembleRelatives";
import findReasons from "./findReasons";
import calcRelation from "./util/calcRelation";

import type {DisplayProperties} from './api-types'
import ApiManager from './APIManager'
import type {Relatives, PersonWithMeta as Person} from './assembleRelatives'

const countWords = text => text.split(/\s+/g).length;

export type TrailItem = {
  rel: string,
  id: string,
  name: string,
  gender: string,
  lifespan: ?string,
  place: ?string
};

export type EmitPerson = {
  pid: string,
  display: DisplayProperties,
  trail: Array<TrailItem>,
  relation: string,
  parents: Array<{
    mother: ?string,
    father: ?string,
  }>,
  children: Array<{
    pid: string,
    display: DisplayProperties
  }>
}

// type Person = {
//   id: string,
//   display: {
//     name: string,
//     gender: string,
//     lifespan: ?string,
//     birthPlace: ?string,
//     deathPlace: ?string
//   }
// };

export type StoryPerson = {
  pid: string,
  trail: Array<TrailItem>,
  display: DisplayProperties,
  relation: string,
  href: string,
}

type WorkItem = {
  pid: string,
  trail: Array<TrailItem>,
  numUp: number,
  numDown: number
};

type Api = ApiManager;
type Frontier = Array<WorkItem>;
type Config = {
  maxWorkers: number,
  maxUp: number,
  maxDown: number,
  maxTotal: number,
};

class Searcher extends EventEmitter {
  api: ApiManager;
  frontier: Frontier;
  storyIds: { [key: string]: boolean };
  searched: { [key: string]: boolean };
  config: Config;
  running: boolean;
  working: number;
  max: ?number;
  total: number;
  foundThisTime: number;
  constructor(api: Api, frontier: Frontier, config: Config) {
    super();
    this.api = api;
    this.frontier = frontier && frontier.slice();
    this.storyIds = {};
    this.searched = {};
    this.config = config;
    this.max = 5;
    this.total = 0;
  }

  start(base: string, max?: number) {
    if ((base && !this.frontier) || !this.frontier.length) {
      this.frontier = [{ pid: base, trail: [], numUp: 0, numDown: 0 }];
    }
    this.max = max;
    this.foundThisTime = 0;

    this.running = true;
    this.working = 0;
    while (this.working < this.config.maxWorkers && this.frontier.length) {
      this.startWorker();
    }
  }

  stop(completed?: boolean) {
    if (!this.running) return;
    this.running = false;
    this.emit("stop", !!completed);
  }

  add(item: WorkItem) {
    if (this.searched[item.pid]) {
      return;
    }
    this.searched[item.pid] = true;
    this.frontier.push(item);
    if (this.working < this.config.maxWorkers) {
      this.startWorker();
    }
  }

  addRelative(
    person: Person,
    rel: string,
    trail: Array<TrailItem>,
    numUp: number,
    numDown: number
  ) {
    this.add({
      pid: person.id,
      trail: trail.concat([
        {
          rel,
          id: person.id,
          name: person.display.name,
          gender: person.display.gender.toLowerCase(),
          lifespan: person.display.lifespan,
          place: person.display.birthPlace || person.display.deathPlace
        }
      ]),
      numUp,
      numDown
    });
  }

  startWorker() {
    if (!this.running) return;
    this.working += 1;
    const item = this.frontier.shift();
    this.processItem(item)
      .catch(err => {
        console.error("Failure in worker", err);
      })
      .then(() => {
        this.working -= 1;
        if (!this.running) return;
        if (this.frontier.length) {
          this.startWorker();
        } else if (this.working === 0) {
          this.stop(true);
        }
      });
  }

  evaulate({ pid, trail, numUp, numDown }: WorkItem, relatives: Relatives) {
    const that = this;
    this.api.cache
      .stories(pid)
      .then(async stories => {
        if (!stories.length) return;
        const person = {
          pid,
          trail,
          display: relatives.person.display,
          relation: calcRelation(trail, numUp, numDown),
          href: relatives.person.identifiers["http://gedcomx.org/Persistent"][0]
        };
        for (const story of stories) {
          let text = null;
          let words = 0;
          if (!that.storyIds[story.id]) {
            that.storyIds[story.id] = true;
            text = await that.api.story(story.about);
            words = countWords(text);
          }
          that.emit("story", {
            ...story,
            text,
            words,
            archived: null,
            starred: false,
            title: story.titles ? story.titles[0].value : person.display.name,
            dateAdded: new Date(),
            people: [person]
          });
        }
      })
      .catch(err => {
        console.error("failed to get stories");
      });
  }

  async processItem({ pid, trail, numUp, numDown }: WorkItem) {
    const relatives: Relatives = await this.api.cache.personWithRelationships(pid);
    const person = relatives.person;

    this.evaulate({ pid, trail, numUp, numDown }, relatives);

    // parents
    if (numUp < this.config.maxUp && !numDown) {
      relatives.parents.forEach(({ mother, father }) => {
        if (mother) {
          this.addRelative(mother, "mother", trail, numUp + 1, numDown);
        }
        if (father) {
          this.addRelative(father, "father", trail, numUp + 1, numDown);
        }
      });
    }

    // children
    if (numDown < this.config.maxDown) {
      relatives.childIds.forEach(childId => {
        const child = relatives.persons[childId];
        if (child) {
          this.addRelative(child, "child", trail, numUp, numDown + 1);
        }
      });
    }

    // 'people' that we store are only direct ancestors for the moment...
    if (!numDown) {
      this.emit("person", {
        pid: person.id,
        display: person.display,
        trail,
        relation: calcRelation(trail, numUp, numDown),
        parents: relatives.parents.map(({ mother, father }) => ({
          mother: mother && mother.id,
          father: father && father.id
        })),
        children: relatives.childIds
          .map(
            id =>
              relatives.persons[id] && {
                pid: id,
                display: relatives.persons[id].display
              }
          )
          .filter(x => !!x)
      });
    }

    this.total += 1;
    this.emit("current", { display: person.display, total: this.total });

    if (this.total >= this.config.maxTotal) {
      this.stop(true);
    }
  }
}

export default Searcher;
