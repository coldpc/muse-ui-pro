<template>
  <div></div>
</template>

<script>
  import DataSet from "../lib/utils/DataSet";
  import Record from "../lib/utils/Record";
  import {UtilsBase} from "../lib/utils/UtilsBase";

  export default {
    props: {
      required: {
        type: Boolean,
        default: false
      },

      validFunc: {
        type: Function
      },

      name: {
        type: String
      },

      // 此值会覆盖record的值
      value: {
      },

      // 初始值 此值会覆盖record的status为new的值
      initValue: {
        type: String | Number | Boolean
      },

      // 输入框左边的图标
      icon: {
        type: String,
      },

      // 输入框右边的图标
      actionIcon: {
        type: String,
      },

      // 标签
      label: {
        type: String,
      },

      // 标签是否浮动
      labelFloat: {
        type: Boolean,
        default: false
      },

      // 错误提醒文字，如果此参数有值，那么输入框会转为错误的状态, 显示效果将会更改
      errorText: {
        type: String,
        default: ""
      },

      // 帮助文字
      helpText: {
        type: String,
      },

      // 帮助文字
      fullWidth	: {
        type: Boolean,
        default: true
      },

      // 输入框是否不可用
      disabled: {
        type: Boolean,
        default: false
      },

      // 是否多行
      multiLine: {
        type: Boolean,
        default: false
      },
      rows: {
        type: Number
      },
      rowsMax: {
        type: Number
      },

      maxLength: {
        type: Number
      },

      bind: {
        type: DataSet,
      },
      record: {
        type: Record
      },

      underlineColor: {
        type: String,
        default: ""
      }
    },

    data() {
      return {
        innerValue: "",

        error: '',

        binds: {
          ds: null,
          record: null
        }
      };
    },

    brforeCreate() {
    },

    created() {
      if (this.bind || this.record) {
        if (this.record) {
          this.setBindRecord(this.record);
        }else if (this.bind){
          this.setBindDs(this.bind);
        }
      }else {
        this.setValue(!UtilsBase.isNull(this.value) ?  this.value : this.getInitValue(), true);
      }
    },

    mounted() {

    },

    watch: {
      bind(newValue) {
        this.setBindDs(newValue);
      },
      record(record) {
        this.setBindRecord(record);
      }
    },

    methods: {
      setBindDs(ds) {
        let old = this.binds.ds;
        if (old) {
          old.removeEventListener(DataSet.eventTypes.onIndexChange, this.setBindRecord);
        }

        if (ds) {
          ds.addEventListener(DataSet.eventTypes.onIndexChange, this.setBindRecord);

          let record = ds.getCurrentRecord();
          if (record) {
            this.setBindRecord(record);
          }
        }
      },

      /**
       * 设置绑定的recode
       * @param record
       */
      setBindRecord(record) {
        let old = this.binds.record;

        // 移除旧的
        if (old) {
          old.removeEventListener(Record.eventTypes.onUpdate, this.onRecordUpdate);
          old.removeEventListener(Record.eventTypes.onReset, this.onRecordReset);
          old.removeEventListener(Record.eventTypes.onVerify, this.onRecordVerify);
        }

        if (record) {
          record.addEventListener(Record.eventTypes.onUpdate, this.onRecordUpdate);
          record.addEventListener(Record.eventTypes.onReset, this.onRecordReset);
          record.addEventListener(Record.eventTypes.onLoad, this.onLoad);
          record.addEventListener(Record.eventTypes.onVerify, this.onRecordVerify);

          this.binds.record = record;
          this.setInitValue();
        }
      },

      /**
       * record发起校验
       * 需要校验当前字段
       */
      onRecordVerify() {
        this.verify();
      },

      /**
       * 发起校验
       */
      verify() {
        let errorMsg = "";
        let isRequired = this.required;
        let validFunc = this.validFunc;
        let value = this.getValue();
        let record = this.binds.record;


        if (typeof validFunc === "function"){
          errorMsg = validFunc(value, this.name, this) || "";
        }else if (isRequired && this.checkIsNull(value)){
          errorMsg = "此字段不可以为空";
        }

        // 将错误设置回record
        if (record){
          record.setVerify({name: this.name, errorMessage: errorMsg, isPass: !errorMsg});
        }

        // 设置error
        this.setError(errorMsg);
      },

      checkIsNull(value) {
        return UtilsBase.isNull(value);
      },

      onLoad(record) {
        this.setError();
        this.setInnerValue(record.getValue(this.name));
      },

      onRecordReset() {
        // 去掉error
        this.setError("");

        // 设置初始化值
        this.setInitValue();
      },

      // 设置初始化的值
      setInitValue() {
        let record = this.binds.record, isInit = true;

        // 首先判定value存在不，优先级最高
        if (!UtilsBase.isNull(this.value)) {
          this.setValue(this.value, isInit);

          // 如果新建的record并且initValue不为空，采用init value
        }else if(record.status === Record.statusMap.new && !UtilsBase.isNull(this.getInitValue())) {
          this.setValue(this.getInitValue(), isInit);
        }else {
          let value = record.getValue(this.name);

          // 存在值先去设置 不存在就要判断内部是否有值，否则置空
          if (!UtilsBase.isNull(value)) {
            this.setInnerValue(value);
          }else if (!UtilsBase.isNull(this.getValue())) {
            this.setInnerValue("");
          }
        }
      },

      getInitValue() {
        return this.initValue;
      },

      onRecordUpdate(value, name, record, origin) {
        if (this !== origin && name === this.name) {
          this.setValue(value);
        }
      },

      setInnerValue(value) {
        if (!UtilsBase.checkIsEqual(this.innerValue, value)) {
          this.innerValue = value;
        }
      },

      // 更新record
      setRecordValue(value) {
        let record = this.binds.record;
        if (record) {
          record.setValue(this.name, value, this);
        }
      },

      /**
       * 设置值
       * @param value
       * @param isInit 是否为初始化
       */
      setValue(value, isInit = false) {

        // 设置内部的值 如果返回false 则需要打断本次设置
        let isPassSet = this.setInnerValue(value);
        if (false === isPassSet) {
          return;
        }

        // 设置record的值
        this.setRecordValue(value);

        // 触发更新事件
        this.onChangeValue(value);

        // 非初始化更新init的值
        if (!isInit) {
          this.verify();
        }
      },

      // 获取值
      getValue() {
        return this.innerValue;
      },

      /**
       * 设置错误消息
       * @param errorText
       */
      setError(errorText = '') {
        this.error = errorText;
      },

      // 改变value的时候触发
      onChangeValue(v) {
        this.$emit("change", v);
        this.$emit("input", v);
      }
    },

    updated() {

    }
  }
</script>
