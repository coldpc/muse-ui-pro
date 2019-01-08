<template>
  <div class="header-bar" :style="{left: (viewPort || {}).left + 'px'}">
    <mu-appbar style="width: 100%;" color="primary">
      <mu-button icon slot="left" @click="onClickBarMenu">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      <div class="title">管理系统</div>
      <div class="bar-right" slot="right">

        <div style="display: inline-block;vertical-align: middle;">
          <mu-button icon>
            <mu-icon large value="power_settings_new"></mu-icon>
          </mu-button>
        </div>
      </div>
    </mu-appbar>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    data() {
      return {};
    },

    computed:{
      ...mapGetters({
        "viewPort": "viewPort"
      })
    },

    methods: {
      onClickBarMenu() {
        this.$emit("clickMenu");
      }
    }
  }
</script>

<style scoped>
  .header-bar{
    transition: left .45s cubic-bezier(.23,1,.32,1);
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
  }
</style>
