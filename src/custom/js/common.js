exports.install = function (Vue, options) {
  /*此处封装公共函数，方法
   *调用示例：
   *组件内调用 this.setCookie
   *路由或者拦截器里调用 Vue.prototype.setCookie
   * */
  /*写cookie,如setCookie('token','1111111')*/
  Vue.prototype.mvp = function (name, value, days) {
      console.log('我哈哈，可以了')
    },
    Vue.prototype.$getlocalStorage = function (name) { //"personal"
      return JSON.parse(localStorage.getItem(name))
    },
    /*例：this.$setlocalStorage('personal',respons)*/
    Vue.prototype.$setlocalStorage = function (name, obj) { //"personal"
      localStorage.setItem(name, JSON.stringify(obj));
    }
  // 过了url 取'?'前面的地址
  Vue.prototype.$windowUrl = function (url) {
    if (url.indexOf("?") != -1) {
      return url = url.split("?")[0];
    } else {
      return url;
    }
  }
};
