import { rcLayout } from '../components/reactive.js';

export const classMod = {
  apply: (e) => {
    if(e.target.value == '') return
    classMod.add(e.target.value)
    e.target.value = ''
  },
  add: (cls) => {
    if(!rcLayout.selected.id) return
    if(rcLayout.viewport === 'desktop') { cls = 'lg:'+cls }
    if(rcLayout.viewport === 'tablet') { cls = 'md:'+cls }
    Object.keys(rcLayout.modifiers).forEach(md => {
      if(rcLayout.modifiers[md] === true) {
        if(md === 'children') { md = '[&>*]' }
        cls = md+':'+cls
      }
    })
    const el = document.getElementById(rcLayout.selected.id)
    el.classList.add(cls)
    rcLayout.selected.class.push(cls)
  },
  remove: (cls) => {
    console.log(rcLayout.selected.id)
    if(!rcLayout.selected.id) return
    const el = document.getElementById(rcLayout.selected.id)
    el.classList.remove(cls)
    const idx = rcLayout.selected.class.indexOf(cls)
    rcLayout.selected.class.splice(idx, 1)
  },
  addCustom: () => {
    const {customClass} = rcLayout
    const clss = customClass.split(' ')
    const {id} = rcLayout.selected
    const el = document.getElementById(id)
    if(id) {
      const elcls = Array.from(el.classList)
      const newcls = [...elcls, ...clss]
      el.classList = newcls.join(' ')
      rcLayout.customClass = ''
    }
  }
}