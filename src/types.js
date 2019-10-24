// @flow

import type {User, DisplayProperties, SourceDescription} from './api-types'

export type LoginStatus = string;

export type EmitStory = {
    ...SourceDescription,
    text: ?string,
    words: number,
    archived: ?number,
    starred: boolean,
    title: string,
    dateAdded: Date,
    people: Array<StoryPerson>,
};

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

export type StoryPerson = {
  pid: string,
  trail: Array<TrailItem>,
  display: DisplayProperties,
  relation: string,
  href: string,
}

export type DbState = {
  hasStarted: boolean,
  lastSync: ?number,
  lastSyncStart: ?number,
  people: {[key: string]: EmitPerson},
  stories: {[key: string]: EmitStory},
}

export type State = {
    ...DbState,
    loginStatus: boolean,
    user: ?User,
    searchText: string,
    syncStatus: boolean,
    searchResults: Array<any>
}

export type SyncStatus = false | {
    display: ?DisplayProperties,
    total: ?number,
};

export type Action = {
    type: 'getStarted'
} | {
    type: 'logOut'
} | {
    type: 'setLoggedIn',
    args: {loginStatus: string, user: ?User}
} | {
    type: 'startSyncing',
    args: {started: Date}
} | {
    type: 'stopSyncing',
    args: {completed: ?Date}
} | {
    type: 'setSyncStatus',
    args: {status: SyncStatus}
} | {
    type: 'setSearchText',
    args: {searchText: string}
} | {
    type: 'setStarred',
    args: {id: string, starred: boolean}
} | {
    type: 'setArchived',
    args: {id: string, archived: ?number}
} | {
    type: 'setStoryPeople',
    args: {id: string, people: Array<StoryPerson>}
} | {
    type: 'addStory',
    args: {story: EmitStory}
} | {
    type: 'addPerson',
    args: {person: EmitPerson}
}