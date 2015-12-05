
import React from 'react'
import View from '../View'
import Button from '../Button'
import Text from '../Text'
import connect from '../connect'

import Logo from '../components/Logo'
import Tree from '../components/Tree'
import DeleteButton from '../components/DeleteButton'

const Tagline = () => <Text style={styles.tagline}>
  <Logo/> is a simple, friendly tool for getting acquainted with the stories of your ancestors.
</Text>

const message = (syncStatus, lastSync, lastSyncStart) => {
  if (syncStatus) {
    return 'Now synchronizing! You can click the stories on the left to start reading when they appear.'
  }
  if (!lastSyncStart) {
    return 'Click below to synchronize with familysearch and download the stories of your direct ancestors and their siblings back 9 generations.'
  }
  if (!lastSync || (lastSync.getTime() < lastSyncStart.getTime())) {
    return `The last sync was incomplete (started ${lastSyncStart.toLocaleString()}), so you can click "synchronize" below to sync again, or just read the stories that are loaded :)`
  }
  return `You can click the stories on the left to start reading them, or click the "synchronize" button to re-sync with familysearch. Last synchronized ${lastSyncStart.toLocaleString()}`
}

const WelcomeMessage = ({stories, location, syncStatus, lastSync, lastSyncStart, ctx}) => (
  <View style={styles.inner}>
    <Tagline/>
    <Text style={styles.message}>
      {message(syncStatus, lastSync, lastSyncStart)}
    </Text>
    {syncStatus ?
      <View style={styles.syncMessage}>
        <Text>Checking {
          syncStatus.display && <Text style={styles.statusName}>{syncStatus.display.name}</Text>
        }</Text>
        <Text>{syncStatus.total || 0} total searched</Text>
        <Button style={styles.syncButton} onClick={ctx.actions.stopSyncing}>
          Stop synchronizing
        </Button>
      </View> :
      <Button style={styles.syncButton} onClick={ctx.actions.startSyncing}>
        {lastSyncStart ?
          'Synchronize' :
          'Let\'s go!'}
      </Button>}
  </View>
)

const TopMessage = ({stories, location, syncStatus, lastSync, lastSyncStart, ctx}) => (
  <View style={styles.topMessage}>
    <Text style={[styles.message, styles.topText]}>
      {message(syncStatus, lastSync, lastSyncStart)}
    </Text>
    {syncStatus ?
      <View style={styles.topSyncMessage}>
        <Text style={styles.topSyncText}>Checking {
          syncStatus.display && <Text style={styles.statusName}>{syncStatus.display.name}</Text>
        }</Text>
        <Text>{syncStatus.total || 0} total searched</Text>
        <Button style={styles.topButton} onClick={ctx.actions.stopSyncing}>
          Stop synchronizing
        </Button>
      </View> :
      <Button style={styles.topButton} onClick={ctx.actions.startSyncing}>
        Synchronize
      </Button>}
  </View>
)

const Welcome = props => (
  !props.lastSyncStart ?
    <View style={styles.container}>
      <WelcomeMessage {...props} />
    </View> :
    <View style={styles.container}>
      <TopMessage {...props} />
      <Tree location={props.location} ctx={props.ctx} />
      <DeleteButton db={props.ctx.db} />
    </View>
)

const LoggedOutWelcome = ({login, loginStatus}) => (
  <View style={styles.container}>
    <View style={styles.inner}>
    <Text style={styles.title}>
      Welcome to <Logo/>!
    </Text>
    <Tagline/>
    <Text style={styles.message}>
      Just click the button below to login with FamilySearch, and then you can synchronize and download the stories of your direct ancestors and their siblings back 9 generations.
    </Text>
    <Button style={styles.loginButton} onClick={login}>Login!</Button>
    </View>
  </View>
)

export default connect({
  props: ['loginStatus', 'syncStatus', 'lastSync', 'lastSyncStart'],
  name: 'Welcome',
  render: props => (
    props.loginStatus === true ?
      <Welcome {...props}/> :
      <LoggedOutWelcome
        loginStatus={props.loginStatus}
        login={() => props.ctx.api.login()}
      />
  )
})

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
  },

  topMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '10px 20px',
  },

  topText: {
    fontSize: 14,
    padding: '0 20px',
    flex: 1,
  },

  topButton: {
    padding: '5px 10px',
    fontSize: 20,
    borderRadius: 5,
    marginLeft: 5,
  },

  statusName: {
    fontWeight: 'bold',
  },

  topSyncMessage: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  topSyncText: {
    width: 300,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    marginRight: 5,
  },

  syncMessage: {
    margin: '20px 0',
    lineHeight: 1.6,
    alignItems: 'center',
    textAlign: 'center',
  },

  inner: {
    maxWidth: 600,
    padding: '50px 75px 0',
    alignItems: 'center',
  },

  title: {
    fontSize: 30,
  },

  tagline: {
    margin: '20px 0',
    fontSize: 24,
    lineHeight: 1.4,
  },

  message: {
    lineHeight: 1.5,
  },

  loginButton: {
    margin: '30px 0 0',
    padding: '10px 20px',
    fontSize: 25,
    borderRadius: 10,
  },

  syncButton: {
    margin: '30px 0 0',
    padding: '5px 10px',
    fontSize: 20,
    borderRadius: 5,
  },
}
