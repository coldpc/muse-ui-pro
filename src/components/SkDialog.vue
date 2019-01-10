<template>
  <transition name="mu-dialog-slide" @after-enter="show()" @after-leave="hide()">
    <div v-show="isShow"
         class="sk-win-container transition"
         :class="titleClass"
         @click="onClickContainer"
         :style="{left: viewPort.left + 'px', top: viewPort.top + 'px'}">

      <div class="sk-win-content" :style="{width: width, height: height, maxWidth: '100%', maxHeight: '100%'}">
        <div class="title-con">
          <div>
            <span class="title">{{title}}</span>
            <span class="small-title">{{smallTitle}}</span>
          </div>
          <div class="close-con">
            <mu-icon-button icon="close" @click="hide"/>
          </div>
        </div>

        <div class="body-con">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'sk-dialog',
    data() {
      return {
        isShow: false
      }
    },
    props: {
      title: {
        type: String
      },
      smallTitle: {},
      titleClass: {
        type: [String, Array, Object]
      },
      open: {type: Boolean, default: false},
      actionsContainerClass: {
        type: [String, Array, Object]
      },
      scrollable: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: "auto"
      },
      height: {
        type: String,
        default: "auto"
      },

      ifCanCtrl: {
        type: Boolean, default: true //是否可以控制窗口
      }
    },
    created() {
      this.isShow = this.open;
    },
    watch: {
      open: function (v) {
        this.isShow = !!v;
      }
    },
    computed: {
      ...mapGetters({
        "viewPort": "viewPort"
      })
    },
    updated() {

    },
    methods: {
      show(ifForce) {
        if (!this.ifCanCtrl && ifForce !== true) {
          return;
        }
        this.isShow = true;
        this.$emit("onShow");
      },
      hide(ifForce) {
        if (!this.ifCanCtrl && ifForce !== true) {
          return;
        }
        this.isShow = false;
        this.$emit("onHide");
      },

      onClickContainer(e) {
        if (e.target.className.indexOf("sk-win-container") > -1) {
          this.hide();
        }
      }
    }
  }
</script>


<style lang="scss" scoped>
  $easeOutFunction: cubic-bezier(0.23, 1, 0.32, 1);
  .sk-win-content {
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: #fff;
    padding: 0px 20px 20px 20px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden;
    transform: scale(1, 1) translate(-50%, -50%);
    box-shadow: 10px 10px 49px -12px #000;
  }

  .mu-dialog-slide-enter-active .sk-win-content, .mu-dialog-slide-leave-active .sk-win-content {
    transform: translate(-50%, -50%);
    transition: all .45s $easeOutFunction;
  }

  .mu-dialog-slide-enter .sk-win-content, .mu-dialog-slide-leave-active .sk-win-content {
    opacity: 0;
    transform: translate(-50%, -30%);
  }

  .sk-win-container {
    z-index: 1000;
    bottom: 0px;
    right: 0px;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 1px 1px 50px rgba(0, 0, 0, .3);
    overflow: auto;
  }

  .close-con {
    position: absolute;
    top: 4px;
    right: 4px;
  }

  .title-con {
    padding-top: 10px;
  }

  .title {
    font-size: 20px;
    line-height: 50px;
  }

  .small-title {
    font-size: 14px;
    margin-left: 10px;
  }

  .body-con {
    margin-top: 10px;
  }
</style>
