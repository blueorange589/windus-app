const {h} = Vue;

import { ModalService, NotifyService } from '../../../core/app/components/elements.js'
import { dbLayout } from './database.js';
import { rcLayout } from './reactive.js';
import { ctLayout } from './controller.js';
import { utils, xhr } from '../../../core/app/store.js';

const ui = {
  btnCancel: 'bg-gray-800 text-white px-2 py-1',
  btnConfirm: 'bg-green-800 text-white px-2 py-1'
}

export const page = {
  new: (title, html) => {
    let name = ''
    const pageSubmit = () => {
      const {id} = rcLayout.project
      dbLayout.addPage(id, name, html).then(res => {
        dbLayout.getPages(id).then(pgs => {
          rcLayout.pages = pgs
          page.loadByName(name)
        })
      })
      ModalService.hide()
    }

    const md = { title, 
        content: h('div', {class:'flex flex-col'}, [
          h('label', { innerText: 'Page name' }),
          h('input', { oninput: (e) => name=e.target.value }),
        ]),
        buttons: [
          h('button', {class: ui.btnCancel, innerText: 'cancel (esc)', onclick: ModalService.hide }),
          h('button', {class: ui.btnConfirm, innerText: 'confirm', onclick: pageSubmit }),
        ]}
      ModalService.show(md)
  },
  duplicate: () => {
    page.new('Duplicate the page', rcLayout.page.html)
  },
  add: () => {
    const nk = utils.random.hash(6)
    const html = `<div id="${nk}" class="lbs"></div>`
    page.new('Add new page', html)
  },
  loadByName: (name) => {
    const pg = rcLayout.pages.filter((p,idx) => { return p.name === name })
    if(pg[0]) {
      page.load(pg[0].id)
    } else {
      page.load(rcLayout.pages[0].id)
    }
  },
  load: (id) => {
    dbLayout.getPage(id).then(pg => {
      ctLayout.clearSelected()
    })
  },
  switch: (e) => {
    const name = e.target.value
    page.loadByName(name)
  },
  save: async () => {
    if(!rcLayout.page.id) { alert('please select a page to work on and save'); return }
    const html = document.getElementById('layoutContainer').innerHTML
    const {id} = rcLayout.page
    const r = await dbLayout.savePage(id, html)
  return r
  },
  delete: async () => {
    const c = await confirm('Are you sure? Current page will be deleted permanently.')
    if(c === true) {
      const {id} = rcLayout.page
      const r = await xhr.database({run:'delete', from:'wd_pages', match: {id}}).then(r => {
        dbLayout.getPages(rcLayout.project.id).then(ps => {
          page.load(rcLayout.pages[0].id)
        })
      })
    return r
    }
  },
  setDefault: async() => {
    const {id} = rcLayout.project
    const {name} = rcLayout.page
    const r = await xhr.database({run:'update', from: 'wd_projects', eq: {id}, data: {entry: name}}).then(r => {
      NotifyService.show('success', 'current page is default for the project')
    })
    return r
  },
  export: () => {
    const html = document.getElementById('layoutContainer').innerHTML
    const { name } = rcLayout.page
    const filename = `${name}.html`
    const {head,foot} = rcLayout.options
    const ct = (head||'') + html + (foot||'')
    utils.file.export(filename, 'text/plain', ct)
  }
}