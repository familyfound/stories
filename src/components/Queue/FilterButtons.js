
import React from 'react'
import View from '../../View'
import Text from '../../Text'
import Hoverable from '../Hoverable'
import Colors from '../../util/Colors'

const filterStatuses = {
  active: 'Active',
  later: 'Do later',
  done: 'Done',
}

const FilterButtons = ({onChange, selected, counts}) => (
  <View style={styles.filterButtons}>
    {Object.entries(filterStatuses).map(([key, value]) => {
      const isSelected = key === selected
      return (
        <Hoverable
          style={[
            styles.filterButton,
            {borderBottomColor: isSelected ? Colors.Status[key] : Colors.Status.Light[key]},
            isSelected && styles.selectedFilterButton
          ]}
          hoverStyle={[styles.filterButtonHover, {
            borderBottomColor: Colors.Status[key],
          }]}
          onClick={!isSelected && (() => onChange(key))}
          key={key}
        >
          {value} <Text style={styles.filterButtonCount}>
            {counts[key]}
          </Text>
        </Hoverable>
      )
    })}
  </View>
)

export default FilterButtons

const styles = {
  filterButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  filterButton: {
    cursor: 'pointer',
    padding: '5px 5px',
    margin: '0 5px',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: '5px solid white',
    fontVariant: 'small-caps',
    color: '#777',
  },

  filterButtonHover: {
    opacity: 1,
    color: 'black',
  },

  filterButtonCount: {
    marginLeft: 10,
    fontSize: '80%',
  },

  selectedFilterButton: {
    color: 'black',
    fontWeight: 'bold',
    cursor: 'default',
    opacity: 1,
  },
}
