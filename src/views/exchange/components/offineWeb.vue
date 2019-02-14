<template>
  <div id="offineWeb">
    <!-- 紧急下线 emergency_offline-->
    <div
      id="emergency_main"
      v-if="inputName.emergency_offline"
    >
      <!-- <img
        src="../assets/images/emergencyoffline.png"
        alt=""
      > -->
      <div class="emergency_main_bg"></div>
      <p>活动火热升级中，请稍后再来…</p>
    </div>
    <!-- 已下线 -->
    <div
      id="offline_main"
      v-if="inputName.offline_offline"
    >
      <!-- <img
        src="../assets/images/offline.png"
        alt=""
      > -->
      <div class="offline_main_bg"></div>
      <p>活动已结束，请期待下期活动…</p>
    </div>
  </div>

</template>

<script>
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import { httpServer, apiSetting } from "../../../custom/js/http.js";
export default {
  name: "offineWeb",
  props: {
    inputName: ""
  },
  components: {},
  data() {
    return {};
  },

  mounted() {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
#offineWeb {
  height: 100%;
}
#emergency_main {
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  padding-top: 1.8rem;
  background: #f4f4f4;
  .emergency_main_bg {
    display: block;
    width: 90%;
    height: 7.63rem;
    margin: 0 auto;
    background: url(../assets/images/emergencyoffline.png) no-repeat center;
    background-size: 100% 100%;
  }
  p {
    font-family: PingFangSC-Semibold;
    font-size: 0.36rem;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
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
  .offline_main_bg {
    display: block;
    width: 6.68rem;
    height: 8.85rem;
    margin: 0 auto;
    background: url(../assets/images/offline.png) no-repeat center;
    background-size: 100% 100%;
  }
  p {
    font-family: PingFangSC-Semibold;
    font-size: 0.36rem;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
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

