<template>
  <div :class="`sk-item${menuModel.checkIsActive(currentRouteName) ?' active' : ''}${isChild? ' child-menu' : ''}${isChild && !isParentUnfold? ' hidden' : ''}`" @click.stop="onclick">
    <mu-ripple></mu-ripple>
    <div class="left" v-if="menuModel.icon">
      <mu-icon size="16" :value="menuModel.icon"></mu-icon>
    </div>
    <div class="main">{{menuModel.title}}</div>
    <div v-if="menuModel.children" class="right" :class="{rotate: menuModel.isUnfold}">
      <mu-icon size="18" value="keyboard_arrow_down"></mu-icon>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {MenuModel} from "./MenuModel";

  export default {
    name: 'menu-item',

    data() {
      console.log(this.menuModel);
      return {
        isRotate: this.isUnfold
      }
    },

    props: {
      menuModel: {type: MenuModel},
      isParentUnfold: {type: Boolean},
      isChild: {default: false, type: Boolean}
    },

    computed:{
      ...mapGetters({
        "isMini": "isMini",
        "currentRouteName": "currentRouteName"
      })
    },

    methods: {
      onclick() {
        this.$emit('clickMenu', this.menuModel);
      }
    }
  };
</script>

<style lang="scss">
  .sk-item{
    user-select: none;
    position: relative;
    display: flex;
    width: 100%;
    overflow: hidden;
    height: 46px;
    align-items: center;
    color: #ccc;
    font-size: 13px;
    cursor: pointer;
    transition: all 100ms ease-in;
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

    &.child-menu{
      padding-left: 40px;
    }

    &.hidden{
      height: 0;
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
      transition: all 200ms ease-in;

      &.rotate{
        transform: rotateZ(180deg);
      }
    }
  }
</style>
