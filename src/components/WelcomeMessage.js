
import React from 'react'
import View from '../View'
import Text from '../Text'
import {LoginButton, GetStartedButton} from './Buttons'

import connect from '../connect'
import * as creators from '../creators'

export default connect({
  props: ['loginStatus'],
  name: 'WelcomeMessage',
  render: ({loginStatus, dispatch}) => (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.header}>Welcome to Family Found!</View>
        <View style={[styles.mainText, styles.paragraph]}>{message}</View>
        {loginStatus !== true &&
          <Text style={styles.paragraph}>
            In order to get started, you need to go over to familysearch.org and log in.
          </Text>}
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={{width: 350}}>
            {loginStatus === true ?
              <GetStartedButton onClick={() => dispatch(creators.getStarted())} /> :
              <LoginButton loginStatus={loginStatus} />}
            {loginStatus === true ? <Text style={styles.smallBody}>
              To get you started, we'll automatically search through your family tree from familysearch.org and find some relatives of yours that are likely to need research done.
            </Text> : <Text style={styles.smallBody}>
              This will open <a target='_blank' href="https://familysearch.org">familysearch.org</a> in a new tab. Once you've logged in there, come back here to continue.
            </Text>}
          </View>
        </View>
      </View>
    </View>
  ),
})

const message = `
FamilyFound is the easiest way to get started with family history research! It will get you started with an ancestor who likely has research opportunities, and then help you keep track of your research along the way, providing useful hints and suggestions on how to make the most of your time.
`

const styles = {
  container: {
    alignItems: 'center',
    flex: 1,
  },

  box: {
    width: 600,
    marginTop: 150,
  },

  header: {
    fontSize: '2em',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  mainText: {
    marginBottom: 20,
    marginTop: 30,
  },

  paragraph: {
    lineHeight: 1.5,
    fontSize: '1.3em',
  },

  button: {
    whiteSpace: 'nowrap',
    backgroundColor: 'green',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    borderRadius: 4,
    textDecoration: 'none',
    boxSizing: 'border-box',
  },

  startButton: {
    display: 'inline-block',
    padding: '10px 20px',
    marginBottom: 20,
    marginTop: 30,
  },

  smallBody: {
    fontSize: '.8em',
    lineHeight: 1.3,
  },
}

