import Vue from 'vue';
import axios from 'axios';
import apiSetting from "../../custom/js/apiSetting.js";
import {
  Toast
} from "mint-ui";

axios.interceptors.request.use(config => {

  //显示loading
  return config
}, error => {
  return Promise.reject(error)
})


axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.reject(error.response)
})

// cach拦截的回调
function errorState(response) {
  //隐藏loading
  // console.log(response)
  // 如果http状态码正常，则直接返回数据
  console.log('cach拦截的回调--------------------------')
  console.log(response)
  //401未登录 强制跳转到登录页
  // if (response.status == 401) {
  //     router.replace({
  //         path: 'login'
  //     })

  //     Vue.prototype.delCookie('Authorization')
  // }

  // if(response.status==404){
  //     alert('没请求到数据')
  // }
  if (response.status == 400) {
    Toast({
      message: response.data.message,
      position: "bottom"
    });
  }
  //403没权限

  if (response.status == 403) {
    Toast({
      message: response.data.message,
      position: "bottom"
    });
    // console.log(response.data)
  }

  //500服务器异常
  if (response.status == 500) {
    // Vue.prototype.$message({
    //   message: response.data.message,
    //   type: 'error'
    // });
    Toast({
      message: response.data.message,
      position: "bottom"
    });
    // console.log(response.data)
  }


  // if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
  //     return response
  //     // 如果不需要除了data之外的数据，可以直接 return response.data
  // } else {
  //     // Vue.prototype.$msg.alert.show({
  //     //         title: '提示',
  //     //         content: '网络异常'
  //     // })
  //     // Vue.prototype.$message({
  //     //     message: "response.data.text",
  //     //     type: 'error'
  //     // });
  // }

}
// 成功拦截的回调
function successState(res) {
  // console.log('成功拦截的回调--------------------------')
  // console.log(res)
  // alert(res.status);
  // Vue.prototype.$message({
  //     message: res.status,
  //     type: 'success'
  // });
  //隐藏loading
  //统一判断后端返回的错误码
  if (res.data.errCode == '404') {
    // Vue.prototype.$msg.alert.show({
    //     title: '提示',
    //     content: res.data.errDesc || '网络异常',
    //     onShow() {
    //     },
    //     onHide() {
    //         console.log('确定')
    //     }
    // })
  } else if (res.data.errCode != '000002' && res.data.errCode != '000000') {
    // Vue.prototype.$msg.alert.show({
    //     title: '提示',
    //     content: res.data.errDesc || '网络异常',
    //     onShow() {

    //     },
    //     onHide() {
    //         console.log('确定')
    //     }
    // })
  }
}
/*
opts参数：是apiSetting.js的属性
{
    url: 'http://saasmiddle.ugetme.com.cn/activity/app/GetAppTypeList',
    method: 'get',
    ispage:false,
    dataList:{},
    page:{}
}
*/




const httpServer = (opts, data) => {

  let Public = { //公共参数
  }

  let httpDefaultOpts = { //http默认配置
    method: opts.method,
    baseURL: "",
    url: opts.url,
    withCredentials: true,
    timeout: 10000,
    params: Object.assign(Public, data),
    data: Object.assign(Public, data),
    headers: opts.method == 'get' ? {
      'X-Requested-With': 'XMLHttpRequest',
      "Accept": "application/json",
      "Content-Type": "application/json; charset=UTF-8",
      'Authorization': 'Bearer ' + 'w'
    } : {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + 'w'
    }
  }

  // console.log(httpDefaultOpts.data)

  if (opts.method == 'get' || opts.method == 'delete') {
    delete httpDefaultOpts.data
  } else {
    delete httpDefaultOpts.params
  }

  if (typeof opts.beforeSend == "function") {
    var beforeSendResult = opts.beforeSend();
    if (typeof beforeSend != "undefined" && !beforeSendResult) {
      return false;
    }
  }
  // console.log("httpDefaultOpts.params:"+JSON.stringify(httpDefaultOpts.params) +".httpDefaultOpts.data:"+JSON.stringify(httpDefaultOpts.data));
  //resolve捕获请求的then；reject捕获的是请求的cach
  let promise = new Promise(function (resolve, reject) {
    axios(httpDefaultOpts).then(
      (res) => {
        //验证状态码
        successState(res)
        //验证是否分页
        var result = res.data;
        if (opts.ispage) {
          //验证是否带有分页

          //获得列表数据
          opts.dataList = result.collection;
          //分页设置
          opts.page.pageTotal = result.page_count;
          opts.page.total = result.total_count;
          //回调函数
          resolve(result);
        } else {
          //普通请求 不带分页
          resolve(result)
        }
      }
    ).catch(
      (response) => {
        //验证状态码
        errorState(response)
        //错误提示
        if (response) {
          // Vue.prototype.$message.warning(response.message);
        }
        //回调函数
        reject(response)
      }
    )

  })
  return promise
}
export {
  httpServer
}
export {
  apiSetting
}
