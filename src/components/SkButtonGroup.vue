<template>
  <div class="sk-button-group" bts-group-1987 :style="{textAlign: align}">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'sk-button-group',

    props: {
      align: {
        type: String,
        default: "left"
      }
    },


    data() {
      return {

      };
    },

    methods: {

    }
  }
</script>


<style lang="scss">
  .sk-button-group[bts-group-1987]{
    white-space: nowrap;
    .mu-button + .mu-button{
      margin-left: 15px;
    }
  }
</style>
