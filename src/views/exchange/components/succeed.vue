<template>
  <div id="succeed" v-if="bgimg" :style="{backgroundImage: 'url('+ bgimg +')'}">
    <div class="succeed_box">
      <div class="warn" v-if="!isonLine">
        <div class="triangle">
          <div class="triangleOne"></div>
          <div class="triangleTwo"></div>
        </div>
        <div class="warn_line">前端测试链接，中奖无效</div>
      </div>
      <!-- 默认logo -->
      <div class="default_log" v-if="!logo"></div>
      <!-- 自定义logo -->
      <div class="logo" v-if="logo">
        <img :src="logo" alt>
      </div>
      <div :class="window_class">
        <div class="success_title" :class="title_class">
          <div class="title">{{title}}</div>
          <p v-if="type_ename == 'kami' && isonLine">卡号：{{raw_code}}</p>
          <p v-if="type_ename == 'kami' && isonLine">卡密：{{raw_key}}</p>
        </div>
      </div>
      <div class="redeem_code" v-if="changeItem == 'zichong'">
        <div class="redeem_code_input">
          <input
            id="phoneNum"
            ref="phoneNum"
            v-model="phoneText"
            type="number"
            @input="phonePanduan"
            placeholder="输入手机号"
            maxlength="11"
          >
          
          <span class="closed" @click="closedClick" v-if="closed"></span>
        </div>
        <!-- 自定义按钮 -->
        <div
          class="condorm_btn"
          v-if="coverImgUrl"
          :style="{backgroundImage: 'url(' + coverImgUrl + ')'}"
          @click="type_ename?submitBtn():''"
        ></div>
        <!-- 默认按钮 -->
        <div class="condorm_btn" v-if="!coverImgUrl" @click="type_ename?submitBtn():''">确定</div>
      </div>
      <div class="explain_box">
        <!-- v-html="explain" -->
        <div class="explain" v-html="explain"></div>
      </div>
    </div>
    <div class="previewBtnList" v-if="awardsList.length>1 && !isonLine">
      <div class="firstPrice" @click="showAwrdsList">
        资源{{awardIndex}}
        <i :class="isShowList?'rotateOver':'rotate'"></i>
      </div>
      <ul v-if="isShowList">
        <li
          @click="changeAwrdsTitle(Aindex,item)"
          v-for="(item,Aindex) in awardsList"
          :key="Aindex"
        >资源{{Aindex+1}}</li>
        <!-- <li>3等奖</li>
        <li>4等奖</li>-->
      </ul>
    </div>
    <!-- <div
      id="top"
      class="go_top"
    ></div>-->
    <go-top></go-top>
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../../../custom/js/http.js";
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import goTop from "./goTo";

export default {
  name: "succeed",
  components: {
    goTop
  },
  data() {
    return {
      coverImgUrl: "", //自定义按钮
      bgimg: "", //背景图片
      tipToast: "",
      title: "",
      explain: "",
      phoneText: "",
      type_ename: "", //传过来的类型是直冲还是卡密
      logo: "",
      raw_code: "",
      raw_key: "",
      isonLine: false, // 是否上线
      window_class: "success_title_bg",
      title_class: "", //动态添加class在没有卡密的情况下
      parameter: "",
      closed: true, //控制叉号显示隐藏
      isShowList: false,
      awardsList: [],
      FirstAwardItem: [],
      awardIndex: 1,
      changeItem: ""
    };
  },
  created() {
    Indicator.open({
      text: "加载中...",
      spinnerType: "fading-circle"
    });
  },
  mounted() {
    // var x;
    // var otop;
    // function myScroll() {
    //   var timer = setInterval(function() {
    //     var moveby = 15;
    //     x -= Math.ceil((x * moveby) / 100);
    //     if (x <= 0) {
    //       x = 0;
    //       clearInterval(timer);
    //     }
    //     if (document.body.scrollTop) {
    //       document.body.scrollTop = x;
    //     } else {
    //       document.documentElement.scrollTop = x;
    //     }
    //   }, 20);
    // }
    // function switchD() {
    //   x = document.body.scrollTop || document.documentElement.scrollTop;
    //   if (x > 100) {
    //     otop.style.display = "block";
    //   } else {
    //     otop.style.display = "none";
    //   }
    // }
    // window.onload = function() {
    //   console.log("jlkjlj");
    //   otop = document.getElementById("top");
    //   window.onscroll = switchD;
    //   otop.onclick = myScroll;
    // };
    this.parameter = this.$getlocalStorage("parameter");
    console.log("hhaa");
    console.log(this.parameter.app_mid_material_id);
    console.log(this.parameter.raw_code);
    console.log(this.parameter.raw_key);
    this.phoneText = this.parameter.phone;
    if (this.parameter.material_type_ename == "kami") {
      this.raw_code = this.parameter.raw_code;
      this.raw_key = this.parameter.raw_key;
    }

    this.type_ename = this.parameter.material_type_ename;
    httpServer(apiSetting.getAppConfig, {
      domainurl: this.$getlocalStorage("remoteurl")
    })
      .then(response => {
        this.awardsList = response.mid_material_allot_prize_explain_infos;
        document.title = response.app_external_name; //设置title

        if (response.on_line_state != 700) {
          this.isonLine = false;
          //如果没有上线进来默认给第一个提示语
          if (this.awardsList[0]) {
            this.title = this.awardsList[0].prize_title;
            this.explain = this.awardsList[0].prize_explain;
            //如果第一个是直采的话 要显示输入框
            if (this.awardsList[0].material_type_ename == "zichong") {
              this.changeItem = "zichong";
            }
            console.log("00000000000000" + this.title);
          }
        } else {
          // 此处表示上线的时候判断输入框显示隐藏
          if (this.parameter.material_type_ename == "kami") {
          } else {
            this.changeItem = "zichong";
          }
          this.isonLine = true;
        }
        console.log(response.mid_material_allot_prize_explain_infos);
        //通过兑换码返回的id来比对 渲染对应的祝福语
        response.mid_material_allot_prize_explain_infos.forEach(
          (value, index, array) => {
            if (
              value.mid_material_allot_id == this.parameter.app_mid_material_id //this.parameter.id
            ) {
              this.title = value.prize_title;
              this.explain = value.prize_explain;

              // console.log(value.mid_material_allot_id);
            }
          }
        );
        response.mid_page_infos[0].mid_page_element_infos.forEach(
          (value, index, array) => {
            switch (value.element_ename) {
              case "exchange_custom_logo":
                // logo
                this.logo = value.element_value;
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
        response.mid_page_infos[1].mid_page_element_infos.forEach(
          (value, index, array) => {
            if (value.element_ename == "exchange_window_class") {
              switch (value.element_value) {
                case "0":
                  this.window_class = "success_title_bg";
                  //   this.type_ename != 'kami'
                  if (this.type_ename != "kami") {
                    this.title_class = "success_title_class";
                  }
                  break;
                case "1":
                  console.log("1");
                  this.window_class = "success_title_bg_1";
                  if (this.type_ename != "kami") {
                    this.title_class = "success_title_class_1";
                  }
                  break;
                case "2":
                  console.log("2");
                  this.window_class = "success_title_bg_2";
                  if (this.type_ename != "kami") {
                    this.title_class = "success_title_class_2";
                  }
                  break;
                case "3":
                  console.log("3");
                  this.window_class = "success_title_bg_3";
                  if (this.type_ename != "kami") {
                    this.title_class = "success_title_class_3";
                  }
                  break;
                case "4":
                  console.log("4");
                  this.window_class = "success_title_bg_4";
                  if (this.type_ename != "kami") {
                    this.title_class = "success_title_class_4";
                  }
                  break;
                case "5":
                  console.log("5");
                  this.window_class = "success_title_bg_5";
                  if (this.type_ename != "kami") {
                    this.title_class = "success_title_class_5";
                  }
                  break;
              }
            }
          }
        );
        Indicator.close();
      })
      .catch(error => {
        console.log(error); //loading层关闭
      });
  },
  methods: {
    backTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    changeAwrdsTitle(index, item) {
      console.log(item.material_type_ename);
      this.changeItem = item.material_type_ename;
      this.title = this.awardsList[index].prize_title;
      this.explain = this.awardsList[index].prize_explain;
      this.awardIndex = index + 1;
      this.isShowList = false;
    },
    showAwrdsList() {
      this.isShowList = !this.isShowList;
    },
    submitBtn() {
      // 避免重复点击
      if (this.tipToast) {
        this.tipToast.close();
      }
      if (
        /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(
          this.phoneText
        ) == false
      ) {
        this.tipToast = Toast("请输入正确的手机号码");
        return false;
      } else {
        // 这里是验证手机号码正确的情况下的操作
        httpServer(apiSetting.postCharge, {
          redeemcode: this.parameter.redeem_code, //this.valueText
          rechargenumber: this.phoneText,
          remoteurl: this.$getlocalStorage("remoteurl"), // window.location.origin
          phonenumber: this.parameter.phone
        })
          .then(response => {
            console.log("首页信息");
            if (response.code == 200) {
              Toast(response.message);
            } else {
              Toast(response.message);
            }
            // if (response.code == 400) {
            //     Toast(response.message);
            // }
            console.log(response);
          })
          .catch(error => {
            console.log(error); //loading层关闭
          });
      }
    },
    phonePanduan() {
      if (this.$refs.phoneNum.value.length >= 11) {
        this.closed = true;
      } else {
        this.closed = false;
      }
      if (this.$refs.phoneNum.value.length > 11) {
        this.phoneText = this.$refs.phoneNum.value.slice(0, 11);
      }
    },
    closedClick() {
      this.phoneText = "";
      this.closed = false;
    }
  }
};
</script>

<style  lang='less'>
body {
  position: absolute !important;
}

#succeed {
  height: 100%;
  width: 100%;
  // background: url(../assets/images/default2.png) no-repeat;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;
  position: relative;
  .succeed_box {
    height: 100%;
    width: 100%;
    position: relative;
    overflow-y: auto;
    .logo {
      position: absolute;
      width: 1.6rem;
      height: 1rem;
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
      right: 0px;
      top: 0px;
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
    .default_log {
      position: absolute;
      width: 2.27rem;
      height: 0.65rem;
      background: url(../assets/images/defaultLogo.png) no-repeat;
      background-size: 100% 100%;
      top: 0.2rem;
      left: 0.3rem;
    }
    .success_title_bg {
      width: 100%;
      height: 3.4rem;
      background: url(../assets/images/dialog_old.png) no-repeat;
      background-size: 100% 100%;
      padding-top: 3rem;
      .success_title {
        height: 3.4rem;
        padding: 0rem 1.15rem;
        color: #f5a623;
        .title {
          font-size: 0.48rem;
          text-align: center;
          margin-bottom: 0.4rem;
        }

        p {
          text-align: left;
          margin-bottom: 0.2rem;
        }
      }
      .success_title_class {
        padding-top: 0.8rem;
      }
    }

    .success_title_bg_1 {
      width: 100%;
      height: 5.32rem;
      box-sizing: border-box;
      background: url(../assets/images/dialog1.png) no-repeat;
      background-size: 100% 100%;
      padding-top: 2.5rem;
      margin-top: 1.28rem;
      .success_title {
        height: 3.4rem;
        padding: 0rem 1.15rem;
        color: #ffffff;
        .title {
          font-size: 0.4rem;
          text-align: center;
          margin-bottom: 0.18rem;
        }
        p {
          text-align: left;
          padding-left: 0.5rem;

          //   margin-bottom: 0.2rem;
        }
      }
      .success_title_class_1 {
        padding-top: 0.6rem;
      }
    }
    .success_title_bg_2 {
      width: 100%;
      //   height: 5.97rem;
      box-sizing: border-box;
      background: url(../assets/images/dialog2.png) no-repeat;
      background-size: 100% 100%;
      padding-top: 4rem;
      margin-top: 1.28rem;
      .success_title {
        height: 2rem;
        padding: 0rem 1.15rem;
        color: #ffffff;
        .title {
          font-size: 0.4rem;
          text-align: center;
          //   margin-bottom: 0.4rem;
        }
        p {
          text-align: left;
          padding-left: 0.5rem;
          //   margin-bottom: 0.2rem;
        }
      }
      .success_title_class_2 {
        .title {
          font-size: 0.48rem;
          //   margin-bottom: 0.4rem;
        }
      }
    }
    .success_title_bg_3 {
      width: 100%;
      height: 5.97rem;
      box-sizing: border-box;
      background: url(../assets/images/dialog3.png) no-repeat;
      background-size: 100% 100%;
      padding-top: 1.5rem;
      margin-top: 1.28rem;
      .success_title {
        height: 2rem;
        padding: 0rem 1.15rem;
        color: #2d303a;
        .title {
          font-size: 0.4rem;
          text-align: center;
          margin-bottom: 1.4rem;
        }
        p {
          text-align: left;
          padding-left: 0.5rem;
          //   margin-bottom: 0.2rem;
          color: #ffffff;
        }
      }
      .success_title_class_3 {
        .title {
          font-size: 0.48rem;
        }
      }
    }
    .success_title_bg_4 {
      width: 100%;
      height: 5.97rem;
      box-sizing: border-box;
      background: url(../assets/images/dialog4.png) no-repeat;
      background-size: 100% 100%;
      padding-top: 1.95rem;
      .success_title {
        height: 2rem;
        padding: 0rem 1.15rem;
        color: #ffffff;
        .title {
          font-size: 0.4rem;
          text-align: center;
          margin-bottom: 1.42rem;
        }
        p {
          text-align: left;
          padding-left: 0.5rem;
          //   margin-bottom: 0.2rem;
        }
      }
      .success_title_class_4 {
        // padding-top: 0.6rem;
      }
    }
    .success_title_bg_5 {
      width: 100%;
      height: 5.97rem;
      box-sizing: border-box;
      background: url(../assets/images/dialog5.png) no-repeat;
      background-size: 100% 100%;
      padding-top: 1.65rem;
      margin-top: 1.2rem;
      .success_title {
        height: 2rem;
        padding: 0rem 1.45rem;
        color: #ffffff;
        .title {
          font-size: 0.36rem;
          text-align: center;
          margin-bottom: 1.62rem;
        }
        p {
          text-align: left;
          padding-left: 0.5rem;
          //   margin-bottom: 0.2rem;
        }
      }
      .success_title_class_5 {
        // padding-top: 0.6rem;
      }
    }
    .redeem_code {
      margin-top: 0.3rem;
      .redeem_code_input {
        width: 4.8rem;
        height: 0.88rem;
        margin: 0 auto;
        position: relative;
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
        .closed {
          display: inline-block;
          width: 0.7rem;
          height: 0.88rem;
          // background: red;
          background-color: transparent;
          position: absolute;
          top: 0;
          right: 0;
        }
        .closed:after {
          width: 0.4rem;
          height: 0.4rem;
          // background-repeat: no-repeat;
          background: url(../assets/images/close.png) no-repeat;
          -webkit-background-size: 100%;
          background-position: center center;
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -0.2rem;
          margin-left: -0.2rem;
          content: "";
        }
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
    .explain_box {
      width: 6.8rem;
      margin: 0.5rem auto;
      min-height: 2rem;
      border-radius: 0.15rem;
      background: url(../assets/images/header.png) no-repeat;
      background-size: 100% 0.7rem;
      padding-top: 0.7rem;
      .explain {
        min-height: 1.6rem;
        line-height: 0.46rem;
        padding: 0.2rem 0.45rem;
        background: rgba(255, 255, 255, 0.8);
        border-bottom-right-radius: 0.15rem;
        border-bottom-left-radius: 0.15rem;
        font-size: 0.28rem;
      }
    }
  }
  .go_top {
    width: 0.94rem;
    height: 0.94rem;
    background: red;
    position: fixed;
    bottom: 0;
    right: 0;
  }
  .previewBtnList {
    position: absolute;
    top: 1rem;
    right: 0.2rem;
    z-index: 999;
    .firstPrice {
      width: 1.3rem;
      height: 0.6rem;
      line-height: 0.6rem;
      color: #fff;
      background: rgba(0, 0, 0, 0.8);
      margin-bottom: 0.1rem;
      font-size: 0.24rem;
      border-radius: 0.08rem;
      cursor: pointer;
      padding-left: 0.2rem;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      i {
        display: block;
        width: 0.3rem;
        height: 0.3rem;
        background: url(../assets/images/down.png) no-repeat center;
        background-size: 0.27rem 0.15rem;
        position: absolute;
        right: 0.15rem;
        top: 0.15rem;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
      .rotate {
        transform-origin: center center;
        transform: rotate(0deg); //返回原点
        -webkit-transform: rotate(0deg);
        transition: transform 0.2s;
      }
      .rotateOver {
        transform-origin: center center;
        transform: rotate(180deg); //返回原点
        -webkit-transform: rotate(180deg);
        transition: transform 0.2s;
      }
    }
    ul {
      li {
        width: 1.5rem;
        height: 0.6rem;
        line-height: 0.6rem;
        color: #fff;
        background: rgba(0, 0, 0, 0.8);
        text-align: center;
        margin-bottom: 0.1rem;
        font-size: 0.24rem;
        border-radius: 0.08rem;
        cursor: pointer;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
    }
  }
}
</style>