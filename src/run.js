
import React from 'react'
import {render} from 'react-dom'

import searchResults from './util/searchResults'
import setupActions from './setupActions'
import * as creators from './creators'
import makeRouter from './makeRouter'
import reduce from './reduce'
import Store from './Store'
import history from './history'
import api from './api'
import db from './db'

import debug from './debug'

/*// STOPSHIP remove this when done devving offline
const offlineMode = true
const apiUser = require('../cached/apiUser.json')
const apiCache = require('../cached/apiCache3.json')

api.cache.load(apiCache)
api.user = apiUser
api.token = 'FAKE-offline'
/// End cache stuff ///*/

const getInitialLoginStatus = (
  /*
  offlineMode ? () => true : // */
  async () => {
    if (location.search.startsWith('?code=')) {
      const code = location.search.slice('?code='.length)
      history.replaceState(null, '/')
      api.loginWithCode(code)
    }
    const token = localStorage.token
    if (!token) {
      return false
    }
    return await api.checkToken(token)
  }
)

window.myhistory = history
window.api = api
window.db = db
window.React = React

const main = async () => {
  // TODO show loading screen or something. takes half a second to verify
  // login
  await db.open()
  const dbState = await db.getState()
  const store = window.store = new Store({
    ...dbState,
    loginStatus: await getInitialLoginStatus(),
    searchText: '',
    syncStatus: false,
    searchResults: searchResults(dbState.stories, ''),
  }, reduce)

  // TODO add `api` and `db` to the arguments, so we don't need global
  // singletons
  const actions = window.actions = setupActions(creators, store)

  api.syncer.on('current', ({display, total}) => {
    if (store.state.syncStatus !== false) {
      actions.setSyncStatus({display, total})
    }
    console.log(total, display.name)
  })
  api.syncer.on('story', story => {
    if (store.state.stories[story.id]) {
      const people = [...store.state.stories[story.id].people]
      const pids = people.map(p => p.pid)
      story.people.forEach(person => {
        if (pids.indexOf(person.pid) === -1) {
          people.push(person)
        }
      })
      if (people.length > pids.length) {
        debugger
        actions.setStoryPeople(story.id, people)
      }
    } else {
      actions.addStory(story)
    }
  })
  api.syncer.on('stop', completed => actions.stopSyncing(completed))

  // Get out of promise-land so exceptions catch right
  setTimeout(() => renderMain(store, actions), 0)
}

const renderMain = (store, actions) => {
  render(
    makeRouter(store, api, actions, history),
    document.getElementById('root')
  )
}

main().then(() => {
  // Started up fine!
}, err => {
  console.error('Failed to open DB!', err)
})

