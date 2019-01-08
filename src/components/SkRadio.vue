<template>
  <div class="radio-item mu-input">
    <div class="prompt mu-input-label">{{label}}</div>
    <div class="radios-con">
      <div class="radio" :key="'radio-' + option.value" v-for="option in options">
        <mu-radio :value="option.value" v-model="innerValue" :label="option.label"></mu-radio>
      </div>
    </div>
  </div>
</template>


<script>
  /**使用帮助
   * <SkRadio name="type" label="选项目" :options="[{label: `生活`, value: 1}, {label: `工作`, value: 2}]" init-value="2"></SkRadio>
   * 绑定ds是我们最明智的选择，切记使用v-model偷懒
   *
   * */

  import SkCore from './SkCore';
  import {UtilsBase} from "../lib/utils/UtilsBase";

  export default {
    name: "sk-radio",
    extends: SkCore,
    props: {
      options: {

      }
    },

    data() {
      return {
      }
    },

    watch: {
      innerValue(v) {
        this.setValue(v);
      }
    },

    methods: {
      getInitValue() {
        let value = this.initValue, options = this.options, option;
        for (let i = 0, l = options.length; i < l; i++) {
          option = options[i];
          if (UtilsBase.checkIsEqual(option.value, this.initValue)) {
            value = option.value;
            break;
          }
        }
        return value;
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
  .radios-con{
    white-space: nowrap;
    .radio{
      display: inline-block;
      vertical-align: middle;
    }
    .radio+.radio{
      margin-left: 20px;
    }
  }
</style>
