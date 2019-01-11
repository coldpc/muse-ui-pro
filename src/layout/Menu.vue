<template>
  <div class="menu-list-con">
      <div class="sk-list" v-for="(menu, index) in menuListData" :key="`list-${menu.path}`">
          <div :class="`sk-item${menu.path === currentRouteName?' active' : ''}`" @click="goto(menu.path)">
            <mu-ripple></mu-ripple>
            <div class="left">
              <mu-icon size="16" :value="menu.icon"></mu-icon>
            </div>
            <div class="main">{{menu.title}}</div>
            <div v-if="menu.children" class="right">
              <mu-icon size="18" value="keyboard_arrow_down"></mu-icon>
            </div>
        </div>

        <div v-if="menu.children" class="sk-list" v-for="(childMenu) in menu.children" :key="`list-${childMenu.path}`">
          <div :class="`sk-item${children.path === currentRouteName?' active' : ''}`"  @click="goto(children.path)">
            <mu-ripple></mu-ripple>
            <div class="main">{{children.title}}</div>
          </div>
        </div>
      </div>

  </div>
</template>

<script>

  import { mapGetters } from 'vuex'
  import {RouterService} from "../plugin/router/index";

  export default {
    data() {
      return {
        open: 'send',

        menuListData: [
          {
            title: "数据监控",
            path: "home",
            icon: "timeline",
            className: "home",
            isActive: true
          },

          {
            title: "Banner配置",
            path: "page.bannerConfig.bannerConfig",
            icon: "settings",
            className: "graphic"
          },


          {
            title: "用户管理",
            path: "page.userManager.userManager",
            icon: "person_add",
            className: "graphic"
          },
          {
            title: "产品管理",
            path: "page.productManager.productManager",
            icon: "toys",
            className: "graphic"
          },

          {
            title: "渠道管理",
            path: "page.channel.manager",
            icon: "tram",
            className: "graphic"
          }
        ]
      }
    },

    computed:{
      ...mapGetters({
        "isMini": "isMini",
        "currentRouteName": "currentRouteName"
      })
    },

    methods: {
      goto(link) {
        if (!!link && this.$route.name !== link) {
          RouterService.push(link);

          if (this.isMini) {
            this.$store.dispatch('toggleLeftMenu');
          }
        }
      }
    }
  }
</script>


<style scoped lang="scss">
  .sk-list{
    position: relative;
    display: flex;
    width: 100%;
    overflow: hidden;
  }

  .sk-item{
    user-select: none;
    position: relative;
    display: flex;
    width: 100%;
    overflow: hidden;
    height: 46px;
    align-items: center;
    color: #666;
    font-size: 13px;
    cursor: pointer;
    transition: all 300ms ease-in;
    border-right: 0px solid #ec4924;
    background-color: rgba(100, 100, 100, 0);

    :hover{
      background-color: rgba(100, 100, 100, 0.1);
    }
    &.active{
      color: #ec4924;
      border-right-width: 4px;
      background: rgba(236, 73, 36, 0.1);
    }

    .main{
      flex: 1;
    }
    .left{
      width: 40px;
      text-align: center;
      padding-top: 4px;
      line-height: 30px;
    }
    .right{
      padding-top: 10px;
      width: 40px;
      line-height: 30px;
      text-align: center;
    }
  }
</style>
