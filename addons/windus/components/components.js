const {h} = Vue;

import { ModalService, NotifyService } from '../../../core/app/components/elements.js'
import { dbLayout } from './database.js';
import { rcLayout } from './reactive.js';
import { ctLayout } from './controller.js';
import { xhr } from '../../../core/app/store.js';

const ui = {
  btnCancel: 'bg-gray-800 text-white px-2 py-1',
  btnConfirm: 'bg-green-800 text-white px-2 py-1'
}

const getRefs = () => { return {group: false, comp: {}, compname: ''}}
export const components = {
  editor: {
    ref: getRefs(),
    loadComponents: async(gid) => {
      if(!components.editor.ref.group) {
        alert('select a group first')
        return
      }
      const olist = await dbLayout.getComponents(components.editor.ref.group).then(comps => {
        console.log(rcLayout.components)
        const compList = document.getElementById('compList')
        compList.innerHTML = ''
        comps.forEach(comp => {
          const cel = document.createElement('li')
          cel.classList.add('cursor-pointer')
          cel.innerText = comp.name
          cel.onclick = (e) => {
            const pvw = document.getElementById('compPreview')
            const rnm = document.getElementById('compRename')
            pvw.innerHTML = comp.html
            components.editor.ref.comp = comp
            rnm.value = comp.name
          }
          compList.appendChild(cel)
        })
      })
    },
    groupSelected: async(e) => {
      const gid = Array.from(e.target.attributes).filter((obj) => { if(obj.nodeName === 'gid') return obj })
      components.editor.ref.group = gid[0].value
      components.editor.loadComponents()
    },
    display: async() => {
      components.editor.ref = getRefs()
      const glist = await dbLayout.getComponentGroups().then((groups,gidx) => {
        const hopts = []
        groups.forEach(cg => { 
          hopts.push(h('li', {class:'cursor-pointer', innerText: cg.name, gid: cg.id, onclick: components.editor.groupSelected})) 
        })
        
        const md = { title: 'Component Editor', size: 'maxi', content: 
        h('div', { class:'w-full h-full flex flex-col z-50' }, [
          h('div', { class:'w-full h-full flex justify-end space-x-5' }, [
            h('input', { id:'compRename', class:'border border-slate-400', onchange: (e) => { components.editor.ref.compname = e.target.value} }),
            h('button', { class:'bg-slate-600 p-1 px-2 text-white', innerText: 'rename', onclick: components.rename }),
            h('button', { class:'bg-red-600 p-1 px-2 text-white', innerText: 'delete', onclick: components.delete })
          ]),
          h('div', { class:'w-full h-full flex' }, [
            h('ul', { class:'h-96 bg-white w-48 overflow-y-scroll border px-2' }, hopts),
            h('ul', { id:'compList', class: 'h-96 bg-white w-48 overflow-y-scroll border px-2 mx-2', innerText: 'select a group'}),
            h('div', { id:'compPreview', class:'bg-white w-full h-96 overflow-y-scroll' })
          ]),
        ]),
        buttons: [
          h('button', {class:ui.btnCancel, innerText: 'cancel (esc)', onclick: ModalService.hide }),
          h('button', {class:ui.btnConfirm, innerText: 'add component', onclick: components.add }),
        ]}
      ModalService.show(md)
      })
    }
  },
  add: () => {
    if(!rcLayout.selected.id) { alert('please select an element to add component inside'); return }
    if(!rcLayout.page.id) { alert('please select a page to work on'); return }
    const elid = rcLayout.selected.id
    const parent = document.getElementById(elid)
    const c = ctLayout.makeNode(components.editor.ref.comp.html)
    const idc = ctLayout.regenerateIDs(c)
    const elProps = ctLayout.getElementProperties(c)
    rcLayout.selected = elProps
    parent.appendChild(idc)
    ModalService.hide()
    ctLayout.clearSelected()
  },
  rename: async() => {
    if(!components.editor.ref.comp.name) { alert('please select a component first'); return }
    const name = components.editor.ref.compname
    const id = components.editor.ref.comp.id
    const res = await xhr.database({run: 'update', from: 'wd_components', data: {name}, match: {id}})
    if(res.data.affectedRows === 1) {
      components.editor.loadComponents()
    }
  },
  delete: async() => {
    if(!components.editor.ref.comp.name) { alert('please select a component first'); return }
    const id = components.editor.ref.comp.id
    const sure = await confirm('Are you sure?')
    if(sure === true) {
      const res = await xhr.database({run: 'delete', from: 'wd_components', match: {id}})
      if(res.data.affectedRows === 1) {
        components.editor.loadComponents()
      }
    }
  },
  save: async() => {
    const elid = rcLayout.selected.id
    const cmp = document.getElementById(elid)
    let grp = ''
    let name = ''
    const cmpSubmit = () => {
      if(!grp.length) {
        NotifyService.show('error', 'you must select a group for the component')
        return
      }
      if(cmp) { cmp.classList.remove('selected') }
      dbLayout.addComponent({name, grp, html: cmp.outerHTML})
      ModalService.hide()
    }

    const glist = await dbLayout.getComponentGroups().then((groups,gidx) => {
    const hopts = [h('option', {innerText: '', value: ''})]
    groups.forEach(cg => { 
      hopts.push(h('option', {innerText: cg.name, value: cg.name})) 
    })

    const md = {  title: 'Save component', content: 
      h('div', {}, [
        h('label', { class:'text-white', innerText: 'Component group' }),
        h('select', { class:'m-2 border', value: grp, onchange: (e) => { grp = e.target.value }}, hopts),
        h('label', { class:'text-white', innerText: 'Component name' }),
        h('input', { class:'m-2 border', oninput: (e) => { name = e.target.value }}),
      ]),
      buttons: [
        h('button', {class:ui.btnCancel, innerText: 'cancel (esc)', onclick: ModalService.hide }),
        h('button', {class:ui.btnConfirm, innerText: 'confirm', onclick: cmpSubmit }),
      ]}
    ModalService.show(md)
    })
  }
}