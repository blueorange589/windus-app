import { rcLayout } from '../components/reactive.js';
import { select } from './select.js';

export const focus = {
  el: (elid) => {
    select.current().classList.remove('selected')
    const el = document.getElementById(elid)
    el.classList.add('selected')
    if(!el.classList.contains('lbs')) { el.classList.add('lbs') }
    const {id, tagName, classList} = el
    rcLayout.selected = {id, tag:tagName, class: Array.from(classList)}
  },
  next: () => { focus.el(select.nextId()) },
  prev: () => { focus.el(select.prevId()) },
  parent: () => { 
    const pid = select.parentId()
    if(pid === 'layoutConatiner') return
    focus.el(pid) 
  },
  firstChild: () => { 
    const fcid = select.firstChildId()
    if(!fcid) return
    focus.el(fcid) 
  },
}