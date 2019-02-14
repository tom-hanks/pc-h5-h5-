<template>
  <div id="goTop" @click="goTop()" v-show="goTopShow">
    <div class="goTop">
      <i class="goTopIcon"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: "goTop",
  data() {
    return {
      scrollTop: "",
      goTopShow: false
    };
  },
  methods: {
    handleScroll() {
      this.scrollTop = document.querySelectorAll(".succeed_box")[0].scrollTop;
      if (this.scrollTop > 1) {
        this.goTopShow = true;
      } else {
        this.goTopShow = false;
      }
    },
    goTop() {
      let timer = null,
        _that = this;
      cancelAnimationFrame(timer);
      timer = requestAnimationFrame(function fn() {
        console.log("我是GOTO", this);
        if (_that.scrollTop > 0) {
          _that.scrollTop -= 50;
          document.querySelectorAll(".succeed_box")[0].scrollTop =
            _that.scrollTop;
          timer = requestAnimationFrame(fn);
        } else {
          cancelAnimationFrame(timer);
          _that.goTopShow = false;
        }
      });
    }
  },
  mounted() {
    // window.addEventListener("scroll", this.handleScroll);
    window.addEventListener(
      "scroll",
      () => {
        this.handleScroll();
        // console.log(
        //   "dsdsasasasa",
        //   document.querySelectorAll(".succeed_box")[0].scrollTop
        // );
      },
      true
    );
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>
 
<style lang='less' scoped>
#goTop {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 1.2rem;
  height: 1.3rem;
}
.goTopIcon {
  display: block;
  width: 1.2rem;
  height: 1.3rem;
  background: url(../assets/images/gotop.png) no-repeat center;
  background-size: 100%;
}
</style>