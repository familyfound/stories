
import APIManager from './APIManager'
import config from '../_config'

export default new APIManager(config.apiBase, config.clientId)

