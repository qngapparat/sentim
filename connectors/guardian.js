const fetch = require('node-fetch')

const guardianapikey = "98314a96-a2d9-47c6-a3dc-a34493f97ff7"
const baseUrl = "https://content.guardianapis.com/search"

function authfetch(...fetchargs){
  // add api key to URL query
  let url = new URL(fetchargs[0])
  url.searchParams.set('api-key', guardianapikey)
  return fetch(url, ...(fetchargs.slice(1)))
}

const grd = {
  /** Does an auth'd GET to Guardian with passed query params
   * @param {*} queryObj Object with query params
   * @param {*} [options] Eg. 'cooldown' between reqs (in s)
   * @example grd.get({ q: 'whales', date: '2020-01-01' })
   * @returns {string} Fetched JSON
   */
  get: (queryObj) => {
    let url = new URL(baseUrl)
    // add each query param to URL
    Object.keys(queryObj).map(qk => url.searchParams.set(qk, queryObj[qk]))
    return authfetch(url).then(r => r.json())
  }
}

module.exports = { grd }