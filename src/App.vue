<template>
  <div :class="`main-container ${isMini ? 'min-body' : 'common-body'} ${isLogin ? 'auth-body' : 'no-auth-body'}`">

    <mu-drawer v-if="isLogin" :open.sync="openLeftPart" :docked="!isMini" :right="false" :width="viewPort.leftMenuWidth">
      <div :z-depth="0" class="menu-part-wrap">
        <UserIcon></UserIcon>
        <Menu></Menu>
      </div>
    </mu-drawer>

    <div class="right-part" :style="isLogin ? {paddingTop: viewPort.top + 'px', marginLeft: viewPort.left + 'px'} : {}">

      <Header v-if="isLogin" @clickMenu="onClickBarMenu"></Header>
      <div class="route-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Menu from './layout/Menu';
  import Header from './layout/Header';
  import UserIcon from './layout/UserIcon';

  export default {
    data() {
      return {
        openLeftPart: false
      };
    },

    components: {
      Menu, Header, UserIcon
    },

    watch: {
      openLeftPart(v) {
        this.$store.dispatch("setLeftMenu", v);
      },

      isOpenLeftMenu(isOpen) {
        // 状态管理触发
        if (this.openLeftPart !== isOpen) {
          return this.openLeftPart = isOpen;
        }else {
          this.$store.dispatch("setLeftMenu", isOpen);

          let left = (isOpen && !this.isMini) ? this.viewPort.leftMenuWidth : 0;
          if (parseInt(this.viewPort.left) !== left) {
            this.$store.dispatch("setViewPort", {left});
          }
        }
      },
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
      }
    }
  }
</script>

<style lang="scss">
  @import "theme/app";
  .menu-part-wrap{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden;
    background-color: #222;
    z-index: 200;
  }
</style>

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
