<template>
  <div :class="`main-container ${isMini ? 'min-body' : 'common-body'} ${isLogin ? 'auth-body' : 'no-auth-body'}`">

    <mu-drawer :open.sync="openLeftPart" :docked="!isMini" :right="false" width="260">
      <mu-paper :z-depth="1" class="menu-part-wrap">
        <Menu></Menu>
      </mu-paper>
    </mu-drawer>

    <div class="right-part" :style="{paddingTop: viewPort.top + 'px', marginLeft: viewPort.left + 'px'}">

      <Header @clickMenu="onClickBarMenu"></Header>
      <div class="route-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Menu from './Menu';
  import Header from './Header';
  import {UtilsBase} from "./lib/utils/UtilsBase";


  export default {
    data() {
      return {
        openLeftPart: false
      };
    },

    components: {
      Menu, Header
    },

    watch: {
      openLeftPart(v) {
        this.$store.dispatch("setLeftMenu", v);
      },

      isOpenLeftMenu(isOpen) {
        let viewPort = UtilsBase.deepCopy(this.viewPort);
        if (isOpen && !this.isMini && viewPort.left === 0) {
          viewPort.left = 260;
          this.setViewPort(viewPort);

        }else if (viewPort.left > 0){
          viewPort.left = 0;
          this.setViewPort(viewPort);
        }
      }
    },

    created() {
      this.openLeftPart = this.isOpenLeftMenu;
    },

    computed:{
      ...mapGetters({
        "userData": "user/data",
        "isLogin": "isLogin",
        "viewPort": "viewPort",
        "isMini": "isMini",
        "isOpenLeftMenu": "isOpenLeftMenu"
      })
    },

    methods: {
      onClickBarMenu() {
        this.openLeftPart = !this.openLeftPart;
      },

      setViewPort(viewPort) {
        this.$store.dispatch("setViewPort", viewPort);
      }
    }
  }
</script>

<style scoped lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .right-part{
    transition: margin-left .45s cubic-bezier(.23,1,.32,1);
  }
</style>

<style lang="scss">
  .menu-part-wrap{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden;
    background-color: #fff;
    z-index: 200;
  }
</style>
