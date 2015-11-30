
import React from 'react'

export const LoginButton = ({loginStatus}) => (
  <a
    href="https://familysearch.org"
    target="_blank"
    style={{...styles.startButton, ...styles.button}}
  >
    {loginStatus === false ?
      'Login on FamilySearch.org to get started' :
      'Logging in...'}
  </a>
)

export const GetStartedButton = ({onClick}) => (
  <button
    onClick={onClick}
    style={{...styles.startButton, ...styles.button}}
  >
    Let's get started!
  </button>
)

const styles = {
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
}

