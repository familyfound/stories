// @flow

import type {EmitPerson, StoryPerson} from './Syncer'
import type {EmitStory, User, DisplayProperties} from './api-types'

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