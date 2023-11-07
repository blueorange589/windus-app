import { login } from './auth/auth.js';

export const addOns = {
  'auth': {
    path: '/auth/:sub?', 
    name: 'auth', 
    routes: {
      'login': {path: '/auth/login', name: 'auth-login', component: login },
      'signup': {path: '/auth/signup', name: 'auth-signup'},
      'forgot': {path: '/auth/forgot', name: 'auth-forgot'},
    },
  },
  'admin': {path:'/', name: 'home', meta:{reqAuth: true}},
  'windus': {path:'/builder', name: 'builder', meta:{reqAuth: true}, init: () => {}},
}
