<template>
  <div id="exchange">
    <router-view></router-view>
    <!-- <exchangIndex></exchangIndex>
    <succeed></succeed>-->
  </div>
</template>

<script>
// import exchangIndex from "./components/exchangIndex";
// import succeed from "./components/succeed";

export default {
  name: "exchange",
  components: {
    // exchangIndex,
    // succeed
  }
};
</script>

<style>
div#exchange {
  height: 100%;
  width: 100%;
}
</style>
