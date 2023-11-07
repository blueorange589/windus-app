/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 * 
 * VNotify by : https://codepen.io/kerigard/pen/KKaOKRJ
 */
const { reactive, watch, h, renderSlot, ref, render, createApp } = Vue;
import { utils, store } from '../store.js';

export const VNotify = {
  setup () {
    const content = ref()
    const isVisible = ref(false)
    const time = ref(3000)
    const type = ref('error')
    let interval = null
 
    watch(isVisible, val => {
      if (!val) {
        clearInterval(interval)
      }
    })

    function show(cls, options) {
      clearInterval(interval)
      time.value = 3000
      interval = setInterval(() => {
        time.value -= 10
        if (time.value <= 0) {
          isVisible.value = false
        }
      }, 10)
      type.value = cls
      content.value = options
      isVisible.value = true
    }
    
    return { isVisible, show, content, time, type }
  },
  render: (vm) => { return vm.isVisible ? h('div', { class: 'v-notify '+vm.type }, [
    h('div', { innerHTML: vm.content }),
    h('progress', { class: 'h-1', max: 2400, value: vm.time })
  ]) : undefined }
}

let container = document.createElement('div')
document.body.appendChild(container)
export const NotifyService = createApp(VNotify).mount(container)


export const VModal = {
  setup () {
    const content = ref()
    const title = ref()
    const size = ref('mini')
    const buttons = ref()
    const isVisible = ref(false)

    const clss = {
      mini: 'v-modal-popup w-full max-w-lg bg-gray-800 z-40 h-auto min-w-64',
      midi: 'v-modal-popup w-full max-w-2xl bg-gray-800 z-40 h-auto min-w-64',
      maxi: 'v-modal-popup w-full max-w-6xl bg-gray-800 z-40 h-auto'
    }
    function show(options) {
      title.value = options.title
      content.value = options.content
      size.value = options.size || 'mini'
      buttons.value = options.buttons
      isVisible.value = true
    }

    function hide() { isVisible.value = false }
    
    return { isVisible, show, hide, content, clss, title, size, buttons }
  },
  render: (vm) => { return vm.isVisible ? 
    h('div', { class: 'w-full h-full fixed top-0 left-0 flex justify-center items-center content-center z-30' }, [
      h('div', { class: 'w-full h-full fixed top-0 left-0 bg-black opacity-50 z-30'}),
      h('div', { class: vm.clss[vm.size]}, [
        h('div', { class: 'v-modal-title font-semibold px-4 py-2 border-b text-white', innerHTML: vm.title }),
        h('div', { class: 'v-modal-content px-4'}, [
          vm.content
        ]),
        h('div', { class: 'v-modal-footer p-4 border-t flex justify-between'}, vm.buttons),
      ])
  ]) : undefined }
}

let modalCT = document.createElement('div')
modalCT.id = 'modalCT'
document.body.appendChild(modalCT)
export const ModalService = createApp(VModal).mount(modalCT)

export const VSpinner = {
  setup () {
    const isVisible = ref(false)

    function show(options) {
      isVisible.value = true
    }

    function hide() { isVisible.value = false }
    
    return { isVisible, show, hide }
  },
  render: (vm) => { return vm.isVisible ? 
    h('div', { class: 'w-full h-full fixed top-0 left-0 z-40 flex justify-center items-center content-center'}, [
      h('div', { class: 'w-full h-full fixed top-0 left-0 bg-black opacity-50'}),
      h('div', { class: 'z-40 h-auto min-w-48'}, [
        h('div', {}, [
          h('img', {src: utils.url.file('assets/img/spinner/180-ring.svg'), width: 120, height: 120})
        ]),
      ])
  ]) : undefined }
}

let spinnerCT = document.createElement('div')
spinnerCT.id = 'spinnerCT'
document.body.appendChild(spinnerCT)
export const SpinnerService = createApp(VSpinner).mount(spinnerCT)

export const modal = {
  props: ["title", "bg"],
  emits: ["close"],
  setup(props, ctx) {
    const cls = {'relative w-72 opacity-1 z-9 p-2 rounded-xl shadow shadow-slate-300':true}
    const cbg = props.bg ? 'bg-'+props.bg : 'bg-white'
    cls[cbg] = true
    const md = {
      close: () => {
        ctx.emit('close')
      }
    }
    return { md, cls}
  },
  template: `<div class="w-full h-full fixed top-0 left-0 z-8">
  
    <div class="w-full h-full fixed bg-gray opacity-50"></div> 
    
    <div class="h-full col center-center">
    <div :class="cls">
    
        <div class="absolute right-0 pr-4">
        <icon name="cross" class="text-red cursor-pointer" @click="md.close"></icon>
        </div>
        
        <div class="modal-head" v-if="title">
          <h4>{{ title }}</h4>
        </div>
        <div class="modal-body py-4">
          <slot name="default"></slot>
        </div>
        <div class="modal-foot row between-center">
          <slot name="ftr"></slot>
        </div>
      </div>
    </div>
    
  </div>`
}

export const divide = {
  props: ["size"],
  setup(props) {
    const sz = props.size || 'md'
    const cz = 'divide-' + sz
    const cls = { 'divide': true }
    cls[cz] = true
    return { cls }
  },
  template: `<div :class="cls"></div>`
}

const btnSizes = {
  'sm': 'py-1 my-1 rounded-sm font-medium text-xs',
  'md': 'py-1 my-1 rounded-sm font-medium text-sm',
  'lg': 'space-x-1 py-2 my-2 rounded-md font-medium text-sm',
  'lg': 'space-x-2 py-3 my-3 rounded-lg text-md font-medium'
}
const btnColor = (bg, txt, size) => {
  const s = size || 'md'
  const c = bg || 'secondary'
  const t = txt || 'white'
  const sc = btnSizes[s]
  return `bg-${c} hover:bg-${c}-100 border-${c} text-${t} ${sc}`
}

export const btn = {
  setup(props, ctx) {
    const { show } = store
    const cls = {}
    const clr = btnColor(props.bg, props.color, props.size)
    cls[clr] = true
    return { store, cls }
  },
  props: ["type", "size", "icon", "text", "bg", "color"],
  template: `<button :type="type||'button'" :class="cls">
  <icon v-if="icon" :color="color" :name="icon" :size="size" :class="text?'mr-1':''"></icon>
  {{ text || '' }}
  </button>`
}



const sizes = {
  "sm": "px-2 py-1 text-xs font-normal",
  "md": "px-4 py-2 text-xs font-semibold",
  "lg": "px-8 py-4 text-sm font-bold",
  "xl": "px-16 py-8 text-md font-bold"
}

export const badge = {
  props: ["text", "color", "size"],
  setup(props) {
    const c = props.color || 'green'
    const cls = { 'leading-tight rounded-full': true }
    const cl = 'bg-' + c + '-100 text-' + c
    cls[cl] = true
    const s = props.size || 'md'
    const clz = sizes[s]
    cls[clz] = true
    return { cls }
  },
  template: `<span :class="cls">{{text}}</span>`
}

export const msg = {
  props: ["text", "color", "size"],
  setup(props) {
    const c = props.color || 'green'
    const cls = { 'leading-tight rounded-md': true }
    const clr = 'bg-' + c + '-100 text-' + c
    cls[clr] = true
    const s = props.size || 'md'
    const clz = sizes[s]
    cls[clz] = true
    return { cls }
  },
  template: `<div :class="cls">
  {{text}}
  <slot></slot>
  </div>`
}

const sizesCard = {
  "sm": "p-1 text-xs font-normal",
  "md": "p-2 text-xs font-normal",
  "lg": "p-4 text-sm font-normal",
  "xl": "p-8 text-md font-normal"
}

export const card = {
  props: ["title", "color", "size"],
  setup(props) {
    const cls = { 'card bg-white leading-tight rounded-md': true }
    const bg = props.color ? 'bg-' + props.color + '-100' : 'bg-white'
    cls[bg] = true
    const s = props.size || 'md'
    const clz = sizesCard[s]
    cls[clz] = true
    return { cls }
  },
  template: `<div :class="cls">
    <div class="card-header row between" v-if="title">
      <h3>{{ title }}</h3>
    </div>
    <div class="card-content">
    <slot name="default"></slot>
    </div>
    <div class="card-footer">
    <slot name="ftr"></slot>
    </div>
  </div>`
}

export const avatar = {
  props: ["img", "fname", "lname"],
  setup(props) {
    const ma = (fname, lname) => {
      const f = fname?.charAt(0) || ''
      const l = lname?.charAt(0) || ''
      return [f, l].join('')
    }

    return { ma }
  },
  template: `
  <img :src="img" v-if="img.length>0">
  <div class="bg-gray-100 w-16 h-16 rounded-md" v-else>
    <div class="w-full h-full row center-center text-md font-bold">
      <span>{{ma(fname, lname)}}</span>
    </div>
  </div>
  `
}


export const dropdown = {
  props: ["btn"],
  setup(props) {
    const name = utils.random.hash(6)
    const dd = {
      toggle: () => {
        store.show[name] = !store.show[name]
      }
    }
    const { btn } = props
    store.show[name] = false
    return { dd, name, btn, store }
  },
  template: `<div class="relative inline-block justify-end content-end items-end">
  <btn class="r-0 top-0 self-end" :text="btn.text" :icon="btn.icon" :size="btn.size" :bg="btn.bg" :color="btn.color" @click="dd.toggle"></btn>
  <card class="block overflow-auto origin-top-left absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5" v-show="store.show[name]">
  <slot></slot>
  </card>
  </div>`
}

export const sorters = {
  props: ["options", "btn"],
  emits: ["sort"],
  setup(props, { emit }) {

    const s = reactive({
      sortList: {},
      sort: (k) => {
        if (s.sortList[k]) {
          if (s.sortList[k] === 'asc') {
            s.sortList[k] = 'desc'
            return
          }
          // TODO: unset 
          s.sortList[k] = ''
          return
        }
        s.sortList[k] = 'asc'
      },
      submit: () => {
        emit('sort', s.sortList)
      }
    })
    
    return { s }
  },
  template: `<dropdown :btn="{size:'sm',icon:'sort',text:'sort',bg:'none',color:'primary'}">
  <ul><list-item v-for="item in Object.keys(options)">
  <div class="w-24 row between-center" @click="s.sort(item)">
    <span>{{options[item]}}</span>
    <icon name="arrowUp" v-if="s.sortList[item]==='asc'"></icon>
    <icon name="arrowDown" v-else-if="s.sortList[item]==='desc'"></icon>
    <icon name="minus" v-else></icon>
  </div>
  </list-item></ul>
  <btn text="Sort" size="sm" @click="s.submit"></btn>
  </dropdown>`
}

export const filters = {
  emits: ['filter', 'close'],
  setup(props, ctx) {
    const f = {
      hide: () => { ctx.emit('close') },
      submit: () => { ctx.emit('filter') }
    }
    return { f }
  },
  template: `<modal @close="f.hide">
    <slot></slot>
    <template #ftr>
    <btn class="w-full row center-center" size="sm" text="Filter" @click="f.submit"></btn>
    </template>
  </modal>`
}

export const paginate = {
  props: ["total", "perpage"],
  emits: ['change'],
  setup(props, {emit}) {
    const {total} = props
    const pp = props.perpage || 5
    const pages = Math.ceil(total/pp)
    
    const p = {
      next: () => { store.pager.page++ },
      prev: () => { 
        if(store.pager.page>1) { 
          store.pager.page--
        }
      },
      first: () => { store.pager.page = 1 },
      last: () => { store.pager.page = pages },
      goto: (p) => { store.pager.page = p },
    }
    
    watch(
      () => store.pager.page,
      (pg) => {
        emit('change', pg)
        
        // const q = { page: pg, perpage: pp }
        // ctx.emit('change')
      }
    )
    return {p}
  },
  template: `
  <span class="w-full row end-center">
    <nav aria-label="Table navigation">
      <ul class="row between-center paginate">
        <li>
          <btn size="sm" icon="doubleLeft" @click="p.first"></btn>
        </li>
        <li>
          <btn size="sm" icon="chevronLeft" @click="p.prev"></btn>
        </li>
        <li class="row between-center">
          <ftext inputcls="pager" size="xs" name="page" :value="p.page" @update="p.goto"></ftext>
          <span class="mx-1">/</span> 
          <span>total</span>
        </li>
        <li>
          <btn size="sm" icon="chevronRight" @click="p.next"></btn>
        </li>
        <li>
          <btn size="sm" icon="doubleRight" @click="p.last"></btn>
        </li>
      </ul>
    </nav>
  </span>
`
}