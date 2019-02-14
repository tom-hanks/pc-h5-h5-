import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld'
import Hello from '../components/Hello'

Vue.use(Router)

export default new Router({
  routes: [{
      path: "*",
      redirect: "/"
    }, {
      path: '/',
      name: 'home',
      component: HelloWorld
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    }, {
      path: '/Hello',
      name: 'Hello',
      component: Hello
    }
  ]
})
