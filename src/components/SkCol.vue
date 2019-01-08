<template>
  <mu-col gutter tag="div"
          :span="12" :sm="sm||span" :md="md||span" :lg="lg||span" :xl="xl||span">
    <slot></slot>
  </mu-col>
</template>

<script>
  export default {
    name: 'sk-col',

    props: {
      fill: {
        type: Boolean,
        default: false // 此 flex 元素是否填充满剩余空间， 设置为 true, 则 flex: 1 1 auto
      },

      // 栅格占据的格数
      span: {
        type: Number|String,
        default: 12
      },

      // ≥576px 响应式栅格数
      sm: {
        type: Number
      },

      // ≥768px 响应式栅格数
      md: {
        type: Number
      },

      // ≥992px 响应式栅格数
      lg: {
        type: Number
      },

      // ≥1200px 响应式栅格数
      xl: {
        type: Number
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
