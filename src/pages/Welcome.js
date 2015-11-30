
import React from 'react'
import View from '../View'
import Button from '../Button'
import Text from '../Text'
import connect from '../connect'

import Logo from '../components/Logo'

const Welcome = ({stories, syncStatus, ctx: {actions}}) => (
  <View style={styles.container}>
    <Text>
      Hi! <Logo/> is a simple, friendly tool for getting acquainted with the stories of your ancestors.
    </Text>
  {/** todo take lastSync and syncStatus into account **/}
  {syncStatus ?
    <View>Syncing...{syncStatus.display && syncStatus.display.name} {syncStatus.total} total searched</View> :
    <Button onClick={actions.startSyncing}>Start Syncing!</Button>}
  </View>
)

const LoggedOutWelcome = ({login, loginStatus}) => (
  <View style={styles.container}>
    Welcome! To use All the Stories, you need to login with FamilySearch.org first.
    <Button onClick={login}>Login!</Button>
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
  },
}
