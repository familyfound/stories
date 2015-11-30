
import React from 'react'
import View from '../View'
import Text from '../Text'

import probably from '../probably'

const PersonRecordHints = ({recordHints}) => (
  <View style={styles.container}>
    <Text style={styles.title}>
      Record hints ({recordHints.length})
    </Text>
    {recordHints.map(hint => (
      <View key={hint.id} style={styles.hint}>
        <a style={styles.link} href={hint.links['source-linker'].href} target="_blank">{hint.title}</a>
      </View>
    ))}
  </View>
)

const ErrorMessage = () => <View>Unable to load record hints</View>
const Loading = () => <View>Loading record hints</View>

const MaybePersonRecordHints = ({recordHints}) => {
  if (recordHints === probably.LOADING) {
    return <Loading />
  }
  if (recordHints instanceof Error) {
    return <ErrorMessage />
  }
  return <PersonRecordHints recordHints={recordHints} />
}

export default MaybePersonRecordHints

const styles = {
  title: {
    fontWeight: 'bold',
    paddingLeft: 20,
    marginTop: 10,
    marginBottom: 5,
  },

  source: {
  },

  link: {
    padding: '10px 20px',
    display: 'block',
    marginRight: 10,
    textDecoration: 'none',
  }
}


