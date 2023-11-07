const {reactive} = Vue;

export const rcLayout = reactive({
  viewport: 'mobile',
  preview: 'desktop',
  projects: [{id:'6e077276-6158-4922-8c3f-b02c434f3dfc', name: 'jobiva'}, {id:'698ed32d-88c5-476a-a354-3479edac387d', name:'realis'}],
  project: {},
  componentGroups: [],
  components: [],
  component: {},
  pages: [],
  page: {},
  selected: {
    id: '',
    tag: '',
    class: []
  },
  tabs: {
    tab: 'display',
    items: {}
  },
  modifiers: {
    dark: false,
    children: false,
    hover: false,
    focus: false,
    active: false,
    first: false,
    last: false,
    odd: false,
    even: false,
    required: false,
    valid: false,
    invalid: false,
    disabled: false,
    checked: false,
    before: false,
    after: false,
    placeholder: false,
    selection: false,
  },
  show: {},
  customClass: '',
  autosaveId: ''
})