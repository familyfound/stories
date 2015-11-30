
import React from 'react'
import {Router, Redirect, IndexRoute, Route} from 'react-router'

import App from './'
import About from './pages/About'
import Login from './pages/Login'
import Help from './pages/Help'
import Welcome from './pages/Welcome'
import MapPage from './pages/Map'
import Tree from './pages/Tree'
import Read from './pages/Read'

export default (store, api, actions, history) => {
  const ctx = {store, api, actions, history}
  const createElement = (Component, props) => {
    return <Component ctx={{...ctx, params: props.params}} {...props} />
  }

  const requireAuth = (nextState, replaceState) => {
    if (store.state.loginStatus !== true) {
      // not currently saving the "place I wanted to go". I could do it in
      // localStorage though...
      replaceState(null, '/')
    }
  }

  return (
    <Router createElement={createElement} history={history} >
      <Route path="/" component={App}>
        <IndexRoute component={Welcome} />

        <Route path="read/:id/:title" component={Read} onEnter={requireAuth} />
        <Route path="map" component={MapPage} onEnter={requireAuth} />
        <Route path="tree" component={Tree} onEnter={requireAuth} />

        <Route path="about" component={About} />
        <Route path="help" component={Help} />
      </Route>
      <Redirect from="*" to="/" />
    </Router>
  )
}

