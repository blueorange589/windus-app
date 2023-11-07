import { ctLayout } from '../components/controller.js';
import { components } from '../components/components.js';
import { focus } from './focus.js';
import { objectMod } from './object.js';

export const keyEvents = (event) => {
  if(['INPUT','TEXTAREA'].includes(event.target.tagName)) return 

  const {key, code} = event
  //console.log(`Key pressed ${key} \r\n Key code value: ${code}`)

  if(key === 'w') { focus.parent() }
  if(key === 'd') { focus.next() }
  if(key === 's') { focus.firstChild() }
  if(key === 'a') { focus.prev() }
  if(key === 'C') { objectMod.copy() }
  if(key === 'V') { objectMod.paste() }
  if(key === 'F') { objectMod.duplicate() }
  if(key === 'c') { objectMod.copyClasses() }
  if(key === 'v') { objectMod.pasteClasses() }
  if(key === 'W') { objectMod.moveFirst() }
  if(key === 'D') { objectMod.moveNext() }
  if(key === 'S') { objectMod.moveLast() }
  if(key === 'A') { objectMod.movePrev() }
  if(key === 'Q') { objectMod.moveOutBefore() }
  if(key === '1') { ctLayout.sec.addElement() }
  if(key === '2') { components.editor.display() }
  if(key === '3') { components.save() }
  if(key === 'Delete') { ctLayout.sec.remove() }
  if(key === '.') { ctLayout.sec.setInnerText() }
  if(key === '-') { ctLayout.clearSelected() }
  if(key === '`') { ctLayout.preview.next() }
  if(key === 'Escape') { ctLayout.closeModal() }
}