<template>
  <div class="sk-tag-con">
    <mu-select :max-height="maxHeight" @change="onChange" chips multiple tags
               v-model="innerValue"
               :error-text="errorText" :help-text="helpText" :disabled="disabled"
               :label="label" :label-float="labelFloat" :full-width="fullWidth" >
    </mu-select>
  </div>
</template>

<script type="text/javascript">
  import SkCore from "./SkCore";
  import DataSet from "../lib/utils/DataSet";

  export default {
    name: "sk-tag",
    extends: SkCore,
    data() {
      return {
        hasLoadOption: false,
        records: []
      }
    },

    props: {

      // 是否多选
      multiple: {
        type: Boolean,
        default: false
      },

      separator: {
        type: String,
        default: ","
      },

      // 是否可搜索
      filterable: {
        type: Boolean,
        default: false
      },

      // 已选项是否用 mu-chip 组件显示
      chips: {
        type: Boolean,
        default: false
      },

      maxHeight: {
        type: Number,
        default: 400
      },

      optionBind: {
        type: DataSet
      },

      //下拉数据
      options: {
        type: Array
      },

      displayField: {
        type: String,
        default: "label"
      },

      valueField: {
        type: String,
        default: "value"
      },

      maxNum: {
        type: Number,
        default: 8
      },

      // 每个tag的字符串的长度
      textLength: {

      }
    },

    created() {

    },

    watch: {

    },

    methods: {
      onChange(v) {
        this.setValue(v);
      }
    }
  }
</script>


<style lang="scss">
  .sk-tag-con{
    .mu-select-content .mu-chip {
      margin: -4px 4px 0 0;
    }
  }
</style>
