import { store } from '../../core/app/store.js';
import { twoptions } from './twoptions.js';
import { dbLayout } from './components/database.js';
import { rcLayout } from './components/reactive.js';
import { ctLayout } from './components/controller.js';
import { components } from './components/components.js';
import { project } from './components/project.js';
import { page } from './components/page.js';
import { classMod } from './events/class.js';
import { keyEvents } from './events/keyboard.js';


export const container = {
  name: 'windus',
  mounted() {
    document.addEventListener('keyup', keyEvents, false);

    dbLayout.getOptions().then(o => {
      dbLayout.getProjects().then(pjs => {
        const prj = pjs.filter((obj, i) => { return obj.id === o.default_project })
        rcLayout.project = prj[0] || pjs[0]
        project.load(rcLayout.project.id)
        rcLayout.autosaveId = setInterval(function () { page.save() }, 60000);
      })
    })
    
    
  },
  setup() {
    const tabs = Object.keys(twoptions)
    ctLayout.tabs.switch('display')
    
    const modifierClass = (md) => {
      const cls = {'text-gray-700 block px-4 py-2 text-sm': true}
      if(rcLayout.modifiers[md] === true) {
        cls['bg-blue-600 text-gray-100'] = true
      } else {
        cls['text-gray-700'] = true
      }
    return cls
    }

    const vpClass = (vp) => {
      const cls = {'text-gray-700 block px-4 py-2 text-sm': true}
      if(rcLayout.viewport === vp) {
        cls['bg-blue-600 text-gray-100'] = true
      } else {
        cls['text-gray-700'] = true
      }
      return cls
    }

    return {ctLayout, rcLayout, dbLayout, components, project, page, store, classMod, tabs, modifierClass, vpClass}
  },
  template: `<div class="w-full h-full flex flex-col">

  <div class="w-full fixed top-0 left-0 bg-gray-800 z-30">
    <div class="max-w-7xl mx-auto flex justify-between">
      <div class="flex flex-wrap text-white text-xs">
        <ul class="flex flex-wrap">
          <li :class="ctLayout.tabs.class(tab)" @click="ctLayout.tabs.switch(tab)" v-for="tab in tabs">{{tab}}</li>
        </ul>
      </div>
    </div>
    
    <div class="p-2 bg-gray-800 text-xs">
      <div class="max-w-7xl flex start-center mx-auto text-white">
        <div class="flex flex-col mx-1" v-for="ik in Object.keys(rcLayout.tabs.items)">
          <span>{{ik}}</span>
          <select class="w-24 text-black" @change="classMod.apply">
            <option value=''>-</option>
            <option :value="cls" v-for="cls in rcLayout.tabs.items[ik]">{{cls}}</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div class="w-full h-full grow-1 mt-20 mb-12 bg-white">
    <div v-show="rcLayout.preview === 'desktop'" id="layoutContainer" class="h-full w-full" @click="ctLayout.click.left" @dblclick="ctLayout.click.double" v-html="rcLayout.page.html">
    </div>
    <div v-show="['tablet','mobile'].includes(rcLayout.preview)">
      <iframe id="responsiveView"></iframe>
    </div>
  </div>

  

  <div class="fixed bottom-0 w-full z-30 bg-gray-800">
    <div class="w-full bg-blue-500">
      <div class="max-w-7xl mx-auto row start-center flex-wrap text-xs text-black">
        <span class="mr-2">{{rcLayout.selected.tag}}#{{rcLayout.selected.id}} | </span>
        <btn bg="green" size="sm" :text="cls" color="black" class="border-b border-cyan-500 mr-2" v-for="cls in rcLayout.selected.class" @click="classMod.remove(cls)">{{cls}}</btn>
      </div>
    </div>
    <div id="context-menu2" class="hover:[&>button]:text-green-400 w-full px-2 flex justify-between items-center text-white text-xs max-w-7xl mx-auto">
      <btn icon="plus" bg="none" size="md" @click="ctLayout.sec.addElement" title="Add Element (1)">Add Element (1)</btn>
      <btn icon="cross" bg="none" size="md" @click="ctLayout.sec.remove" title="Remove (Del)">Remove (Del)</btn>
      <btn icon="text" bg="none" size="md" @click="ctLayout.sec.setInnerText" title="Set Inner Text (.)">Set Inner Text (.)</btn>


      <div class="relative inline-block text-left">
        <div v-show="rcLayout.show.components" class="absolute right-0 bottom-6 z-10 mt-2 w-48 origin-bottom-right transition ease-out duration-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
          <ul class="text-black [&>li]:my-1 [&>a]:text-md">
            <li><a href="javascript:;" class="text-gray-700 block px-4 py-2 text-sm"  @click="components.editor.display">Add Component (2)</a></li>
            <li><a href="javascript:;" class="text-gray-700 block px-4 py-2 text-sm"  @click="components.save">Save Component (3)</a></li>
          </ul>
        </div>
        <div>
          <button @click="rcLayout.show.components = !rcLayout.show.components" type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md text-white text-sm font-semibold hover:text-gray-900 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
            components
            <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div class="relative inline-block text-left">
        <div v-show="rcLayout.show.moves" class="absolute w-36 px-4 right-0 bottom-6 z-10 mt-2 origin-bottom-right transition ease-out duration-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
          <ul class="text-black [&>li]:my-2 [&>a]:text-md">
            <li><a href="javascript:;" @click="ctLayout.copyClasses">(c) copy classes</a></li>
            <li><a href="javascript:;" @click="ctLayout.pasteClasses">(v) paste classes</a></li>
            <li><a href="javascript:;" @click="ctLayout.copy">(C) copy</a></li>
            <li><a href="javascript:;" @click="ctLayout.paste">(V) paste</a></li>
            <li><a href="javascript:;" @click="ctLayout.duplicate">(F) duplicate</a></li>
            <li><a href="javascript:;" @click="ctLayout.moveBefore">(Q) moveBefore</a></li>
            <li><a href="javascript:;" @click="ctLayout.moveAfter">(E) moveAfter</a></li>
            <li><a href="javascript:;" @click="ctLayout.moveFirst">(W) moveFirst</a></li>
            <li><a href="javascript:;" @click="ctLayout.movePrev">(A) movePrev</a></li>
            <li><a href="javascript:;" @click="ctLayout.moveNext">(D) moveNext</a></li>
            <li><a href="javascript:;" @click="ctLayout.moveLast">(S) moveLast</a></li>
          </ul>
        </div>
        <div>
          <button @click="rcLayout.show.moves = !rcLayout.show.moves" type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md text-white text-sm font-semibold hover:text-gray-900 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
            object
            <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>


      <div class="relative inline-block text-left">
        <div v-show="rcLayout.show.viewports" class="absolute right-0 bottom-6 z-10 mt-2 w-24 origin-bottom-right transition ease-out duration-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
          <div class="py-1" role="none">
            <a href="javascript:;" :class="vpClass(vp)" role="menuitem" tabindex="-1" v-for="vp in ['mobile','tablet','desktop']" @click="ctLayout.setViewport(vp)">{{vp}}</a>
          </div>
        </div>
        <div>
          <button @click="rcLayout.show.viewports = !rcLayout.show.viewports" type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md text-white text-sm font-semibold hover:text-gray-900 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
            viewports
            <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>


      <div class="relative inline-block text-left">
        <div v-show="rcLayout.show.modifiers" class="absolute right-0 bottom-6 z-10 mt-2 w-48 origin-bottom-right transition ease-out duration-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
          <div class="py-1 grid grid-cols-2 gap-2" role="none">
            <a href="javascript:;" :class="modifierClass(md)" role="menuitem" tabindex="-1" v-for="md in Object.keys(rcLayout.modifiers)" @click="rcLayout.modifiers[md] = !rcLayout.modifiers[md]">{{md}}</a>
          </div>
        </div>
        <div>
          <button @click="rcLayout.show.modifiers = !rcLayout.show.modifiers" type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md text-white text-sm font-semibold hover:text-gray-900 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
            modifiers
            <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>



      


      <div class="relative inline-block text-left">
        <div v-show="rcLayout.show.previewMenu" class="absolute right-0 bottom-6 z-10 mt-2 w-36 origin-bottom-right transition ease-out duration-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
          <div class="py-1" role="none">
            <a href="javascript:;" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" v-for="pv in ['mobile','tablet','desktop']" @click="ctLayout.preview.set(pv)">{{pv}} (\`)</a>
          </div>
        </div>
        <div>
          <button @click="rcLayout.show.previewMenu = !rcLayout.show.previewMenu" type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md text-white text-sm font-semibold hover:text-gray-900 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
            preview
            <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>




      <div class="relative inline-block text-left">
        <div v-show="rcLayout.show.project" class="absolute w-12 px-4 right-0 bottom-6 z-10 mt-2 w-52 origin-bottom-right transition ease-out duration-100 rounded-md bg-gray-800 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
          <div class="py-1 flex flex-col justify-between w-full [&>div]:my-2 [&>div]:flex [&>div]:justify-between [&>option]:text-black" role="none">
            <div class="flex flex-row justify-between">
              <span>Project</span>
              <select class="w-32 text-black" @change="project.switch" v-model="rcLayout.project.id">
                <option :value="p.id" v-for="(p,idx) in rcLayout.projects">{{p.name}}</option>
              </select>
            </div>
            <div class="flex flex-row justify-between">
              <span>Page</span>
              <select class="w-32 text-black" @change="page.switch" v-model="rcLayout.page.name">
                <option :value="pg.name" v-for="(pg,ix) in rcLayout.pages">{{pg.name}}</option>
              </select>
            </div>
            <div class="flex flex-col space-y-3">
              <a href="javascript:;" class="flex flex-row font-semibold" @click="page.setDefault"><icon name="tag" class="mr-1"></icon>Set as default</a>
              <a href="javascript:;" class="flex flex-row font-semibold" @click="page.add"><icon name="plus" class="mr-1"></icon>Add page</a>
              <a href="javascript:;" class="flex flex-row font-semibold" @click="page.duplicate"><icon name="clipboard" class="mr-1"></icon>Clone page</a>
              <a href="javascript:;" class="flex flex-row font-semibold" @click="page.save"><icon name="storage" class="mr-1"></icon>Save page</a>
              <a href="javascript:;" class="flex flex-row font-semibold" @click="page.delete"><icon name="cross" class="mr-1"></icon>Delete page</a>
              <a href="javascript:;" class="flex flex-row font-semibold" @click="page.export"><icon name="cross" class="mr-1"></icon>Export page</a>
            </div>
          </div>
        </div>
        <div>
          <button @click="rcLayout.show.project = !rcLayout.show.project" type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md text-white text-sm font-semibold hover:text-gray-900 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
            project
            <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>


      



      <div class="relative inline-block text-left">
        <div v-show="rcLayout.show.mainMenu" class="absolute right-0 bottom-6 z-10 mt-2 w-36 origin-bottom-right transition ease-out duration-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
          <div class="py-1" role="none">
          <a href="https://tailwindcss.com/docs/hover-focus-and-other-states" target="_blank" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1">TW documentation</a>
          <a href="javascript:;" @click="ctLayout.quit" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1">quit</a>
          </div>
        </div>
        <div>
          <button @click="rcLayout.show.mainMenu = !rcLayout.show.mainMenu" type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md text-white text-sm font-semibold hover:text-gray-900 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
            menu
            <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>


    </div>
  </div>
</div>`
}