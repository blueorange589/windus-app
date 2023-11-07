import { rcLayout } from '../components/reactive.js';
import { ctLayout } from '../components/controller.js';

export const select = {
  container: () => document.getElementById('layoutContainer'),
  current: () => {
    const {id} = rcLayout.selected
    if(!id) { console.log('el not selected'); return }
    return document.getElementById(id)
  },
  next: () => {
    const el = select.current()
    return el.nextElementSibling
  },
  prev: () => {
    const el = select.current()
    return el.previousElementSibling
  },
  parent: () => {
    const el = select.current()
    return el.parentNode
  },
  firstChild: () => {
    const el = select.current()
    return el.firstElementChild
  },
  nextId: () => { return select.next().id || ctLayout.common.generateID(select.next()) },
  prevId: () => { return select.prev().id || ctLayout.common.generateID(select.prev()) },
  parentId: () => { return select.parent().id || ctLayout.common.generateID(select.parent()) },
  firstChildId: () => { return select.firstChild().id || ctLayout.common.generateID(select.firstChild()) },
}