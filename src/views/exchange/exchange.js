import Vue from 'vue'
import router from './router'
import App from './exchange.vue'
import '../../custom/css/common.css'
import common from '../../custom/js/common.js'
import '../../custom/js/rem.js'
// import '../../custom/js/flexible.min.js'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import axios from 'axios'
// import VueDragResize from 'vue-drag-resize'
// Vue.component('vue-drag-resize', VueDragResize)
//----------------------------------------------
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
Vue.component('vue-draggable-resizable', VueDraggableResizable)
//----------------------------------------------
//-----------------2----------------------------
import VueDragResize from 'vue-drag-resize'
Vue.component('vue-drag-resize', VueDragResize)
//-----------------2----------------------------
Vue.use(MintUI)
Vue.use(common) //公共函数或者方法
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
        App
    }
})
