/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
const { createApp, reactive } = Vue;

import { addOns } from "./addons/addons.js";
import { config } from "./config.js";
import { store, utils, getSubdir, makeRoute } from "./core/app/store.js";
import {
  modal,
  divide,
  card,
  btn,
  badge,
  msg,
  filters,
  sorters,
  dropdown,
  paginate,
} from "./core/app/components/elements.js";
import {
  notFound,
  unauthorized,
} from "./core/app/components/layout.js";
import { listItem, listImage } from "./core/app/components/listview.js";
import { tablewrap } from "./core/app/components/table.js";
import { errlist } from "./core/app/helpers/validate.js";
import {
  ftext,
  fshow,
  farea,
  fselect,
  fradio,
  fcheck,
  fmoney,
} from "./core/app/components/forms.js";
import { icon } from "./core/app/helpers/icons.js";

const app = createApp({
  setup() {
    const { origin, pathname } = window.location;
    const subdir = getSubdir(pathname)
    utils.url.base = origin;
    utils.url.sub = subdir.slice(-1) === "/" ? subdir.slice(0, -1) : subdir;

    const localHosts = ['127.0.0.1', '0.0.0.0', 'localhost']
    localHosts.forEach(h => { 
      if(origin.search(h)) { 
        config.dev.mode = 'development'
      } else {
        config.dev.mode = 'production'
      } })
    return { store };
  },
})


// BASE COMPONENTS
app.component("btn", btn)
app.component("badge", badge)
app.component("msg", msg)
app.component("icon", icon)
app.component("modal", modal)
app.component("divide", divide)
app.component("card", card)
app.component("dropdown", dropdown)

app.component("ftext", ftext)
app.component("fshow", fshow)
app.component("farea", farea)
app.component("fselect", fselect)
app.component("fradio", fradio)
app.component("fcheck", fcheck)
app.component("fmoney", fmoney)
app.component("errlist", errlist)

app.component("filters", filters)
app.component("sorters", sorters)
app.component("paginate", paginate)
app.component("listItem", listItem)
app.component("tablewrap", tablewrap)
app.component("ListImage", listImage)


const routes = [
  //makeRoute({path: "/", name:"site-home", component:home}),
  makeRoute({path: "/site/notfound", name:"site-notfound", component:notFound}),
  makeRoute({path: "/site/unauthorized", name:"site-unauthorized", component:unauthorized}),
];

const addOnMounts = async() => {
  const ready = await Promise.all(
    Object.keys(addOns).map((addOn, index) =>
      import(`./addons/${addOn}/${addOn}.js`)
    )
  ).then((modules) => {
    const mods = {}
    modules.forEach((mod) => {
      const { name } = mod.container;
      mods[name] = mod
      const initers = addOns[name];
  
      // register component
      const routeProps = {...initers, ...{component: mod.container}}
      const rt = makeRoute(routeProps)
      routes.push(rt)
      app.component(`${name}`, mod.container)

      // register routes
      const subs = initers.routes || {};
      Object.keys(subs).forEach((sk) => {
        if(!subs[sk].component) {
          subs[sk].component = {template: `<div class="view-${subs[sk].name}">${subs[sk].name}</div>`}
        }
        const newrt = makeRoute(subs[sk])
        routes.push(newrt)
        app.component(`${subs[sk].name}`, subs[sk].component)
      })

      if (initers.init) initers.init()
    })
    return mods
  })
  return new Promise(resolve => resolve(ready))
}




const appMount = async() => {
  const me = localStorage.getItem('wdsess')
  if(me) { store.me = JSON.parse(me) }

  const res = await addOnMounts().then(async(mods) => {
    const router = VueRouter.createRouter({
      history: VueRouter.createWebHistory(),
      routes,
    })

    
    router.beforeEach(async (to, from) => {
      const { me } = store,
      { meta } = to;
      if (meta.reqAuth) {
        if(!me) {
          store.nextRoute = to;
          return { name: "auth-login" };
        }
      }
    })
    
    app.use(router)
    store.router = router;
    
    app.mount("#app")
  })
}
appMount()

