<template>
  <mu-button :color="color"
          @click="onClick"
          :ripple="ripple"
          :fab="fab"
          :flat="flat"
          :icon="icon"
          :large="large"
          :small="small"
          :fullWidth="fullWidth"
          :disabled="disabled"
          :type="type"
          :keyboardFocused="keyboardFocused"
          :to="to"
          :href="href"
          :replace="replace">
    <slot></slot>
  </mu-button>
</template>

<script>
  import DataSet from "../lib/utils/DataSet";

  export default {
    name: 'sk-button',

    props: {

      // 	按钮的颜色
      color: {
        type: String // primary ,red, secondary
      },

      // 是否有波纹效果
      ripple: {
        type: Boolean,
        default: true
      },

      // 浮动按钮
      fab: {
        type: Boolean
      },

      // 扁平按钮
      flat: {
        type: Boolean
      },

      // 图标按钮
      icon: {
        type: Boolean
      },

      small: {
        type: Boolean
      },

      // 大型按钮
      large: {
        type: Boolean
      },

      // 圆角按钮
      round: {
        type: Boolean
      },

      fullWidth: {
        type: Boolean
      },

      disabled: {
        type: Boolean
      },

      // 等同于 button 标签的 type 属性
      type: {
        type: String
      },

      // 键盘事件获取焦点
      keyboardFocused: {
        type: Boolean,
        default: false
      },

      // 设置之后会渲染成 a 标签，默认是使用button标签
      href: {
        type: String
      },

      // 表示目标路由的链接。设置之后组件会被渲染成router-link, 当被点击后，内部会立刻把 to 的值传到 router.push()，所以这个值可以是一个字符串或者是描述目标位置的对象。	String/Object	-	-
      to: {},

      replace: {
        type: Boolean
      },

      bind: {
        type: DataSet
      },

      action: {
        type: String // query|reset|add
      }
    },


    data() {
      return {
        ds: this.bind
      };
    },

    watch: {
      bind(ds) {
        this.ds = ds;
      }
    },

    methods: {
      onClick() {
        this.$emit('click');
        if (this.action && this.ds) {
          this.ds.doAction(this.action);
        }
      }
    }
  }
</script>
