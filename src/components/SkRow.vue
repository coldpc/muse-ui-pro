<template>
  <mu-row gutter tag="div" wrap="wrap"
          :justify-content="justifyContent" :align-items="alignItems" :align-content="alignContent">
    <slot></slot>
  </mu-row>
</template>

<script>
  export default {
    name: 'sk-row',

    props: {
      fill: {
        type: Boolean,
        default: false // 此 flex 元素是否填充满剩余空间， 设置为 true, 则 flex: 1 1 auto
      },

      // 定义了主轴的 flex 元素对齐方式	String	start/center/end/between/around
      justifyContent: {
        type: String,
        default: "start"
      },

      // 定义了侧轴方向上将当前行上的 flex 元素对齐方式	String	start/center/end/baseline/stretch
      alignItems: {
        type: String,
        default: "start"
      },

      // 定义了当作为一个 flex box 容器的属性时，
      // 浏览器如何在容器的侧轴围绕弹性盒子项目分配空间。
      // 	String	start/center/end/between/around/stretch
      alignContent: {
        type: String,
        default: "start"
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
