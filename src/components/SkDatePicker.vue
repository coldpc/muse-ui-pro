<!--在今日 2019年0107日 搞定了date组件-->
<!--非常开心-->

<template>
  <div class="sk-date-picker">
    <mu-date-input v-model="dateValue" :container="getContainer" :actions="actions" :action-click="onClickActionIcon"
                   :action-icon="actionIcon" @change="onChange" :format="displayFormat" :first-day-of-week="firstDayOfWeek"
                   :min-date="getMinDate" :max-date="getMaxDate" :shouldDisableDate="shouldDisableDate"
                   type="date"
                   :error-text="error" :help-text="helpText" :disabled="disabled"
                   :label="label" :label-float="labelFloat" :full-width="fullWidth"></mu-date-input>
  </div>
</template>

<script>
  import SkCore from './SkCore';
  import DateApi from "../lib/utils/DateApi";
  import {UtilsBase} from "../lib/utils/UtilsBase";

  export default {
    name: "sk-date-picker",
    extends: SkCore,

    props: {

      container: {
        type: String // popover/dialog/bottomSheet
      },

      viewType: {
        type: String,
        default: "clock" //clock/list
      },

      // 输入框展示的类型
      displayFormat: {
        type: String,
        default: "YYYY-MM-DD"
      },

      // 值的类型
      valueFormat: {
        type: String, //timestamp yyyy-MM-dd
        default: 'yyyy-MM-dd'
      },

      actionIcon: {
        type: String,
        default: "date_range"
      },

      firstDayOfWeek: {
        type: Number,
        default: 1
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
      },

      maxDate: {
        type: Date
      },
      minDate: {
        type: Date
      },
      bindMax: {
        type: String
      },
      bindMin: {
        type: String
      },

      // 判断日期是否不可用的函数
      shouldDisableDate: {
        type: Function
      }
    },

    data() {
      return {
        dateValue: null,
        innerMaxDate: null,
        innerMinDate: null
      }
    },

    watch: {

    },

    computed: {
      getContainer() {
        let client = UtilsBase.getClient();
        return this.container || ((client.isAndroid || client.isIos) ? 'dialog' : 'popover')
      },

      getMaxDate(){
        let maxDate = this.innerMaxDate || this.maxDate;
        maxDate = DateApi.toDate(maxDate);
        return maxDate;
      },

      getMinDate() {
        let minDate = this.innerMinDate || this.minDate;
        minDate = DateApi.toDate(minDate);
        return minDate;
      }
    },

    methods: {
      onRecordUpdate(value, name, record, origin) {
        if (name === this.bindMax) {
          this.setMaxDate(value);
        }

        if (name === this.bindMin) {
          this.setMinDate(value);
        }

        if (this !== origin && name === this.name) {
          this.setValue(value);
        }
      },

      onLoad(record) {
        this.setError();
        this.setInnerValue(record.getValue(this.name));
        this.setMaxDate(record.getValue(this.bindMax));
        this.setMinDate(record.getValue(this.bindMin));
      },

      setMaxDate(value){
          this.innerMaxDate = value;
          this.recheckValue();
      },

      setMinDate(value){
        this.innerMinDate = value;
        this.recheckValue();
      },

      recheckValue(){
        let date = this.dateValue;
        let temp = DateApi.toDate(this.innerMinDate);

        if (temp && temp - date > 0) {
          this.setValue("");
        }else {
          temp = DateApi.toDate(this.innerMaxDate);
          if (temp && temp - date < 0) {
            this.setValue("");
          }
        }
      },

      setDateValue(v) {
        this.dateValue = DateApi.toDate(v);
      },

      setInnerValue(v) {
        this.setDateValue(v);
      },

      onChange(v) {
        let result = this.getValueByType(v);
        this.setValue(result);
      },

      /**
       * 设置值
       * @param value
       * @param isInit 是否为初始化
       */
      setValue(value, isInit = false) {
        value = this.getValueByType(DateApi.toDate(value));

        // 设置内部的值
        this.setInnerValue(value);

        // 设置record的值
        this.setRecordValue(value);

        // 触发更新事件
        this.onChangeValue(value);

        // 非初始化更新init的值
        if (!isInit) {
          this.verify();
        }else {
          this.bindLimitDate();
        }
      },

      bindLimitDate() {
        let record = this.binds.record, name;
        if (this.binds.record) {

          name = this.bindMin;
          if (name) {
            this.setMinDate(record.getValue(name));
          }

          name = this.bindMax;
          if (name) {
            this.setMaxDate(record.getValue(name));
          }
        }
      },

      getValueByType(date) {
        let valueFormat = this.valueFormat;

        if (!date) {
          return '';
        }

        if (valueFormat === "timestamp") {
          return date.getTime();
        }else{
          return DateApi.format(date, valueFormat)
        }
      },

      getValue() {
        return this.getValueByType(this.dateValue);
      },

      onClickActionIcon() {
        let input = this.$el.querySelector("input");
        if (input) {
          input.click();
        }
      }
    }
  }
</script>


<style lang="scss">
  .sk-date-picker{
    .mu-icon{
      zoom: 0.8;
      color: #999;
    }
  }
</style>
