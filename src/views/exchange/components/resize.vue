<template>
  <div style="height: 500px; width: 500px; border: 1px solid red; position: relative;">
    <vue-draggable-resizable
      :w="myObject.w"
      :h="myObject.h"
      @dragging="onDrag"
      @resizing="onResize"
      :parent="true"
    >
      <p>Hello! I'm a flexible component. You can drag me around and you can resize me.
        <br>
        X: {{ myObject.x }} / Y: {{ myObject.y }} - Width: {{ myObject.w }} / Height: {{ myObject.h }}
      </p>
    </vue-draggable-resizable>
  </div>
</template>

<script>
import VueDraggableResizable from "vue-draggable-resizable";

export default {
  data() {
    return {
      myObject: {
        w: 100,
        h: 100,
        x: 0,
        y: 0
      }
    };
  },
  methods: {
    onResize: function(x, y, width, height) {
      this.myObject.x = x;
      this.myObject.y = y;
      this.myObject.w = width;
      this.myObject.h = height;
    },
    onDrag: function(x, y) {
      this.myObject.x = x;
      this.myObject.y = y;
    }
  }
};
</script>