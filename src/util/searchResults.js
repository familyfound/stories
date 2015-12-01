
export default (storyMap, searchText) => {
  if (!storyMap) return []
  let stories = Object.values(storyMap).filter(story => !story.archived)
  if (searchText) {
    const needle = searchText.toLowerCase()
    stories = stories.filter(story => story.title.toLowerCase().indexOf(needle) !== -1)
  }
  return stories.sort((a, b) => {
    if (a.starred && !b.starred) return -1
    if (b.starred && !a.starred) return 1
    return a.dateAdded.getTime() -  b.dateAdded.getTime()
  })
}

