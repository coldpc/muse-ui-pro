<template>
  <div style="height: 60px">
      <div class="fixed-bottom transition" :style="{left: viewPort.left + 'px'}">
        <mu-paper :z-depth="3">
          <div class="fixed-bottom-content">
            <slot></slot>
          </div>
        </mu-paper>
      </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  export default {
    name: "sk-fixed-bottom",
    data() {
      return {};
    },

    computed:{
      ...mapGetters({
        "viewPort": "viewPort"
      })
    },
  }
</script>


<style scope lang="scss">
  .fixed-bottom {
    left: 0;
    right: 0px;
    bottom: 0px;
    position: fixed;
    z-index: 100;
    text-align: center;
    transition: left .45s cubic-bezier(.23,1,.32,1);

    .fixed-bottom-content{
      padding: 20px 45px;
      background-color: #fff;
    }
  }
</style>
