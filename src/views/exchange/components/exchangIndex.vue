<template>
  <div id="exchangIndex">
    <div
      id="exchangIndex"
      v-show="bgimg && bgimg_if"
      :style="{backgroundImage: 'url('+ bgimg +')'}"
    >
      <div class="exchangIndex_box">
        <div class="logo" v-if="logo">
          <img :src="logo" alt>
        </div>

        <div class="warn" v-if="!isonLine">
          <div class="triangle">
            <div class="triangleOne"></div>
            <div class="triangleTwo"></div>
          </div>
          <div class="warn_line">前端测试链接，中奖无效</div>
        </div>
        <div class="banner">
          <mt-swipe v-if="isShowBanner" class="swiper_container" :auto="outoNumber*1000">
            <mt-swipe-item v-for="(item,index) in  bannerList" :key="index">
              <a target="_blank" :href="item.link?item.link:'javascript:void(0);'">
                <img :src="item.banner_url" alt="banner">
              </a>
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <p>X: {{ myObject.x }} / Y: {{ myObject.y }} - Width: {{ myObject.w }} / Height: {{ myObject.h }}</p>
        <div class="redeem_code">
          <div class="redeem_code_input">
            <input
              id="test"
              type="text"
              v-model="valueText"
              @keyup="testNum()"
              @blur.prevent="testNum()"
              @keydown="testNum()"
              @keypress="testNum()"
              maxlength="19"
              placeholder=" 请输入兑奖码"
            >
          </div>
          <div class="redeem_code_input redeem_code_inputphone">
            <input
              id="phoneNum"
              type="number"
              v-model="phoneText"
              oninput="if(value.length>11)value=value.slice(0,11)"
              maxlength="11"
              placeholder="输入收到短信的手机号"
            >
          </div>
          <div
            class="condorm_btn"
            v-if="coverImgUrl"
            :style="`backgroundImage: url(${coverImgUrl });`"
            @click="isonLine?submitBtn():jumpNext()"
          ></div>
          <div class="condorm_btn" v-if="!coverImgUrl" @click="isonLine?submitBtn():jumpNext()">确定</div>

          <button class="pc_style" ref="pc_button" @click="sendMessage">传给pc</button>
        </div>
      </div>
    </div>
    <offine-web
      v-if="chilid_main.emergency_offline || chilid_main.offline_offline"
      :inputName="chilid_main"
    ></offine-web>
    <!-- :style="`left:${myObject.x/100}rem;top:${myObject.y/100}rem;witdh:${myObject.w/100}rem;height:${myObject.h/100}rem`" -->
    <vue-draggable-resizable
      v-if="dragShow"
      :w="myObject.w"
      :h="myObject.h"
      :x="myObject.x"
      :y="myObject.y"
      @dragging="onDrag"
      @resizing="onResize"
      :parent="true"
    >
      <div
        class="condorm_btn"
        v-if="coverImgUrl"
        style="height:100%;width:100%"
        :style="`backgroundImage:url(${coverImgUrl});left:${myObject.x/100}rem;top:${myObject.y/100}rem;`"
      ></div>
    </vue-draggable-resizable>
    <div
      v-if="!dragShow"
      class="dragShow_button"
      :style="`left:${child.x}rem;top:${child.y}rem;witdh:${child.w}rem;height:${child.h}rem;line-height:${child.h}rem;width:${child.w}rem`"
    >我是按钮</div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import { httpServer, apiSetting } from "../../../custom/js/http.js";
import offineWeb from "./offineWeb";
import VueDraggableResizable from "vue-draggable-resizable";

export default {
  name: "exchangIndex",
  components: {
    offineWeb
  },
  data() {
    return {
      child: {
        //拖拽被动按钮的默认值 单位rem
        x: this.$getlocalStorage("$style")
          ? this.$getlocalStorage("$style").x
          : 1.36, //1.36
        y: this.$getlocalStorage("$style")
          ? this.$getlocalStorage("$style").y
          : 9.48, //9.48
        w: this.$getlocalStorage("$style")
          ? this.$getlocalStorage("$style").w
          : 4.8, //4.8
        h: this.$getlocalStorage("$style")
          ? this.$getlocalStorage("$style").h
          : 0.9 //0.9
      },
      myObject: {
        //拖拽按钮默认值 单位px
        x: 68,
        y: 474,
        w: 240,
        h: 45
      },
      size: 1, //rem.js的根字体的值存下来
      dragShow: false, //控制拖拽按钮和被动按钮的显示
      swiperOption: {
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
          loop: true
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        loop: true,
        observer: true,
        observeParents: true
      },
      tipToast: "",
      coverImgUrl: "", //自定义按钮
      outoNumber: 1, //切换频率
      isShowBanner: true, //检测是否开启banner
      bgimg: "", //背景图片
      bannerList: "",
      logo: "",
      valueText: "", //输入框的值
      phoneText: "",
      isonLine: false, //只有返回值为700的时候才是属于上线的
      bgimg_if: true,
      chilid_main: {
        emergency_offline: false, //紧急下线
        offline_offline: false //已下线
      }
    };
  },
  created() {
    Indicator.open({
      text: "加载中...",
      spinnerType: "fading-circle"
    });
    // 获取rem.js存起来的尺寸
    this.size = this.$getlocalStorage("$rootFont");
    console.log(this.size);
    // 把存起来的rem的值，变成px赋值给拖拉拽按钮
    if (this.$getlocalStorage("$style")) {
      for (let key in this.myObject) {
        this.myObject[key] = Math.ceil(
          this.$getlocalStorage("$style")[key] * this.size
        );
      }
    }
    if (window.frames.length != parent.frames.length) {
      //此处代表着是被iframe嵌套的  隐藏拖拉拽  只显示红色按钮
      this.dragShow = true;
    }
  },
  mounted() {
    window.addEventListener("message", this.handleMessage);
    console.log("获取当前网址");
    console.log(window.location.href);
    console.log("截取后的网址", this.$windowUrl(window.location.href));
    if (!this.$getlocalStorage("parameter")) {
      this.$setlocalStorage("parameter", "");
    }

    httpServer(apiSetting.getAppConfig, {
      domainurl: this.$windowUrl(
        "http://test-direct.1dreams.com/exchange/exchange.html#/direct/1087637625482907648"
      )
    })
      .then(response => {
        // console.log("首页信息");
        // console.log(response);
        // 如果有code直接赋值给输入框
        if (this.$route.query.code) {
          this.valueText = this.testRex(this.$route.query.code);
        }
        document.title = response.app_external_name; //设置title

        this.$setlocalStorage(
          "remoteurl",
          this.$windowUrl(
            "http://test-direct.1dreams.com/exchange/exchange.html#/direct/1087637625482907648"
          )
        ); //请求成功 就存起来让下一个页面用
        // 700已上线
        if (response.on_line_state == 700) {
          this.isonLine = true;
        } else {
          this.isonLine = false;
        }
        switch (response.on_line_state) {
          case 800:
            this.bgimg_if = false;
            this.chilid_main.emergency_offline = true; //紧急下线
            break;
          case 900:
            this.bgimg_if = false;
            this.chilid_main.offline_offline = true; //紧急下线
            break;
        }
        // console.log(response.mid_page_infos.length);
        if (response.mid_page_infos.length > 0) {
          this.bannerList =
            response.mid_page_infos[0].mid_template_banner_infos;
          response.mid_page_infos[0].mid_page_element_infos.forEach(
            (value, index, array) => {
              switch (value.element_ename) {
                case "exchange_custom_logo":
                  // logo
                  this.logo = value.element_value;
                  break;
                case "exchange_custom_banner_time":
                  // 频率
                  this.outoNumber = value.element_value;
                  break;

                case "exchange_custom_banner_enabled":
                  // banner   启用
                  if (value.element_value == "false") {
                    this.isShowBanner = false;
                  } else {
                    this.isShowBanner = true;
                  }
                  break;
                case "exchange_default_backimg":
                  // 默认背景图片
                  this.bgimg = value.element_value;
                  break;
                case "exchange_custom_backimg":
                  // 自定义  背景
                  this.bgimg = value.element_value;
                  break;
                case "exchange_custom_button":
                  // 自定义  按钮
                  this.coverImgUrl = value.element_value;
                  break;
              }
            }
          );
        }

        Indicator.close();
      })
      .catch(error => {
        Indicator.close();
        if (error.data.message) {
          Toast({
            message: error.data.message,
            position: "bottom"
          });
        } else {
          Toast({
            message: "当前网址没有权限",
            position: "bottom"
          });
        }
        console.log(error); //loading层关闭
      });
  },
  methods: {
    onResize(x, y, width, height) {
      this.myObject.x = x;
      this.myObject.y = y;
      this.myObject.w = width;
      this.myObject.h = height;
      this.stylefun(this.myObject);
    },
    onDrag(x, y) {
      this.myObject.x = x;
      this.myObject.y = y;
      this.stylefun(this.myObject);
    },
    stylefun(item) {
      this.myObject.x = item.x;
      this.myObject.y = item.y;
      this.myObject.w = item.w;
      this.myObject.h = item.h;
      console.log("this.myObject1", this.myObject);
      console.log("this.myObject2", JSON.stringify(this.myObject));

      // 深拷贝，因为拖拽按钮的值是px  下面是把对象改成rem的值
      //   let obj = JSON.parse(JSON.stringify(this.myObject));
      let obj = Object.assign({}, this.myObject);
      for (let key in obj) {
        obj[key] = (obj[key] / this.size).toFixed(2) * 1;
      }
      this.$setlocalStorage("$style", obj);
      console.log("obj", obj);
    },
    getFullNum(num) {
      //处理非数字
      if (isNaN(num)) {
        return num;
      }
      //处理不需要转换的数字
      var str = "" + num;
      if (!/e/i.test(str)) {
        return num;
      }
      return num.toFixed(18).replace(/\.?0+$/, "");
    },
    sendMessage() {
      // 外部vue向iframe内部传数据
      window.parent.postMessage(
        {
          cmd: "returnHeight",
          params: {
            success: true,
            data: document.body.scrollHeight + "px"
          }
        },
        "*"
      );
    },
    handleMessage(event) {
      // 根据上面制定的结构来解析iframe内部发回来的数据
      console.log("我是pc传过来的消息", event.data.params);
      if (event.data.params) {
        this.bgimg = event.data.params.big_img.bg_img;
      }
    },
    submitBtn() {
      let regu = /^([\dA-Z]{4}-){3}[\dA-Z]{4}$/;
      let re = new RegExp(regu);
      // 避免重复点击
      if (this.tipToast) {
        this.tipToast.close();
      }

      if (this.valueText == "" || this.valueText.length < 16) {
        this.tipToast = Toast("请输入正确的兑换码");
        // return false;
      } else {
        if (
          /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(
            this.phoneText
          ) == false
        ) {
          this.tipToast = Toast("请输入正确的手机号码");
          return false;
        }
        Indicator.open("兑换中..."); //提交中的loading
        httpServer(apiSetting.postExchange, {
          redeemcode: this.valueText, //this.valueText
          phonenumber: this.phoneText,
          remoteurl: this.$windowUrl(
            "http://test-direct.1dreams.com/exchange/exchange.html#/direct/1087637625482907648"
          ) //window.location.origin
        })
          .then(response => {
            console.log("首页信息");
            this.$router.push({ name: "succeed" });
            Indicator.close();
            // }, 2000);
            this.$setlocalStorage("parameter", response);
          })
          .catch(error => {
            Indicator.close();
            Toast({
              message: error.data.message,
              position: "bottom"
            });
            console.log(error); //loading层关闭
          });
      }
    },
    testNum() {
      var testValue = document
        .getElementById("test")
        .value.replace(/[^\da-zA-Z]/g, "")
        .replace(/....(?!$)/g, "$&-")
        .toUpperCase();
      this.valueText = testValue;
    },
    testRex(val) {
      return val
        .replace(/[^\da-zA-Z]/g, "")
        .replace(/....(?!$)/g, "$&-")
        .toUpperCase();
    },
    jumpNext() {
      this.$router.push({ name: "succeed" });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.resize_drag {
  width: 5rem;
  height: 5rem;
  background: red;
  margin: 0 auto;
  position: relative;
}
#main_zong {
  height: 100%;
}
.condorm_btn {
  text-align: center;
  color: #ffffff;
  background: url(../assets/images/btn.png) no-repeat center;
  background-size: 100% 100%;
}
.dragShow_button {
  background: red;
  position: absolute;
  text-align: center;
}
.pc_style {
  //   position: absolute;
  //   width: 1rem;
  //   height: 1rem;
  //   top: 0.1rem;
  //   left: 0.1rem;
  //   background: red;
}
#exchangIndex {
  //   min-height: 100vh;
  height: 100%;
  width: 100%;
  // background: url(../assets/images/defaultBg.png) no-repeat;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  .exchangIndex_box {
    height: 100%;
    width: 100%;
    position: relative;
    .logo {
      position: absolute;
      width: 1.6rem;
      height: 1rem;
      z-index: 100;
      img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        position: relative;
        top: 50%;
        left: 50%;
        // transform: translateY(-50%);
        transform: translateX(-50%) translateY(-50%);
      }
    }
    .warn {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 100;
      overflow: hidden;
      .triangle {
        float: left;
        margin-right: -0.02rem;
        .triangleOne {
          width: 0;
          height: 0;
          border: 0.15rem solid red;
          border-left: 0.15rem solid transparent;
          border-bottom: 0.15rem solid transparent;
          position: relative;
        }
        .triangleTwo {
          width: 0;
          height: 0;
          border: 0.15rem solid red;
          border-left: 0.15rem solid transparent;
          border-top: 0.15rem solid transparent;
          position: relative;
        }
      }
      .warn_line {
        float: left;
        // width: 2.6rem;
        padding-left: 0.2rem;
        height: 0.6rem;
        background: red;
        color: #fff;
        padding-right: 0.2rem;
        font-size: 0.2rem;
        text-align: right;
        line-height: 0.6rem;
      }
    }

    .banner {
      width: 100%;
      height: 3.8rem;
      // background: red;
      .swiper_container {
        width: 100%;
        height: 100%;
        img {
          // display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
    .redeem_code {
      margin-top: 2.55rem;
      .redeem_code_input {
        width: 4.8rem;
        height: 0.88rem;
        margin: 0 auto;
        input {
          width: 100%;
          height: 100%;
          border-radius: 0.14rem;
          border: none;
          outline: none;
          background-color: #ffffff;
          border-radius: 0.14rem;
          border: solid 1px rgba(255, 255, 255, 0.38);
          text-align: center;
        }
      }
      .redeem_code_input {
        input {
          font-size: 0.3rem;
        }
      }
      .redeem_code_inputphone {
        margin-top: 0.24rem;
      }
      .condorm_btn {
        width: 4.8rem;
        height: 0.88rem;
        margin: 0 auto;
        text-align: center;
        line-height: 0.88rem;
        color: #ffffff;
        margin-top: 0.65rem;
        background: url(../assets/images/btn.png) no-repeat center;
        background-size: 100% 100%;
      }
    }
  }
}
#emergency_main {
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  padding-top: 1.8rem;
  background: #f4f4f4;
  img {
    display: block;
    width: 90%;
    margin: 0 auto;
  }
  p {
    font-family: PingFangSC-Semibold;
    font-size: 0.36rem;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0;
    text-align: center;
    margin-top: 0.3rem;
    color: #69a4ff;
  }
}
#offline_main {
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  padding-top: 0.8rem;
  background: #f4f4f4;
  img {
    display: block;
    width: 6.68rem;
    height: 8.85rem;
    margin: 0 auto;
  }
  p {
    font-family: PingFangSC-Semibold;
    font-size: 0.36rem;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0;
    text-align: center;
    margin-top: 0.3rem;
    color: #69a4ff;
  }
}
</style>
<style>
/* .mint-toast-text {
    color: red !important;
} */
</style>

