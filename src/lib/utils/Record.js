//id前缀
import EventListener from "./EventListener";
import {UtilsBase} from "./UtilsBase";

const RECORD_ID_PREFIX = "record";
let _RECORD_ID = parseInt(Math.random() * 1000000 + '', 10);

export default class Record extends EventListener {

  // 获取record id
  static getRecordId() {
    _RECORD_ID++;
    return RECORD_ID_PREFIX + _RECORD_ID
  }

  static statusMap = {
    new: "new",
    old: "old",
    dirty: "dirty"
  };

  // 事件类型
  static eventTypes = {
    onUpdate: "onUpdate",
    onLoad: "onLoad",
    onReset: "onReset",
    onVerify: "onVerify" //校验
  };

  // 数据状态
  status;

  // 是否选择
  isSelected = false;

  // 校验结果
  verify = {
    isPass: true
  };

  constructor(dataSet, data, status) {
    super();

    this.status = status;
    this.recordId = Record.getRecordId();
    this.isSelected = false;
    this.setData(data);
  }

  //发起校验
  sendVerify() {
    this.verify = {
      isPass: true
    };
    this.dispatch(Record.eventTypes.onVerify, this);
    return this.verify;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
    this.dispatch(Record.eventTypes.onLoad, this);
  }

  reset() {
    this.setData({});
    this.dispatch(Record.eventTypes.onReset, this);
  }

  // 设置record的校验结果
  setVerify({name, isPass, errorMessage}) {
    let result = this.verify;

    result[name] = {
      isPass,
      name,
      errorMessage
    };

    result.isPass = result.isPass && isPass;
  }

  // 获取校验结果
  getVerify() {
    return this.verify;
  }

  // 设置值
  setValue(key, value, origin) {
    let oldValue = this.getValue(key);

    if (!UtilsBase.checkIsEqual(oldValue, value)) {

      // 旧的数据编辑会变成dirty
      if (this.status === Record.statusMap.old) {
        this.status = Record.statusMap.dirty;
      }

      //设置value
      this.data[key] = value;
      this.dispatch(Record.eventTypes.onUpdate, value, key, this, origin);
    }
  }

  getValue(key) {
    let data = this.getData();
    if (key && typeof data === "object") {
      return data[key];
    }
  }

}
