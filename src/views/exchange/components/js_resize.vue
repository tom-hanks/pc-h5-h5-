<template>
  <div>... Something here ...
    <vue-draggable-resizable
      :w="dragWidth"
      :h="dragHeight"
      :x="dragX"
      :y="dragY"
    >... And Something here ...</vue-draggable-resizable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dragWidth: 540,
      dragHeight: 140,
      dragX: 523,
      dragY: 120
    };
  },

  mounted() {
    let browserWindowWidth = window.innerWidth;
    let browserWindowHeight = window.innerHeight;

    let browserHorizonHalf = browserWindowWidth / 2;
    let browserVerticalHalf = browserWindowHeight / 2;

    let dragHalfWidth = this.dragWidth / 2;
    let dragHalfHeight = this.dragHalf / 2;

    this.dragX = browserHorizonHalf - dragHalfWidth;
    this.dragY = browserVerticalHalf - dragHalfHeight;
  }
};
</script>
