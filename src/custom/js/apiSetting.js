//静态
let httpApiStatic = function () {
    let vUrl = null;
    if (window.location.origin.indexOf("dev-") >= 0) {
        //   开发环境  http://dev-saasapi.1dreams.com
        vUrl = "http://dev-saasapi.1dreams.com"
    } else if (window.location.origin.indexOf("test-") >= 0) {
        //测试环境  
        vUrl = "http://test-saasapi.1dreams.com"
    } else if (window.location.host.toLowerCase() == "localhost:8080" || window.location.port == "8099") {
        //   本地的话也是连接开发环境
        vUrl = "http://test-saasapi.1dreams.com"
        //"http://dev-saasapi.1dreams.com"
    } else {
        //正式环境
        vUrl = "http://saasapi.1dreams.com"
    }
    return vUrl;
}
//交互
let httpApiNteractive = function () {
    let vUrl = "http://test-saasdirectminingapi.1dreams.com";
    switch (window.location.host.toLowerCase()) {
        case "localhost:8080":
            vUrl = "http://dev-saasdirectminingapi.1dreams.com"
            break;
        case "192.168.22.86:8090":
            vUrl = "http://dev-saasdirectminingapi.1dreams.com"
            break;
    }
    return vUrl;
}
// 在本地的IIS里的打开方式 localhost:8090/exchange/exchange.html#/
let serviceModule = {
    getAppConfig: {
        url: httpApiStatic() + '/api/web_app/get_app_config', //接口网址
        method: 'get', //请求方式
        ispage: false, //是否分页
    },
    postExchange: {
        url: httpApiNteractive() + '/api/direct_exchange_record/exchange', //接口网址
        method: 'post',
        ispage: false,
    },
    postCharge: {
        url: httpApiNteractive() + '/api/direct_rechage_record/charge', //接口网址
        method: 'post',
        ispage: false,
    },
}
// const ApiSetting = {...serviceModule }

export default serviceModule
