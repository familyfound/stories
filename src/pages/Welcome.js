
import React from 'react'
import View from '../View'
import Button from '../Button'
import Text from '../Text'
import connect from '../connect'

import Logo from '../components/Logo'
import Tree from '../components/Tree/Tree'
import DeleteButton from '../components/DeleteButton'

import i18n from '../i18n'

const Tagline = () => <Text style={styles.tagline}>
  <Logo/> {i18n.tagLine}
</Text>

const message = (syncStatus, lastSync, lastSyncStart) => {
  if (syncStatus) {
    return i18n.nowSyncing
  }
  if (!lastSyncStart) {
    return i18n.startSyncing
  }
  if (!lastSync || (lastSync.getTime() < lastSyncStart.getTime())) {
    return i18n.incompleteSync(lastSyncStart);
  }
  return i18n.completeSync(lastSyncStart);
}

const WelcomeMessage = ({stories, location, syncStatus, lastSync, lastSyncStart, ctx}) => (
  <View style={styles.inner}>
    <Tagline/>
    <Text style={styles.message}>
      {message(syncStatus, lastSync, lastSyncStart)}
    </Text>
    <Button style={styles.syncButton} onClick={ctx.actions.startSyncing}>
      Let's go!
    </Button>
    <Text style={styles.orText}>or</Text>
    <Button onClick={ctx.actions.logOut} style={styles.logOutButton}>
      Sign out
    </Button>
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
    <Button onClick={ctx.actions.logOut} style={styles.logOutButton}>
      Sign out
    </Button>
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
      {i18n.welcome(<Logo/>)}
    </Text>
    <Tagline/>
    <Text style={styles.message}>
      {i18n.startSyncing}
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
    padding: '3px 7px',
    fontSize: 14,
    borderColor: '#aaa',
    color: '#777',
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
  },

  orText: {
    margin: "15px 0 10px",
    color: "#999",
    fontSize: 10,
  },

  logOutButton: {
    border: 'none',
    padding: '3px 7px',
    fontSize: 14,
    color: '#777',
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
    fontSize: '90%',
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
