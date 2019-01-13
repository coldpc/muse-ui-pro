<!--在今日 2019年0107日 搞定了date组件-->
<!--非常开心-->

<template>
  <div class="sk-time-picker">
    <mu-date-input :action-icon="actionIcon" :container="getContainer"
                 type="time" :clock-type="clockType" v-model="innerValue" @change="onChange"
                 :error-text="errorText" :help-text="helpText" :disabled="disabled"
                 :label="label" :label-float="labelFloat" :full-width="fullWidth"></mu-date-input>

  </div>
</template>

<script>
  import SkCore from './SkCore';
  import DateApi from "../lib/utils/DateApi";
  import {UtilsBase} from "../lib/utils/UtilsBase";

  export default {
    name: "sk-time-picker",
    extends: SkCore,

    props: {

      container: {
        type: String // popover/dialog/bottomSheet
      },

      viewType: {
        type: String,
        default: "clock" //clock/list
      },

      // ampm/24hr
      clockType: {
        type: String,
        default: "24hr"
      },

      // 绑定值的格式。不指定则绑定值为 Date 对象
      valueFormat: {
        type: String,
        default: 'hh:mm'
      },

      // 值的类型
      format: {
        type: String,
        default: 'hh:mm'
      },

      actionIcon: {
        type: String,
        default: "timer"
      },

      // 是否横屏显示
      landscape: {
        type: Boolean,
        default: false
      },

      // 是否不存在时间显示部分
      noDisplay: {
        type: Boolean,
        default: false
      },

      // 是否存在显示按钮
      actions: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
      }
    },

    watch: {

    },

    computed: {
      getContainer() {
        let client = UtilsBase.getClient();
        return this.container || ((client.isAndroid || client.isIos) ? 'dialog' : 'popover')
      }
    },

    methods: {
      setInnerValue(value) {
        if (typeof value === "string" && value.length === 5) {
          value = `1970/01/01 ${value}`;
        }
        this.innerValue = DateApi.toDate(value);
      },

      onChange(value) {
        this.setValue(DateApi.format(value, this.format));
      }
    }
  }
</script>


<style lang="scss">
  .sk-time-picker{
    .mu-icon{
      zoom: 0.8;
      color: #999;
    }
  }
</style>
