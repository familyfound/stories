
import React from 'react'

import View from '../View'
import Text from '../Text'
import Colors from '../util/Colors'
import Button from '../Button'

import connect from '../connect'

const TabsList = ({tabs, ctx, tabid}) => (
  <View style={styles.container}>
    <View onClick={() => ctx.actions.goHome()} style={[styles.tab, tabid == null && styles.selectedTab]}>
      Queue
    </View>
    {tabs.map((tab, i) => (
      <View key={i} onClick={() => ctx.actions.goToTab(i)} style={[styles.tab, styles.personTab, tabid == i && styles.selectedTab]}>
        {tab.title}
        <Button style={[styles.closeButton, tabid == i && styles.closeButtonSelected]} onClick={() => ctx.actions.removeTab(tab)}>
          &times;
        </Button>
      </View>
    ))}
  </View>
)

export default connect({
  props: ['tabs'],
  render: TabsList,
})

const styles = {
  container: {
    flexDirection: 'row',
    boxShadow: '0 2px 5px #ccc',
    zIndex: '1000',
  },

  tab: {
    padding: '5px 10px',
    flexDirection: 'row',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    position: 'relative',
    borderRight: '1px solid #ccc',
    borderBottom: '1px solid white',
    color: '#999',
    borderBottomColor: 'white',
  },

  personTab: {
    flexShrink: 1,
    paddingRight: 30,
    overflow: 'hidden',
    minWidth: 30,
    width: 200,
  },

  closeButton: {
    cursor: 'pointer',
    marginLeft: 5,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
    border: 'none',
  },

  closeButtonSelected: {
    // backgroundColor: '#eee',
  },

  selectedTab: {
    // backgroundColor: '#eee',
    borderBottomColor: 'blue',
    color: 'black',
  },
}

