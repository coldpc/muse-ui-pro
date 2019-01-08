<template>
    <router-view />
</template>

<script>
  import { mapGetters } from 'vuex'


  export default {
    data() {
      return {
      };
    },

    computed:{
      ...mapGetters({
        "userData": "user/data",
        "isLogin": "isLogin"
      })
    },

    methods: {

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
</style>
