// import Vue from 'vue'
// import router from './router'
// import App from './app'


// D:\SAAS\YH.SAAS.Exchange\YH.SAAS.Exchange.Front\src\custom\js\common.js

// Vue.config.productionTip = false

// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router
// })


import Vue from 'vue'
import router from './router'
import App from './app.vue'
import common from '../../custom/js/common.js'

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
