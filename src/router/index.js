import { createRouter, createWebHistory } from 'vue-router'
import CustomerList from '../components/CustomerList.vue'

const routes = [{
        path: '/',
        name: 'CustomerList',
        component: CustomerList
    },
    {
        path: '/item',
        name: 'Item',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../components/ItemList.vue')
    },
    {
        path: '/data',
        name: 'Data',
        component: () =>
            import ('../components/DataView.vue')
    },
    {
        path: '/new',
        name: 'New',
        component: () =>
            import ('../components/NewData.vue')
    },
    {
        path: '/new/:cid',
        name: 'NewEntry',
        component: () =>
            import ('../components/NewData.vue'),
        props: true
    },
    {
        path: '/data/:cid',
        name: 'CustomerData',
        component: () =>
            import ('../components/DataView.vue'),
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router