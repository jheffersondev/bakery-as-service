import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(Antd)

app.mount('#app')
