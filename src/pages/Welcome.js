
import React from 'react'
import View from '../View'
import Button from '../Button'
import Text from '../Text'
import connect from '../connect'

import Logo from '../components/Logo'

const Tagline = () => <Text style={styles.tagline}>
  <Logo/> is a simple, friendly tool for getting acquainted with the stories of your ancestors.
</Text>

const Welcome = ({stories, syncStatus, ctx: {actions}}) => (
  <View style={styles.container}>
    <View style={styles.inner}>
    <Tagline/>
    <Text style={styles.message}>
      Click below to synchronize with familysearch and download the stories of your direct ancestors and their siblings back 9 generations.
    </Text>
    {/** todo take lastSync and syncStatus into account **/}
    {syncStatus ?
      <View>Syncing...{syncStatus.display && syncStatus.display.name} {syncStatus.total} total searched</View> :
      <Button style={styles.syncButton} onClick={actions.startSyncing}>Let's go!</Button>}
    </View>
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
  props: ['loginStatus', 'syncStatus', 'lastSync'],
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
    padding: '50px 75px',
    alignItems: 'center',
  },

  inner: {
    maxWidth: 600,
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
    margin: '30px 0',
    padding: '10px 20px',
    fontSize: 25,
    borderRadius: 10,
  },

  syncButton: {
    margin: '30px 0',
    padding: '5px 10px',
    fontSize: 20,
    borderRadius: 5,
  },
}
