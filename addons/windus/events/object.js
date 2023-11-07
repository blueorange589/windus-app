import { rcLayout } from '../components/reactive.js';
import { ctLayout } from '../components/controller.js';

export const objectMod = {
  copyPage: () => { ctLayout.ref = document.getElementById('layoutContainer').innerHTML },
  copy: (e) => {
    const elid = rcLayout.selected.id
    const elem = document.getElementById(elid)
    const nodeCopy = elem.cloneNode(true)
    const nodeids = ctLayout.regenerateIDs(nodeCopy)
    ctLayout.ref = nodeids
  },
  paste: (e) => {
    const elid = rcLayout.selected.id
    const elem = document.getElementById(elid)
    elem.appendChild(ctLayout.ref)
  },
  duplicate: (e) => {
    const elid = rcLayout.selected.id
    const elem = document.getElementById(elid)
    const next = elem.nextSibling
    const nodeCopy = elem.cloneNode(true)
    const nodeids = ctLayout.regenerateIDs(nodeCopy)
    const parent = elem.parentNode
    parent.insertBefore(nodeids,next)
  },
  copyClasses: () => {
    const elid = rcLayout.selected.id
    const elem = document.getElementById(elid)
    ctLayout.classRef = elem.classList
  },
  pasteClasses: () => {
    const elid = rcLayout.selected.id
    const elem = document.getElementById(elid)
    elem.classList = ctLayout.classRef
  },
  movePrev: (e) => {
    const elid = rcLayout.selected.id
    const elem = document.getElementById(elid)
    const parent = elem.parentNode
    const prev = elem.previousSibling
    parent.insertBefore(elem,prev)
  },
  moveNext: (e) => {
    const elid = rcLayout.selected.id
    const elem = document.getElementById(elid)
    const parent = elem.parentNode
    const following = elem.nextSibling.nextSibling
    parent.insertBefore(elem,following)
  },
  move: (place,e) => {
    const elid = rcLayout.selected.id
    const elem = document.getElementById(elid)
    const parent = elem.parentNode
    parent.insertAdjacentElement(place, elem)
  },
  moveOutBefore: (e) => { objectMod.move('beforebegin', e) },
  moveFirst: (e) => { objectMod.move('afterbegin', e) },
  moveLast: (e) => { objectMod.move('beforeend', e) },
  moveOutAfter: (e) => { objectMod.move('afterend', e) },
}