/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
const { reactive } = Vue;

import { config } from '../../config.js'
import { query } from '../../core/app/helpers/local.js'
import { NotifyService, SpinnerService } from './components/elements.js'

export const templates = {}

// store.js
export const store = reactive({
  me: false,
  router: {},
  nextRoute: {},
  settings: {disableAuth: false},
  pager: { page: 1 },
})

export const ctMain = {
  event: (e, obj) => {
    if(e === 'error') { NotifyService.show('error', obj.message) }
    if(e === 'success') { NotifyService.show('success', obj.message) }
  },
  signIn: () => { 
    return new Promise(resolve => setTimeout(resolve, 100, true))
  },
  logout() {
    store.me = null
  },
}


export const utils = {
  string: {
    ucfirst: (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
  },
  date: {
    now: () => { return new Date() },
    toUnix: (dt) => (dt.getTime() / 1000),
    toISO: (dt) => { return dt.toISOString() },
    format: (dt) => { 
      return dt.toLocaleString(config.locale, 
      { dateStyle: 'short', timeStyle: 'long' })
    },
    nowdate: () => {
      return utils.date.format(utils.date.now())
    }
  },
  random: {
    number: () => { return parseInt(Math.random() * 100) },
    hash: (numChars = 8) => {
      return Array.from(Array(numChars), () => Math.floor(Math.random() * 36).toString(36)).join('');
    },
  },
  url: {
    base: '',
    sub: '',
    full: () => { return [utils.url.base, utils.url.sub].join('') },
    file: (fn) => { return [utils.url.full(),fn].join('/') },
    link: (fn) => { return [utils.url.sub,fn].join('') },
    backend: (ep) => { return config.dev.apiURL+ep }
  },
  file: {
    export: (filename, type, content) => {
      var uri = `data:${type};charset=utf-8,` + encodeURIComponent(content);
			var download_link = document.createElement('a');
			download_link.href = uri;
			var ts = new Date().getTime();
			download_link.download = filename;
			document.body.appendChild(download_link);
			download_link.click();
			document.body.removeChild(download_link);
    }
  }
}

export const logger = (input) => {
  const msg = [typeof(input), JSON.stringify(input)].join('|')
  const dt = localStorage.getItem('errors')
  const entries = JSON.parse(dt) || []
  if (entries.length > 10) {
    entries.splice(0, 1)
  }
  entries.unshift(msg)
  const out = JSON.stringify(entries)
  localStorage.setItem('errors', out)
  dbDev.getErrors()
}

export const xhr = {
  options: {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: {}
  },
  request: async (url, opts) => {
    // spinner start
    SpinnerService.show()
    let o = {...xhr.options, ...opts}
    if (o.method !== 'GET') {
      o.body = ((o.headers['Content-Type'] === 'application/json') ? JSON.stringify(o.body) : o.body)
    }

    /* SpinnerService.hide()
    return {} */
    const response = await fetch(url, o)
      .then((response) => {
        SpinnerService.hide()
        if (response.ok) {
          return response.json()
        } else if(response.status === 404) {
          return Promise.reject('error 404')
        } else {
          return Promise.reject('some other error: ' + response.status)
        }
      })
      .catch((err) => {console.log(err)})    
    // spinner end
    return new Promise(resolve => resolve(response))
  },
  supabase: async(ep, body) => {
    const url = utils.url.backend('/sb'+ep)
    const opts = {body, method: 'POST'}
    const res = await xhr.request(url, opts)
    return new Promise(resolve => resolve(res))
  },
  mariadb: async(ep, body) => {
    const url = utils.url.backend('/db'+ep)
    const opts = {body, method: 'POST'}
    const res = await xhr.request(url, opts)
    return new Promise(resolve => resolve(res))
  },
  local: async(body) => {
    const res = await query(body)
    return new Promise(resolve => resolve(res))
  },
  database: async(body) => {
    let res;
    if(config.dev.database === 'supabase') {
      res = await xhr.supabase('/query', body)
    }

    if(config.dev.database === 'mariadb') {
      res = await xhr.mariadb('/query', body)
    }
    //console.log(res)
    return new Promise(resolve => resolve(res))
  },
  auth: async(ep, body) => {
      let res;
      if(config.dev.database === 'supabase') {
        res = await xhr.supabase(ep, body)
      }

      if(config.dev.database === 'mariadb') {
        res = await xhr.mariadb(ep, body)
      }
      // console.log(res)
      return new Promise(resolve => resolve(res))
  },
  file: async(ep, body) => {
    const url = utils.url.backend('/file/'+ep)
    const opts = {body, method: 'POST'}
    const res = await xhr.request(url, opts)
    return new Promise(resolve => resolve(res))
  }
}



export const getSubdir = (subs) => {
  const parts = subs.split('/')
  if(!parts.length) { return '/' }
  const subdirs = ['admin', 'user', 'dev', 'auth', 'site', 'page']
  const nonrouted = []
  let stop = false
  parts.forEach(part => {
    if(subdirs.includes(part) || stop) { 
      stop = true 
      return 
    }
    nonrouted.push(part)
  })
  return nonrouted.join('/')
}

let id = 1
export const makeRoute = (routeProps) => {
  const {pathname} =  window.location
  const subdir = getSubdir(pathname)
  if(subdir !== '/') { routeProps.path = subdir + routeProps.path }
  id++
  routeProps.id = id
  return routeProps
}