<template>
  <div :class="`${focusClass} sk-select-part`">
    <mu-select :max-height="maxHeight" @change="onChange" :multiple="multiple"
               v-model="innerValue" :popover-class="!hasLoadOption ? 'sk-no-options-list' : '' "
               :error-text="errorText" :help-text="helpText" :disabled="disabled"
               :label="label" :label-float="labelFloat" :full-width="fullWidth" >
      <mu-option v-if="hasLoadOption" v-for="(record) in records" :key="record.recordId" :value="getItemValue(record)"
                 :label="getItemDisplay(record)"></mu-option>
    </mu-select>

    <div class="mask" v-if="!hasLoadOption">
      <p class="disabled-info">没有选项</p>
    </div>
    <div class="mask hint-text" v-else-if="!innerValue && innerValue !== 0">
      <p class="disabled-info">请选择</p>
    </div>
  </div>
</template>

<script type="text/javascript">
  import SkCore from "./SkCore";
  import DataSet from "../lib/utils/DataSet";
  import {UtilsBase} from "../lib/utils/UtilsBase";

  //设置组件的class
  const defaultFocusClass = "sk-select-focus";
  const noOptionFocusClass = "sk-no-option-select-focus";

  export default {
    name: "sk-select",
    extends: SkCore,
    data() {
      return {
        hasLoadOption: false,
        focusClass: noOptionFocusClass,
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
      }
    },

    created() {
      let temp;

      //设置option的ds
      temp = this.optionBind;
      if (!!temp) {
        this.setOptionBindDs(temp);
      } else {
        //设置optionBind
        temp = this.options;
        if (temp) {
          let ds = new DataSet({
            dataSource: temp
          });
          this.setOptionBindDs(ds);
        }
      }
    },

    watch: {
      optionBind(newDs, oldDs) {
        this.setOptionBindDs(newDs, oldDs);
      }
    },

    methods: {
      setOptionBindDs(ds, old) {
        if (old) {
          old.removeEventListener(DataSet.eventTypes.onLoad, this.onLoadOptionDs);
        }
        ds.addEventListener(DataSet.eventTypes.onLoad, this.onLoadOptionDs);

        let records = ds.getRecords();
        this.setOptions(records);
      },

      //加载option的时候
      onLoadOptionDs(records) {
        this.setOptions(records);
      },

      setOptions(records) {
        records = records || [];
        this.hasLoadOption = records.length > 0;
        this.records = records;

        if (!records || records.length < 1) {
          this.focusClass = noOptionFocusClass;
        } else {
          this.focusClass = defaultFocusClass;
        }

        this.setInitValue();
      },

      //获取选择每一项的值
      getItemValue(record) {
        let field = this.valueField;
        return (!field || typeof record.getData() !== 'object') ? record.getData() : record.getValue(field);
      },

      //获取展示的值
      getItemDisplay(record) {
        let field = this.displayField;
        let display = (!field || typeof record.getData() !== 'object')  ? record.getData() : record.getValue(field);
        return '' + (display || '-')
      },

      setInnerValue(value){
        let hasChange = false, temp, result;
        if (value instanceof Array) {

          // 多选比较难处理
          result = [];
          for (let i = 0, l = value.length; i < l; i++) {

            // 逐项检查是否有效值
            temp = this.getSelectedValue(value[i]);
            if (!UtilsBase.isNull(temp)) {
              result.push(temp);
            }else {
              hasChange = true;
            }
          }
        }else if(!UtilsBase.isNull(value)){
          temp = this.getSelectedValue(value);
          if (UtilsBase.isNull(temp)) {
            temp = "";
            hasChange = true;
          }
          result = temp;
        }

        if (hasChange) {
          this.setValue(result);
          return false;
        }else {
          this.innerValue = result;
        }
      },

      // 获取选项中的值
      getSelectedValue(value) {
        let records = this.records || [], temp;
        for (let i = 0, l = records.length; i < l; i++) {
          temp = this.getItemValue(records[i]);
          if (UtilsBase.checkIsEqual(value, temp)) {
            break;
          }else {
            temp = undefined;
          }
        }
        return temp;
      },

      onChange(v) {
        this.setValue(v);
      }
    }
  }
</script>


<style lang="scss" scoped>
  .sk-select-part {
    position: relative;
  }

  .sk-select-part {
    .mask {
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      z-index: 2;
      color: #ccc;

      &.hint-text{
        pointer-events: none;
      }
    }

    .disabled-info {
      color: rgba(0, 0, 0, 0.38);
      cursor: default;
      padding-top: 38px;
      margin: 0px;
      font-size: 12px;
    }
  }
</style>

<style>
  .sk-no-options-list{
    display: none;
  }
</style>
