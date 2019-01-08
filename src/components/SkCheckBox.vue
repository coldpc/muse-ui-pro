<template>
  <div class="radio-item mu-input">
    <div class="prompt mu-input-label">{{label}}</div>
    <div>
      <mu-checkbox v-model="ownerValue" @change="onChange"
                   :error-text="errorText" :help-text="helpText" :disabled="disabled"
                   :label="label" :label-float="labelFloat" :full-width="fullWidth">
      </mu-checkbox>
    </div>
  </div>
</template>


<script>
  import SkCore from './SkCore';
  import {UtilsBase} from "../lib/utils/UtilsBase";

  export default {
    extends: SkCore,
    name: "sk-checkbox",
    props: {
      checkedValue: {
        default: true
      },

      uncheckedValue: {
        default: false
      }
    },

    watch: {
      innerValue() {
        this.setOwnerValue();
      }
    },

    data() {
      return {
        ownerValue: false
      };
    },

    methods: {
      getInitValue() {
        return UtilsBase.checkIsEqual(this.initValue, this.checkedValue) ? this.checkedValue : this.uncheckedValue;
      },

      setInnerValue(value) {
        if (!UtilsBase.checkIsEqual(this.innerValue, value)) {
          this.innerValue = value;
        }
        this.setOwnerValue();
      },

      setOwnerValue() {
        let value = this.getValue();
        if (UtilsBase.checkIsEqual(value, this.checkedValue)) {
          this.ownerValue = true;
        }else if(UtilsBase.checkIsEqual(value, this.uncheckedValue)) {
          this.ownerValue = false;
        }
      },

      onChange(v) {
        this.setValue(v ? this.checkedValue : this.uncheckedValue);
      }
    }
  }
</script>


<style scoped lang="scss">
  .radio-item{
    width: 100%;
    .prompt{
      line-height: 30px;
    }
  }
</style>
