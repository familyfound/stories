
import React from 'react'
import {Link} from 'react-router'
import View from '../View'
import Text from '../Text'
import Button from '../Button'

import {LoginButton} from '../components/Buttons'

import PersonVitals from '../components/PersonVitals'
import PersonSources from '../components/PersonSources'
import PersonRecordHints from '../components/PersonRecordHints'
import PersonFamily from '../components/PersonFamily'
import PersonNotes from '../components/PersonNotes'
import Search from '../components/Search/Search'

import connect from '../connect'
import probably from '../probably'
import stateful from '../util/stateful'

const memo = fn => {
  let lval = null
  let lres = null
  return val => val === lval ? lres : (lval = val, lres = fn(val))
}

const queueKeys = memo(queue => Object.keys(queue))

export default stateful({
  initial: {
    refreshCount: 0,
  },
  helpers: {
    refresh({ctx: {api}, params: {pid}}, {refreshCount}) {
      api.resetForPerson(pid)
      return {refreshCount: refreshCount + 1}
    }
  },
  render: connect({
    props: ['queue', 'loginStatus'],
    render: probably({
      name: 'PersonPage',
      partial: true,
      shouldRefresh: (nextProps, prevProps) =>
        prevProps.params.pid !== nextProps.params.pid ||
        prevProps.loginStatus !== nextProps.loginStatus ||
        prevProps.queue !== nextProps.queue ||
        prevProps.refreshCount !== nextProps.refreshCount,
      promises: ({ctx: {api}, params: {pid}}) => ({
        // ordinances: api.ordinances(pid),
        recordHints: api.cache.recordHints(pid),
        personWithRelationships: api.cache.personWithRelationships(pid),
        sources: api.cache.sources(pid),
      }),

      render: props => props.loginStatus === true ? render(props) : renderLoggedOut(props),
    })
  })
})

const render = ({params: {pid, tabid}, queue, refresh, ordinances, recordHints, sources, source, personWithRelationships, ctx}) => (
  <View style={styles.container}>
    <View style={styles.leftSide}>
      <Button style={styles.refreshButton} onClick={refresh}>Refresh</Button>
      <PersonVitals
        data={personWithRelationships}
        onRemoveQueue={() => ctx.actions.removeQueueItem(pid)}
        onChangeQueueStatus={status => ctx.actions.changeQueueStatus(pid, status)}
        onAddQueueItem={() => ctx.actions.addQueueItemFromPerson(pid, 'browsing')}
        onChangeNote={text => ctx.actions.changeNote(pid, text)}
        queueItem={queue[pid]}
      />
      <PersonNotes pid={pid} api={ctx.api} />
      {/** TODO add PersonDuplicates **/}
      <PersonRecordHints recordHints={recordHints} />
      <PersonSources
        api={ctx.api}
        sources={sources}
        personWithRelationships={personWithRelationships}
      />
      <PersonFamily {...{ctx, pid, personWithRelationships, queue, tabid}} />
    </View>
    <View style={styles.rightSide}>
      <Search api={ctx.api} pid={pid} personData={{personWithRelationships, sources, recordHints}} />
    </View>
  </View>
)

const renderLoggedOut = ({loginStatus}) => (
  <View style={{alignItems: 'center'}}>
    <LoginButton loginStatus={loginStatus} />
  </View>
)

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  leftSide: {
    flex: 1,
    overflow: 'auto',
    minWidth: 700,
    position: 'relative',
  },

  refreshButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  rightSide: {
    flex: 1,
    minWidth: 1028,
  },
}

