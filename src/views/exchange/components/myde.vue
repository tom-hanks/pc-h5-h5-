<template>
  <div id="myde"></div>
</template>

<script>
export default {
  name: "myde",
  components: {},

  data() {
    return {
      width: 0,
      height: 0,
      top: 0,
      left: 0
    };
  },
  mounted() {
    let box = document.getElementById("myde");
    document.onmousedown = function(e) {
      console.log("1-按下鼠标");
      console.log(e);
      console.log(e.pageX);
      console.log(e.pageY);
      let disx = e.pageX - box.offsetLeft;
      let disy = e.pageY - box.offsetTop;
      document.onmousemove = function(e) {
        box.style.left = e.pageX - disx + "px";
        box.style.top = e.pageY - disy + "px";
      };
      //释放鼠标按钮，将事件清空，否则始终会跟着鼠标移动
      document.onmouseup = function() {
        document.onmousemove = document.onmouseup = null;
      };
    };
  },
  methods: {}
};
</script>
<style>
#myde {
  position: absolute;
  width: 100px;
  height: 100px;
  top: 10px;
  left: 10px;
  background: red;
}
</style>
