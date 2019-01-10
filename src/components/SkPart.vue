<template>
  <div class="sk-part">
    <slot></slot>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  export default {
    name: "sk-part",

    data() {
      return {};
    },

    computed: {
      ...mapGetters({
        isMini: 'isMini'
      })
    }
  }
</script>

<style scoped lang="scss">
  .sk-part {
    /*box-shadow: 0 0px 5px 0 rgba(0,0,0,.14);*/
    background-color: #fff;
  }
</style>
