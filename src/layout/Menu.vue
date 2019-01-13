<template>
  <div class="menu-list-con">
    <div class="sk-list" v-for="(menu) in menuListData" :key="`list-${menu.routeName}`">
      <MenuItemComponent :menu-model="menu" @clickMenu="onClickParent"></MenuItemComponent>

      <div v-if="menu.children" class="sk-list" v-for="(childMenu) in menu.children"
           :key="`list-${childMenu.routeName}`">
        <MenuItemComponent :menu-model="childMenu" @clickMenu="onClickChild" :is-child="true" :is-parent-unfold="menu.isUnfold"></MenuItemComponent>
      </div>
    </div>

  </div>
</template>

<script>

  import {mapGetters} from 'vuex'
  import {RouterService} from "../plugin/router/index";
  import {MenuData} from "./MenuData";
  import MenuItemComponent from './componets/MenuItem';

  export default {
    components: {
      MenuItemComponent
    },

    data() {
      return {
        open: 'send',
        menuListData: new MenuData().getRouteList()
      }
    },

    computed: {
      ...mapGetters({
        "isMini": "isMini",
        "currentRouteName": "currentRouteName"
      })
    },

    methods: {
      /**
       * 点击菜单
       * @param menu {MenuModel}
       */
      onClickParent(menu) {
        if (menu.routeName) {
          this.goto(menu.routeName);
        }

        // 检查是否有嵌套菜单
        if (menu.children && menu.children.length > 0) {
          menu.toggle();
          this.$forceUpdate();
        }
      },

      onClickChild(menu) {
        this.goto(menu.routeName);
      },

      goto(routeName) {
        if (!!routeName && this.$route.name !== routeName) {
          RouterService.push(routeName);

          if (this.isMini) {
            this.$store.dispatch('toggleLeftMenu');
          }
        }
      }
    }
  }
</script>


<style scoped lang="scss">
  .sk-list {
    position: relative;
    display: block;
    width: 100%;
    overflow: hidden;
  }
</style>
