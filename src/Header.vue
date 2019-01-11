<template>
  <div class="header-bar" :style="{left: (viewPort || {}).left + 'px'}">
    <mu-appbar style="width: 100%;" color="#fff" z-depth="2" textColor="#999">
      <mu-button icon slot="left" @click="onClickBarMenu">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      <div class="title">管理系统</div>
      <div class="bar-right" slot="right">

        <div class="logout-btn" @click="onClickLogout">
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
  import HttpClient from "./lib/http/HttpClient";
  import SystemApi from "./lib/http/SystemApi";
  import systemBase from "./lib/systemBase";
  import {EnRoutesConfig, RouterService} from "./plugin/router";

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
      },

      onClickLogout: function () {
        systemBase.confirm("确定要退出登陆吗", () => {
          this.logout().catch();
        });
      },

      async logout() {
        await HttpClient.request({
          url: SystemApi.logout
        });
        this.$store.dispatch("logout");
        RouterService.replace(EnRoutesConfig.pageUserLogin);
      }
    }
  }
</script>

<style scoped>
  .header-bar{
    transition: left .45s cubic-bezier(.23,1,.32,1);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 100;
  }

  .title{
    color: #666;
    font-size: 18px;
  }

  .logout-btn{
    display: inline-block;
    vertical-align: middle;
  }
</style>
