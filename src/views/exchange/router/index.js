import Vue from 'vue'
import Router from 'vue-router'
import exchangIndex from '../components/exchangIndex'
import succeed from '../components/succeed'
import resize from '../components/resize'
import resize2 from '../components/js_resize'

import myde from '../components/myde'
Vue.use(Router)

export default new Router({
    routes: [{
        path: '/direct/:id',
        name: 'exchangIndex',
        component: exchangIndex
    }, {
        path: '/succeed',
        name: 'succeed',
        component: succeed
    }, {
        path: '/resize',
        name: 'resize',
        component: resize
    }, {
        path: '/resize2',
        name: 'resize2',
        component: resize2
    }, {
        path: '/myde',
        name: 'myde',
        component: myde
    }]
})
