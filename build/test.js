const fs = require('fs');
const path = require('path');
let htmlArr = fs.readdirSync(path.resolve(__dirname,'../src/views'));
let entrys = {};
// console.log(htmlArr);
// let htmlArr = ['app', 'home', 'login'];
let reg = /^\./;
for(let item of htmlArr){
    console.log(reg.test(item))
    if(!reg.test(item)){
        entrys[item] = `./src/views/${item}.js`;
    }
}
console.log(entrys);