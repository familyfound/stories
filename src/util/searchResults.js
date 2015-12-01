
export default (storyMap, searchText) => {
  if (!storyMap) return []
  let stories = Object.values(storyMap).filter(story => !story.archived)
  if (searchText) {
    const needle = searchText.toLowerCase()
    stories = stories.filter(story => story.title.toLowerCase().indexOf(needle) !== -1)
  }
  return stories.sort((a, b) => a.dateAdded.getTime() -  b.dateAdded.getTime())
}

