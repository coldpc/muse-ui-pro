<template>
  <div class="sk-layout" :class="{'mini-layout': isMini}">
    <slot></slot>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  export default {
    name: "sk-layout",

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
  .sk-layout {
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;

    &.mini-layout{
      padding: 10px;
    }
  }
</style>
