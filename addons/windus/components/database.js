import { xhr, utils } from '../../../core/app/store.js';
import { rcLayout } from './reactive.js';

export const useLocal = false

export const dbLayout = {
  addComponent: async(data) => {
    let r = false
    if(useLocal) { 
      r = await dbLayout.local.addComponent(data) 
    } else { 
      r = await xhr.database({run:'insert', from: 'wd_components', data}).then(r => {
        return r
      })
    }
  return r
  },
  getOptions: async() => {
    let r = false
    if(useLocal) { 
      r = await dbLayout.local.getOptions(project) 
    } else {
      r = await xhr.database({run:'select', from: 'wd_options', select:['option', 'value']}).then(r => {
        const opts = {}
        r.data.forEach((obj, i) => { opts[obj['option']] = obj['value'] })
        rcLayout.options = opts
        return opts
      })
    }
    
    return new Promise(resolve => resolve(r))
  },
  getComponentGroups: async(group) => {
    let r = false
    if(useLocal) { 
      r = await dbLayout.local.getComponentGroups(group)
    } else {
      r = await xhr.database({run:'select', from: 'wd_component_groups', order: {name: 'asc'}}).then(r => {
        rcLayout.componentGroups = r.data
        return r.data
      })
    }
    return new Promise(resolve => resolve(r))
  },
  getComponents: async(grp) => {
    let r = false
    if(useLocal) { 
      r = await dbLayout.local.getComponents(grp)
    } else {
      r = await xhr.database({run:'select', from: 'wd_components', match: {grp}, order: {name: 'asc'}}).then(r => {
        rcLayout.components = r.data
        return r.data
      })
    }
    return new Promise(resolve => resolve(r))
  },
  getProjects: async() => {
    let r = false
    if(useLocal) { 
      r = await dbLayout.local.getProjects() 
    } else {
      r = await xhr.database({run:'select', from: 'wd_projects', order:{name: 'asc'}}).then(r => {
        rcLayout.projects = r.data
        return r.data
      })
    }
    return new Promise(resolve => resolve(r))
  },
  getPages: async(project) => {
    let r = false
    if(useLocal) { 
      r = await dbLayout.local.getPages(project) 
    } else {
      r = await xhr.database({run:'select', from: 'wd_pages', select:['id', 'project', 'name'], match: {project}}).then(r => {
        rcLayout.pages = r.data
        return r.data
      })
    }
    
    return new Promise(resolve => resolve(r))
  },
  getPage: async(id) => {
    let r = false
    if(useLocal) { 
      r = await dbLayout.local.getPage(id).then(r => {
        rcLayout.page.html = r.data.html
      }) 
    } else {
      r = await xhr.database({run:'select', from: 'wd_pages', eq: {id}}).then(r => {
        rcLayout.page = r.data[0]
        return r.data
      })
    }
    
    return new Promise(resolve => resolve(r))
  },
  savePage: async(id, html) => {
    let r = false
    if(useLocal) { 
      r = await dbLayout.local.savePage() 
    } else {
      r = await xhr.database({run:'update', from: 'wd_pages', eq: {id}, data: {html}})
    }
    return new Promise(resolve => resolve(r))
  },
  addPage: async(project, name, html) => {
    let r = false
    if(useLocal) { 
      r = dbLayout.local.savePage() 
    } else {
      r = await xhr.database({run:'insert', from: 'wd_pages', data: {project, name, html}})
    }
    return new Promise(resolve => resolve(r))
  },
  local: {
    addComponent: async(name, grp, component) => {
      const id = crypto.randomUUID();
      const obj = {id, name, grp, component}
      const data = await dbLayout.local.getComponents(grp).then(r => {
        r.push(obj)
        return r
      })
      const fn = `../../4ft-projects/components/${grp}.json`
      if(!data) return false
      const r = await xhr.file('save', {name:fn, data: JSON.stringify({data})})
      return new Promise(resolve => resolve(r))
    },
    getComponents: async(grp) => {
      const name = `../../4ft-projects/components/${grp}.json`
      const r = await xhr.file('getJson', {name}).then(r => {
        rcLayout.components = r.data
        return r.data
      })
      return new Promise(resolve => resolve(r))
    },
    getProjects: async() => {
      const name = `../../4ft-projects/projects.json`
      const r = await xhr.file('getJson', {name}).then(r => {
        rcLayout.projects = r.data
        return r.data
      })
      return new Promise(resolve => resolve(r))
    },
    getPages: async(project) => {
      const nm = '../../4ft-projects/' + project
      const r = await xhr.file('getDir', {name:nm})
      const rs = []
      r.data.forEach(name => {
        const id = utils.random.hash(6)
        const po = {id, name, project}
        rs.push(po)
      })
      rcLayout.pages = rs
      return new Promise(resolve => resolve(r))
    },
    getPage: async () => {
      const fn = [rcLayout.project.name, rcLayout.page.name].join('/')
      const name = '../../4ft-projects/' + fn
      const r = await xhr.file('getHtml', {name})
      return new Promise(resolve => resolve(r))
    },
    savePage: async() => {
      const html = document.getElementById('layoutContainer').innerHTML
      const fn = [rcLayout.project.name, rcLayout.page.name].join('/')
      const name = '../../4ft-projects/' + fn
      const r = await xhr.file('save', {name, data:html})
      return new Promise(resolve => resolve(r))
    },
    saveProjects: async() => {
      const fn = `../../4ft-projects/projects.json`
      const {projects} = rcLayout
      const r = await xhr.file('save', {name:fn, data: JSON.stringify({data:projects})})
      return new Promise(resolve => resolve(r))
    },
    setDefaultPage: (pid, page) => {
      const {projects} = rcLayout
      projects.forEach((p, idx) => {
        if(p.id === pid) {
          projects[idx].entry = page
        }
      })
      dbLayout.local.saveProjects()
    }
  }
}