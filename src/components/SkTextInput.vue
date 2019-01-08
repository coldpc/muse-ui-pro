<template>
  <div>
    <mu-text-field v-model="innerValue"
               @textOverflow="handleInputOverflow" @focus="onFocus" @blur="onBlur" @input="onInputValue"
               :helpText="helpText" :label="label" :error-text="error"
               :type="type" :labelFloat="labelFloat" :multiLine="multiLine"
               :rows="rows" :rowsMax="rowsMax" :fullWidth="fullWidth" :disabled="disabled"
               :maxLength="maxLength" :max="max" :min="min"></mu-text-field>
  </div>
</template>


<script type="text/javascript">
  import SkCore from "./SkCore";

  export default {
    name: "sk-text-input",

    extends: SkCore,

    data() {
      return {}
    },

    props: {
      //输入框的类型，在单行输入时有效 text, password, email, url, number
      type: {
        type: String
      },

      //是否为多行输入
      multiLine: {
        type: Boolean,
        default: false
      },

      value: {
        type: String
      },

      //行数
      rows: {
        type: Number,
        default: 1
      },

      //最大行数
      rowsMax: {
        type: Number
      },

      //可输入的最大长度
      maxLength: {
        type: Number
      },

      //当type = number 时，max属性生效
      max: {
        type: Number, String
      },

      //当type = number 时，min属性生效
      min: {
        type: Number, String
      }
    },

    created() {

    },

    watch: {
    },

    methods: {
      onInputValue(v) {
        this.setValue(this.getCountValue(v));
      },

      onBlur(e) {
        let value = this.getValue();
        this.$emit('blur', e, value);
      },

      getCountValue(value) {
        if (this.type === "number") {
          value = parseFloat(value);
          value = isNaN(value) ? "" : value;

          if (this.min !== undefined && value < this.min) {
            value = this.min;
          }

          if (this.max !== undefined && value > this.max) {
            value = this.max;
          }
        }
        return value;
      },

      onFocus(e) {
        this.$emit('focus', e);
      },

      handleInputOverflow(isOverflow) {
        this.errorText = isOverflow ? "字数超出限制啦" : "";
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
