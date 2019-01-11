<template>
  <mu-container>
    <mu-dialog :width="width" :height="height" transition="slide-bottom"
               dialog-class="dialog-relative"
               :fullscreen="isFullscreen"
               :open.sync="isOpenDialog"
               :append-body="true" scrollable
               :lock-scroll="true" :title="title">
      <div class="dialog-close" @click="close">
        <mu-ripple></mu-ripple>
        <mu-icon value="close" size="18"></mu-icon>
      </div>
      <div class="main-content">
        <slot></slot>
      </div>
      <div class="actions-content" v-if="hasAction" slot="actions">
        <slot name="actions"></slot>
      </div>
    </mu-dialog>
  </mu-container>
</template>

<script>
  export default {
    name: "sk-dialog",
    data() {
      return {
        isOpenDialog: false,
        hasAction: false
      };
    },

    props: {
      show: {
        type: Boolean,
        default: false
      },

      title: {
        type: String,
        default: "窗口"
      },

      isFullscreen: {
        type: Boolean,
        default: false
      },

      width: {
        default: "500px"
      },

      height: {}
    },

    created() {
      this.isOpenDialog = this.show;
      this.hasAction = this.$slots && this.$slots['actions'];
    },

    watch: {
      show(v) {
        this.isOpenDialog = v;
      },

      isOpenDialog(v) {
        if (this.show !== v) {
          this.$emit("update:show", v);
        }
      }
    },

    methods: {
      open() {
        this.isOpenDialog = true;
      },

      close() {
        this.isOpenDialog = false;
      }
    }
  };
</script>

<style scoped lang="scss">
  .dialog-close{
    cursor: pointer;
    position: absolute;
    overflow: hidden;
    right: 0;
    top: 0;
    width: 60px;
    height: 60px;
    padding-top: 20px;
    text-align: center;
  }
  .actions-content{
    padding: 0 30px;
  }
</style>

<style>
  .dialog-relative{
    position: relative;
  }
</style>
