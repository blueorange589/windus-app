const { reactive } = Vue;
import { NotifyService } from '../../core/app/components/elements.js';
import { store, xhr } from '../../core/app/store.js';


export const auth = {}
auth.data = reactive({
  login: {
    email: '',
    password: '',
    remember: true
  }
})

auth.events = {
  signIn: async() => {
    const {email, password} = auth.data.login
    const res = await xhr.auth('/signin', {email, password})
    if(res.user?.id) {
      store.me = res.user
      localStorage.setItem('wdsess', JSON.stringify(res.user))
      store.router.push({name: 'home'})
      return
    }
    NotifyService.show('error', 'Invalid credentials')
  },
  signOut: async() => {
    const res = await xhr.auth('/signout', auth.data.login)
    localStorage.setItem('wdsess', '')
    store.me = false
    store.router.push({name: 'auth-login'})
  }
}


export const login = {
  setup() {
    return { store, auth }
  },
  template: `<div>
  <div class="lbs grow bg-body" id="zytz3x">
  <div class="bg-white dark:bg-gray-900" id="lzv2nt">
    <div class="flex justify-center h-screen" id="lxicpm">
      <div class="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6" id="3aavoe">
        <div class="flex-1" id="zlf26n">
          <div class="text-center" id="ui0z3c">
            <h2 class="text-4xl font-bold text-center text-gray-700 dark:text-white" id="k41y19">Windus</h2>
            <p class="mt-3 text-gray-500 dark:text-gray-300" id="zfgexl">Sign in to access your account</p>
          </div>
          <div class="mt-8" id="xlj49o">
            <div id="e0ezx6">
              <label for="email" class="block mb-2 text-sm text-gray-600 dark:text-gray-200" id="xpms9y">Email
                Address</label>
              <input type="text" name="email" v-model="auth.data.login.email" id="x1ei78" placeholder="example@example.com"
                class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
            </div>

            <div class="mt-6" id="izke97">
              <div class="flex justify-between mb-2" id="ei8nb2">
                <label for="password" class="text-sm text-gray-600 dark:text-gray-200" id="fj901l">Password</label>
              </div>

              <input type="password" v-model="auth.data.login.password" name="password" id="rqt82f" placeholder="Your Password"
                class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
            </div>

            <div class="mt-6" id="vjb44m">
              <button
                @click="auth.events.signIn"
                class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                id="yms4oq">
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
`
}


export const container = {
  name: 'auth',
  setup(props, ctx) {
    console.log('auth started')
    return {auth, ctx}
  }
}