/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
const { reactive, h } = Vue;
import { store, utils, xhr } from '../../core/app/store.js';
import { ModalService } from '../../core/app/components/elements.js';
import { icon } from '../../core/app/helpers/icons.js';
import { auth } from '../auth/auth.js';

const admin = {}
admin.data = reactive({
  options: {},
  projects: [],
  component_groups: [],
  rename: {
    project: { id: '', name: '' },
    group: { id: '', name: '' }
  },
  add: {
    group: {name: ''},
    project: {name: ''}
  },
  show: {
    addGroup: false,
    addProject: false
  }
})

admin.events = {
  options: {
    get: async() => {
      const r = await xhr.database({run:'select', from: 'wd_options', select:['option', 'value']}).then(r => {
        const opts = {}
        r.data.forEach((obj, i) => { opts[obj['option']] = obj['value'] })
        admin.data.options = opts
        return opts
      })
    return new Promise((resolve) => resolve(r))
    }
  },
  groups: {
    get: async() => {
      const res = await xhr.database({run:'select', from: 'wd_component_groups', order: {name: 'asc'}})
      if(res.data.length) { admin.data.component_groups = res.data }
    },
    add: async() => {
      const {name} = admin.data.add.group
      const res = await xhr.database({run:'insert', from: 'wd_component_groups', data: {name, framework: 'tw'}}).then(r => {
        admin.events.groups.get()
        admin.data.show.addGroup = false
        admin.data.add.group = {name: ''}
      })
    },
    delete: async(id) => {
      const cf = confirm('are you sure? componet group will be deleted permanently')
      if(cf === true) {
        const res = await xhr.database({run:'delete', from: 'wd_component_groups', match:{id}}).then(r => {
          admin.events.groups.get()
        })
      }
    },
    rename: async(id) => {
      const {name} = admin.data.rename.group
      const res = await xhr.database({run:'update', from: 'wd_component_groups', data: {name}, match: {id}}).then(r => {
        admin.events.groups.get()
        admin.data.rename.group = {id: '', name: ''}
      })
    },
  },
  projects: {
    get: async() => {
      const res = await xhr.database({run:'select', from: 'wd_projects', order:{name:'asc'}})
      if(res.data.length) { admin.data.projects = res.data }
    },
    add: async() => {
      const {name} = admin.data.add.project
      const res = await xhr.database({run:'insert', from: 'wd_projects', data: {name, framework: 'tw'}}).then(r => {
        admin.events.projects.get()
        admin.data.show.addProject = false
        admin.data.add.project = {name: ''}
      })
    },
    delete: async(id) => {
      const cf = confirm('are you sure? project will be deleted permanently')
      if(cf === true) {
        const res = await xhr.database({run:'delete', from: 'wd_projects', match:{id}}).then(r => {
          admin.events.projects.get()
        })
      }
    },
    rename: async(id) => {
      const {name} = admin.data.rename.project
      const res = await xhr.database({run:'update', from: 'wd_projects', data: {name}, match: {id}}).then(r => {
        admin.events.projects.get()
        admin.data.rename.project = {id: '', name: ''}
      })
    },
    setDefault: async(id) => {
      const res = await xhr.database({run:'update', from: 'wd_options', data: {value: id}, match: {option: 'default_project'}}).then(r => {
        admin.events.options.get()
      })
    }
  }
}


const navbar = {
  props: ['links'],
  setup() { 
    return { store, auth, utils } 
  },
    template: `
    <nav class="bg-primary" id="nolh1q">
    <div class="mx-auto max-w-7xl" id="p18bvd">
      <div class="flex h-16 items-center justify-between mx-auto max-w-6xl" id="sxnv6w">
        <div class="flex items-center" id="xy7afl">
          <div class="flex-shrink-0" id="4whibb">
            <img class="h-8" :src="utils.url.file('assets/img/windus.svg')" alt="Windus" id="06imiv">
          </div>
        </div>
        <div class="hidden md:block lbs" id="aglaa4" v-if="links">
          <div class="ml-10 flex items-baseline space-x-4 lbs" id="lwjyhp">
            <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium lbs"
              id="ocxshm" @click="store.router.push({name:'home'})">Home</a>
            <a href="#" class="text-white rounded-md px-3 py-2 text-sm font-medium bg-secondary" aria-current="page"
              id="ydc1dy" @click="store.router.push({name:'builder'})">Launch Builder</a>
            <a href="#" @click="auth.events.signOut" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium lbs"
              id="tg0by7">Logout</a>
          </div>
        </div>
      </div>
    </div>
  </nav>`
}

const foobar = {
  template: `  <footer class="py-2 bg-gray-900 text-white" id="hxsvhx">
  <div class="mx-auto max-w-6xl h-full p-2 w-full flex justify-between text-xs" id="53zkng">
    <div class="p-2" id="pe6fvc">Need support? Send us a support request on Codecanyon.</div>
    <div class="p-2" id="dj4ef4">Share your feedback. Rate Windus on Envato.</div>
  </div>
</footer>`
}

export const container = {
  name: 'admin',
  components: {navbar, foobar},
  setup(props, ctx) {
    admin.events.options.get().then(r=> {
      admin.events.projects.get().then(rp => {
        admin.events.groups.get()
      })
    })

  return { store, admin, ctx }
  },
  template: `
  <div class="flex flex-col h-full">
  <navbar :links="true"></navbar>
  <div class="grow bg-body h-full" id="vi2pta">
    <div class="mx-auto max-w-6xl h-full py-4 pb-12" id="9fdjal">
      <div class="border-b border-slate-800" id="sx1mt4">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight" id="gm7pfw">
          Dashboard</h2>
      </div>
      <div class="p-2 grid gap-3 grid-cols-1 lg:grid-cols-2" id="6zcsm3">
        <div class="bg-white rounded-md outline-width-1 outline-color-slate-800 shadow-md drop-shadow-lg border hover:border-gray-400">
          <div class="bg-slate-900 text-white flex justify-between items-center"><h3 class="p-2" id="cdaffs">Projects</h3></div>
          <div class="max-h-96 overflow-y-scroll p-2 divide-y-2 relative pb-10">
            <div class="flex items-center justify-between" v-for="(p,i) in admin.data.projects">
              <div class="flex">
                <div class="pl-2">
                  <div v-if="admin.data.rename.project.id === p.id" class="divide-x-2 space-x-2">
                    <input :value="p.name" class="bg-blue-200" @change="(e) => {admin.data.rename.project.name=e.target.value}"/>
                    <a href="javascript:;" @click="admin.data.rename.project.id=''" class="text-xs text-gray-700">cancel</a>
                    <a href="javascript:;" @click="admin.events.projects.rename(p.id)" class="text-xs text-indigo-700">submit</a>
                  </div>
                  <div v-else>
                    <span class="tracking-tight text-gray-900 font-semibold">{{p.name}}</span>
                    <span v-if="admin.data.options.default_project === p.id" class="text-xs text-gray-500 ml-2">(default)</span>
                  </div>
                </div>
              </div>
              <div class="p-2 flex space-x-3">
                <a href="javascript:;" @click="admin.events.projects.setDefault(p.id)" title="set default"><icon size="lg" class="hover:fill-green-500" name="tag"></icon></a>
                <a href="javascript:;" @click="admin.data.rename.project.id = p.id; admin.data.rename.project.name = p.name" title="rename"><icon size="lg" class="hover:fill-green-500" name="pencil"></icon></a>
                <button @click="admin.events.projects.delete(p.id)" title="delete"><icon size="lg" class="hover:fill-red-500" name="crossCircle"></icon></button>
              </div>
            </div>
          </div>

          <div 
            class="flex items-center place-content-center text-center space-x-1 bg-slate-200 py-2 absolute bottom-0 w-full cursor-pointer" 
            >
            <div class="space-x-2 divide-x-2" v-if="admin.data.show.addProject">
              <input placeholder="Name of new project" class="bg-blue-200" @change="(e) => {admin.data.add.project.name=e.target.value}"/>
              <a href="javascript:;" @click="admin.data.show.addProject = false" class="text-xs text-gray-700">cancel</a>
              <a href="javascript:;" @click="admin.events.projects.add" class="text-xs text-indigo-700">submit</a>
            </div>
            <div class="flex items-center" @click="admin.data.show.addProject = true" v-else>
              <icon size="md" class="text-blue-500" name="plus"></icon>
              <a class="font-medium transition-all duration-300 group-hover:text-blue-500/80 text-secondary">Add new project</a>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-md outline-width-1 outline-color-slate-800 shadow-md drop-shadow-lg border hover:border-gray-400">
          <div class="bg-slate-900 text-white flex justify-between items-center"><h3 class="p-2" id="cdaffs">Component Groups</h3></div>
          <div class="max-h-96 overflow-y-scroll p-2 divide-y-2 relative pb-10">
            <div class="flex items-center justify-between" v-for="(g,i) in admin.data.component_groups">
              <div class="flex">
                <div class="pl-2">
                  <div v-if="admin.data.rename.group.id === g.id" class="divide-x-2 space-x-2">
                    <input :value="g.name" class="bg-blue-200" @change="(e) => {admin.data.rename.group.name=e.target.value}"/>
                    <a href="javascript:;" @click="admin.data.rename.group.id=''" class="text-xs text-gray-700">cancel</a>
                    <a href="javascript:;" @click="admin.events.groups.rename(g.id)" class="text-xs text-indigo-700">submit</a>
                  </div>
                  <div v-else>
                    <span class="tracking-tight text-gray-900 font-semibold">{{g.name}}</span>
                  </div>
                </div>
              </div>
              <div class="p-2 flex space-x-3">
                <a href="javascript:;" @click="admin.data.rename.group.id = g.id; admin.data.rename.group.name = g.name" title="rename"><icon size="lg" class="hover:fill-green-500" name="pencil"></icon></a>
                <button @click="admin.events.groups.delete(g.id)" title="delete"><icon size="lg" class="hover:fill-red-500" name="crossCircle"></icon></button>
              </div>
            </div>
          </div>

          <div 
            class="flex items-center place-content-center text-center space-x-1 bg-slate-200 py-2 absolute bottom-0 w-full cursor-pointer" 
            >
            <div class="space-x-2 divide-x-2" v-if="admin.data.show.addGroup">
              <input placeholder="Name of new component group" class="bg-blue-200" @change="(e) => {admin.data.add.group.name=e.target.value}"/>
              <a href="javascript:;" @click="admin.data.show.addGroup = false" class="text-xs text-gray-700">cancel</a>
              <a href="javascript:;" @click="admin.events.groups.add" class="text-xs text-indigo-700">submit</a>
            </div>
            <div class="flex items-center" @click="admin.data.show.addGroup = true" v-else>
              <icon size="md" class="text-blue-500" name="plus"></icon>
              <a class="font-medium transition-all duration-300 group-hover:text-blue-500/80 text-secondary">Add new group</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <foobar></foobar>
</div>
`
}