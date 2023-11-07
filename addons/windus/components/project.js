const {h} = Vue;

import { ModalService, NotifyService } from '../../../core/app/components/elements.js'
import { dbLayout } from './database.js';
import { rcLayout } from './reactive.js';
import { ctLayout } from './controller.js';
import { page } from './page.js';
import { utils, xhr } from '../../../core/app/store.js';


export const project = {
  load: (pid) => {
    rcLayout.pages = []
    const prj = rcLayout.projects.filter((p) => { return p.id === pid })
    console.log(prj)
    rcLayout.project = prj[0]
    const { id, entry } = rcLayout.project
    dbLayout.getPages(id).then(pgs => {
      if(!pgs[0]) {
        NotifyService.show('error', 'selected project has no pages. add a page to start')
        return
      }
      if(entry) {
        page.loadByName(entry)
      } else {
        page.load(pgs[0].id)
      }
    })
  },
  switch: (e) => {
    project.load(e.target.value)
  },
}