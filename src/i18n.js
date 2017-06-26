
const strings = {
  welcome: {
    en: logo => <span>Welcome to {logo}!</span>,
    de: logo => <span>Wilkommen bei {logo}!</span>,
  },

  nowSyncing: {
    es: null,
    de: 'Jetzt sychronizieren! Sie können auf die Geschichten clicken auf der linke Seite sobald sie auftauchen.',
    en: 'Now synchronizing! You can click the stories on the left to start reading when they appear.',
  },

  tagLine: {
    es: '',
    de: 'ist ein einfaches, freundliches Werkzeug das Ihnen hilft, sich mit den Geschichten Ihren Vorfahren vertraut zu werden.',
    en: 'is a simple, friendly tool for getting acquainted with the stories of your ancestors.',
  },

  startSyncing: {
    es: '',
    de: 'Jetzt clicken um den Sychronizierungsprozess mit FamilySearch anzufangen, um die Geschichten Ihre Vorfahren und ihre Geschwister herunterzuladen.',
    en: 'Click below to synchronize with FamilySearch and download the stories of your direct ancestors and their siblings back 9 generations.',
    // Just click the button below to login with FamilySearch, and then you can synchronize and download the stories of your direct ancestors and their siblings back 9 generations.
  },

  incompleteSync: {
    es: '',
    de: '',
    en: lastSyncStart => `The last sync was incomplete (started ${lastSyncStart.toLocaleString()}), so you can click "synchronize" below to sync again, or just read the stories that are loaded :)`,
  },

  completeSync: {
    es: '',
    de: '',
    en: lastSyncStart => `You can click the stories on the left to start reading them, or click the "synchronize" button to re-sync with FamilySearch. Last synchronized ${lastSyncStart.toLocaleString()}`,
  },
}

const getLang = lang => {
  const singles = {};
  Object.keys(strings).forEach(name => {
    singles[name] = strings[name][lang] || strings[name].en;
  });
  return singles;
}

export default getLang('en');
