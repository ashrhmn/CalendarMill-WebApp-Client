import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'

// Vue.use(VueRouter);

// const routes = [
//     { path: '/c', component: CustomerList },
//     { path: '/i', component: ItemList }
// ]

// const router = nwe VueRouter({routes})

createApp(App).use(router).mount('#app')