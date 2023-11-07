const {h} = Vue;

import { ModalService, NotifyService } from '../../../core/app/components/elements.js'
import { utils, store } from '../../../core/app/store.js';
import { rcLayout } from '../components/reactive.js';
import { htmlTags } from '../options.js';
import { twoptions } from '../twoptions.js';

const ui = {
  btnCancel: 'bg-gray-800 text-white px-2 py-1',
  btnConfirm: 'bg-green-800 text-white px-2 py-1'
}

export const ctLayout = {
  ref: '',
  classRef: '',
  closeModal: ModalService.hide,
  preview: {
    set: (pv) => {
      const sizes = {desktop: {w:1100, h: 600}, tablet: {w:800, h:480}, mobile: {w:375, h:480}}
      const {w, h} = sizes[pv]
      rcLayout.preview = pv

      if(pv !== 'desktop') {
        const ct = document.getElementById('layoutContainer')
        const iframe = document.getElementById('responsiveView')
        iframe.style.width=w+'px'
        iframe.style.height=h+'px'
        iframe.style.overflowY='scroll'
        iframe.style.border='2px solid #444'

        const styles = document.querySelector("head > style")
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const ih = iframeDocument.querySelector('head')
        iframe.srcdoc = '<link rel="stylesheet" href="/assets/css/4ft.css"/>' + styles.outerHTML + ct.innerHTML
      }
    },
    next: () => {
      const {preview} = rcLayout
      let next = 'desktop'
      if(preview === 'mobile') next = 'tablet'
      if(preview === 'tablet') next = 'desktop'
      if(preview === 'desktop') next = 'mobile'
    ctLayout.preview.set(next)
    },
    dark: () => {
      const ct = document.getElementById('layoutContainer')
      ct.classList.add('dark')
    }
  },
  setViewport: (vp) => {
    rcLayout.viewport = vp
  },
  deselect: (id) => { 
    rcLayout.selected = {id: '', tag:'', class: []}
    document.getElementById(id).classList.remove('selected') 
  },
  deselectCurrent: () => {
    const {id} = rcLayout.selected
    if(id) { ctLayout.deselect(id) }
  },
  clearSelected: () => {
    var x = document.querySelectorAll(`#layoutContainer *`);
    x.forEach(function(elem) {
      if(elem.classList.contains('selected')) {
        elem.classList.remove('selected')
      }
    });
    rcLayout.selected = {id: '', tag:'', class: []}
  },
  all: (id) => {
    var x = document.querySelectorAll(`#${id} > *`);
    x.forEach(function(elem) {
      elem.style.height = "30px"
    });
  },
  regenerateID: () => {
    const elid = rcLayout.selected.id
    const elem = document.getElementById(elid)
    elem.id = utils.random.hash(6)
  },
  regenerateIDs: (comp) => {
    const ch = comp.querySelectorAll(`*`);
    ch.forEach(function(elem, idx) {
      elem.id = utils.random.hash(6)
      elem.classList.add('lbs')
      /*
      elem.draggable = true
      elem.ondragstart = ctLayout.dragstart
      // elem.ondragend = ctLayout.dragend
      if(elem.tagName === 'DIV') {
        elem.ondrop = ctLayout.drop
        elem.ondragover = ctLayout.dragover
      } */
    })
    comp.id = utils.random.hash(6)
    return comp
  },
  dragstart: (ev) => { ctLayout.ref = ev.target },
  dragend: (ev) => { ev.preventDefault(); console.log(ev.target) },
  dragover: (ev) => { ev.preventDefault(); },
  drop: (ev) => {
    ev.preventDefault()
    const {ref} = ctLayout
    ref.parentNode.removeChild(ref);
    ev.target.appendChild(ref);
  },
  newSection: () => {
    const nk = utils.random.hash(6)
    const sc = document.createElement('div')
      sc.classList.add('lbs')
      sc.id = nk
    return sc
  },
  newElement: (tag) => {
    const nk = utils.random.hash(6)
    const sc = document.createElement(tag)
      sc.classList.add('lbs')
      sc.id = nk
    return sc
  },
  makeNode: (html) => {
    const p = document.createElement('div')
    p.insertAdjacentHTML("afterbegin", html);
    return p.firstElementChild
  },
  getElementProperties: (el) => {
    const {id} = el
    const tag = el.tagName
    const cls = Array.from(el.classList)
    return {id, class: cls, tag}
  },
  click: {
    left: (e) => {
      e.preventDefault(); 
      if(!e.target.id) { e.target.id = utils.random.hash(6) }
      if(!e.target.classList.contains('lbs')) { e.target.classList.add('lbs') }
      
      ctLayout.clearSelected()
      e.target.classList.add('selected')
      rcLayout.selected.id = e.target.id
      rcLayout.selected.tag = e.target.tagName
      rcLayout.selected.class = Array.from(e.target.classList)
    }
  },
  sec: {
    addString: (string) => {
      const node = ctLayout.makeNode(string)
      const target = document.getElementById(rcLayout.selected.id)
      target.appendChild(node)
    },
    addElement: (event) => {
      if(!rcLayout.page.id) { alert('please select a page to work on'); return }
      const opts = []
      htmlTags.forEach(tag=> {
        const opt = h('option', { value: tag, innerText: tag })
        opts.push(opt)
      })

      let t = 'div'
      const tagSelected = (e)=> { t = e.target.value }
      const tagSubmit = (e) => { 
        const elid = rcLayout.selected.id
        const parent = document.getElementById(elid)
        let el = ctLayout.newElement(t)
        el.draggable = true
        el.classList.add('p-2')
        parent.appendChild(el)
        ModalService.hide()
      }

      const md = { title: 'Add element', content: h('select', { value: t, onchange: tagSelected }, [opts]),
        buttons: [
          h('button', {class:ui.btnCancel, innerText: 'cancel (esc)', onclick: ModalService.hide }),
          h('button', {class:ui.btnConfirm, innerText: 'confirm', onclick: tagSubmit }),
        ]}
      ModalService.show(md)
    },
    remove: (e) => {
      const elid = rcLayout.selected.id
      document.getElementById(elid).remove()
      rcLayout.selected.id = ''
      rcLayout.selected.class = []
    },
    setInnerText: (evt) => {
      if(!rcLayout.selected.id) {
        NotifyService.show('error', 'select an element to set it\'s inner text')
        return
      }
      const elid = rcLayout.selected.id
      const elem = document.getElementById(elid)
      let txtval = elem.innerText
      const dummyText = (e) => {
        const sizes = {
          mini: 'sample',
          midi: 'sample text',
          sentence: 'Nunc fringilla feugiat libero, vel placerat arcu vehicula eget.',
          paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eleifend nec ligula et posuere. Suspendisse potenti. Nulla facilisi. Donec lacinia metus id orci placerat tincidunt. Nunc volutpat arcu sed facilisis aliquet. Duis fermentum nec nibh at maximus. Morbi ut metus ex. Duis condimentum orci at elit maximus varius.'
        }
        txtval = sizes[e.target.attributes.size.value]
        document.getElementById('itInput').value = txtval
      }
      const textChange = (e) => { txtval = e.target.value}
      const textAdd = (e) => { elem.innerText = txtval; ModalService.hide() }
      const md = { title: 'Set Inner Text', content: h('div', {}, [
        h('div', {class: 'flex flex-row justify-between [&>button]:text-white'}, [
          h('button', { innerText: '1 word', size:'mini', onclick: dummyText }),
          h('button', { innerText: '2 words', size:'midi', onclick: dummyText }),
          h('button', { innerText: 'sentence', size:'sentence', onclick: dummyText }),
          h('button', { innerText: 'paragraph', size:'paragraph', onclick: dummyText }),
        ]),
        h('textarea', { id:'itInput', class:'w-full h-24', value: txtval, oninput: textChange }),
      ]),
        buttons: [
          h('button', {class:ui.btnCancel, innerText: 'cancel (esc)', onclick: ModalService.hide }),
          h('button', {class:ui.btnConfirm, innerText: 'confirm', onclick: textAdd }),
        ]}
      ModalService.show(md)
    }
  },
  tabs: {
    switch: (tab) => { 
      rcLayout.tabs.tab = tab
      rcLayout.tabs.items = twoptions[tab]
    },
    class: (tab) => { 
      const cls = {"p-2 cursor-pointer": true}
      const bg = rcLayout.tabs.tab === tab ? 'bg-gray-800 font-semibold' : 'bg-gray-600'
      cls[bg] = true
    return cls
    }
  },
  common: {
    generateID: (el) => { el.id = utils.random.hash(6); return el.id },
  },
  quit: () => {
    clearInterval(rcLayout.autosaveId)
    store.router.push({name: 'home'})
  }
}
