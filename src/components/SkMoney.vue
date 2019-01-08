<template>
  <mu-text-field @focus="onFocus" @blur="onBlur" @input="onInput"
                 v-model="ownerValue"
                 :helpText="helpText" :label="label" :error-text="error"
                 type="text" :labelFloat="labelFloat" :multiLine="multiLine" :fullWidth="fullWidth" :disabled="disabled"></mu-text-field>
</template>

<script type="text/javascript">

  import SkCore from './SkCore';
  import MoneyApi from "../lib/utils/MoneyApi";
  import {UtilsBase} from "../lib/utils/UtilsBase";

  export default {
    name: "sk-money",

    extends: SkCore,

    data() {
      return {
        isFocus: false,
        ownerValue: ""
      }
    },

    methods: {
      onBlur() {
        this.isFocus = false;
        this.setOwnerValue();
      },

      onInput(v) {
        let value = this.ctrlValue(v);
        this.ownerValue = value;
        this.setValue(parseFloat(value) || "");
      },

      onFocus() {
        this.isFocus = true;
        this.ownerValue = this.getValue();
        this.$emit('focus');
      },

      setInnerValue(value) {
        if (!UtilsBase.checkIsEqual(this.innerValue, value)) {
          this.innerValue = value;
        }

        if (!this.isFocus) {
          this.setOwnerValue();
        }
      },

      setOwnerValue() {
        this.ownerValue = MoneyApi.format(this.getValue(), "");
      },

      ctrlValue(value) {
        let last = value.indexOf("."); //查找小数点

        if (last !== -1) {
          let temp = value.substr(last + 1, 2);
          temp = temp.replace(/[^0-9]/ig, "");

          value = value.substring(0, last);
          last = "." + temp;
        } else {
          last = "";
        }

        value = parseFloat(value);
        if (value !== 0) {
          value = value || "";
        }

        value = value + last;
        return value;
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
