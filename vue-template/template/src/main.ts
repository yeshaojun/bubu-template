import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
<%_ if (data.isRouter) { _%>
import router from './router'
<%_ } _%>
<%_ if (data.isPinia) { _%>
import { createPinia } from 'pinia'
<%_ } _%>

const app = createApp(App)
<%_ if (data.isRouter) { _%>
app.use(router)
<%_ } _%>
<%_ if (data.isPinia) { _%>
app.use(createPinia())
<%_ } _%>
app.mount('#app')
