import Record from "./Record"
import EventListener from "./EventListener";
import HttpClient from "../http/HttpClient";
import {UtilsBase} from "./UtilsBase";

export default class DataSet extends EventListener {

  static eventTypes = {
    onStartQuery: "onStartQuery", //record ds
    onLoad: "onLoad", //record ds
    onLoading: "onLoading", //加载中
    onIndexChange: "onIndexChange", //record ds
    onUpdate: "onUpdate", // 更新字段
    onRemove: "onRemove", //record index ds
    onAdd: "onRemove", //record index ds
    onLoadSuccess: "onLoadSuccess", // 加载数据成功
    onLoadFailed: "onLoadFailed", // 加载失败
  };

  static actionType = {
    query: "query",
    add: "add",
    reset: "reset"
  };

  // 是否加载过数据 加载中 加载完成 自动发起查询 自动创建一条空数据 是否分页
  hasLoadData = false;
  isLoading = false;
  isAutoQuery = false;
  isAutoCreate = false;

  // 是否分页 是否有更多的数据
  isPagination = false;
  isMore = true;
  pageSize = 10;
  pageNum = 1;
  totalPage = 1;
  totalCount = 1;


  // 查询的服务
  parseQueryPara = null;
  queryUrl = '';
  masker = null;
  parseData = null;
  queryPara = null; // 默认查询的参数
  lastQueryPara = null; // 上一次查询的数据
  queryBind = null; // 上一次查询的数据

  records = [];

  bindParent = null;
  bindParentRecord = null;
  bindField = '';
  bindParaKey = '';

  /**
   * 构造函数
   * @param queryUrl 查询的url地址
   * @param queryBind 查询的url地址
   * @param queryPara 查询的url地址
   * @param parseData 格式化数据
   * @param parseQueryPara 查询的url参数处理
   * @param isAutoQuery 是否自动发起查询
   * @param isPagination 是否自动发起查询
   * @param isAutoCreate 自动创建数据
   * @param pageSize 每一页数据条数 默认10
   * @param dataSource 数据源头
   * @param masker 遮罩 {info: '', dom}
   * @param bindParent 绑定父级的ds
   * @param bindField 绑定的字段
   * @param bindParaKey 查询的参数
   */
  constructor({queryUrl, queryBind, queryPara, parseData, parseQueryPara,
                isAutoQuery, isPagination = false, isAutoCreate,
                pageSize = 10, dataSource, masker = null,
                bindParent = null, bindField = '', bindParaKey = ''}) {
    super();

    this.parseQueryPara = parseQueryPara;
    this.queryUrl = queryUrl;
    this.pageSize = pageSize;
    this.masker = masker;
    this.parseData = parseData;
    this.queryPara = queryPara;
    this.queryBind = queryBind;
    this.isPagination = isPagination;

    if (dataSource) {
      this.setData(dataSource);
    } else if (!!isAutoQuery) {
      this.query().catch();
    } else if (!!isAutoCreate) {
      this.add();
    }

    if (bindParent) {
      this.setBindDs(bindParent, bindField, bindParaKey);
    }
  }

  //设置绑定的父级ds
  setBindDs(ds, field, paraKey){
    let old = this.bindParent;
    if (old) {
      old.removeEventListener(DataSet.eventTypes.onIndexChange, this.onParentIndexChange);
    }
    ds.addEventListener(DataSet.eventTypes.onIndexChange, this.onParentIndexChange);

    //设置值
    this.bindParaKey = paraKey || field;
    this.bindField = field;
    this.bindParent = ds;

    // 初始化值
    if (ds.currentRecord) {
      this.setBindRecord(ds.currentRecord);
    }
  }

  setBindRecord(record) {
    let old = this.bindParentRecord;
    if (old) {
      old.removeEventListener(Record.eventTypes.onUpdate, this.onUpdateParent);
      old.removeEventListener(Record.eventTypes.onReset, this.onLoadParent);
      old.removeEventListener(Record.eventTypes.onLoad, this.onLoadParent);
    }

    // 绑定新的record
    this.bindParentRecord = record;
    record.addEventListener(Record.eventTypes.onUpdate, this.onUpdateParent);
    record.addEventListener(Record.eventTypes.onReset, this.onLoadParent);
    record.addEventListener(Record.eventTypes.onLoad, this.onLoadParent);

    // 初始化值
    this.onLoadParent();
  }

  /**
   *
   * 这是绑定的ds的事件回调
   * @param value
   * @param key
   *
   */
  onUpdateParent = (value, key) => {
    if (key === this.bindField){
      this.queryParentPara(value);
    }
  };

  onLoadParent = () => {
    let value = this.bindParentRecord.getValue(this.bindField);
    this.queryParentPara(value);
  };

  onParentIndexChange = (record) => {
    this.setBindRecord(record);
  };

  queryParentPara(value) {
    let para = this.queryPara || {};
    if (!UtilsBase.isNull(value)){
      para[this.bindParaKey] = value;
      this.query(para).catch();
    }else{
      this.setData();
    }
  }

  /**
   * 重置dataSet的状态
   */
  reset() {
    this.setData();
    this.pageNum = 1;
    this.hasLoadData = false;
    this.isLoading = false;
  }

  /**
   * 设置查询的参数 查询的时候将会默认带上
   * @param data
   *
   */
  setQueryPara(data) {
    this.queryPara = data;
  }

  /**
   * 发起查询
   * 这是一次非常重要的查询
   */
  async query(para = null) {
    if (!para) {
      this.pageNum = 1;
      para = this.getQueryPara();
    }

    //处理查询参数
    if (typeof this.parseQueryPara === "function") {
      para = this.parseQueryPara(para);
    }

    try{
      this.dispatch(DataSet.eventTypes.onLoading, this);
      let data = await HttpClient.request({
        url: this.queryUrl,
        data: para
      });
      this.lastQueryPara = para;
      this.onLoadData(data);
    }catch (e) {
      this.dispatch(DataSet.eventTypes.onLoadFailed, e);
    }

    this.isLoading = false;
  }

  /**
   *
   * @param data
   * 加载完成
   *
   * 服务端默认分页格式的数据为
   *
   * items 数据
   * pageNum 当前页
   * pageSize page尺寸
   * totalCount 总记录条数
   * totalPages 总页数
   *
   **/
  onLoadData(data) {
    if (this.isPagination && data.items) {
      this.totalCount = data.totalCount;
      this.pageNum = data.pageNum;
      this.totalPage = data.totalPage;
      this.pageSize = data.pageSize;
      this.isMore = this.pageNum < this.totalPage;

      this.setData(data.items);
    } else {
      this.setData(data);
    }
  }

  /**
   * 设置数据
   * @param data
   * @param status
   */
  setData(data, status = Record.statusMap.old) {
    let records = [];

    // 设置状态
    this.hasLoadData = true;

    // 是否格式化数据
    let parseData = this.parseData;
    if (typeof parseData === 'function') {
      data = parseData(data);
    }

    //是否为数组
    if (data instanceof Array) {
      for (let i = 0, l = data.length; i < l; i++) {
        records.push(this.createRecord(data[i], status));
      }
    } else if (data instanceof Object){
      records.push(this.createRecord(data, status));
    }

    this.setRecords(records);
  }

  /**
   * 创建一条record
   * @param data
   * @param status
   * @returns {Record}
   */
  createRecord(data, status = Record.statusMap.new) {
    let record = new Record(this, data, status);
    record.addEventListener(Record.eventTypes.onUpdate, this.onRecordUpdate);
    return record;
  }

  /**
   * 监听器 监听record的更新
   * @param value
   * @param key
   * @param record
   * @param origin 触发变更来源
   */
  onRecordUpdate = (...args) => {
    this.dispatch(DataSet.eventTypes.onUpdate, ...args);
  };

  //新增
  add(data = {}) {
    let record = this.createRecord(data, Record.statusMap.new);
    this.getRecords().push(record);
    this.setCurrentRecord(record);
    return record;
  }

  addMultiple(data) {
    let records = [];
    for (let i = 0, l = data.length; i < l; i++) {
      records.push(this.add(data[i]));
    }
    return records;
  }

  /**
   *
   * @param value
   * 可以直接传index
   * 也可以传record
   */
  remove(value) {
    let records, currentRecord, record, index;

    records = this.getRecords();
    currentRecord = this.getCurrentRecord();

    if (UtilsBase.checkIsNumber(value)) {
      index = value;
      record = records[index];
    } else {
      record = value;
      index = records.indexOf(record);
    }

    if (index >= 0) {
      records.splice(index, 1);
      this.dispatch(DataSet.eventTypes.onRemove, record, index, this);
      if (record === currentRecord) {
        this.setCurrentRecord(records.length - 1);
      }
    }
  }

  setRecords(records) {
    this.records = records;
    this.dispatch(DataSet.eventTypes.onLoad, records, this);
    this.setCurrentRecord(records[0]);
  }

  /**
   *
   * @param value
   * 直接设置record或者绑定的index
   *
   */
  setCurrentRecord(value) {
    let record;
    if (!(value instanceof Record)) {
      record = this.records[value];
    } else {
      record = value;
    }

    if (record) {
      this.currentRecord = record;
      this.dispatch(DataSet.eventTypes.onIndexChange, record, this);
    }
  }

  /*********************分页相关*********************************/
  gotoPage(pageNum) {
    if (pageNum > 0 && !UtilsBase.checkIsEqual(this.pageNum, pageNum) && this.totalPage >= pageNum) {
      let para = UtilsBase.deepCopy(this.lastQueryPara || {});
      para.pageNum = pageNum;
      this.query(para).catch();
    }
  }

  nextPage() {
    this.gotoPage(this.pageNum + 1);
  }

  prePage() {
    this.gotoPage(this.pageNum - 1);
  }

  setPageSize(pageSize) {
    if (pageSize > 0 && !UtilsBase.checkIsEqual(this.pageSize, pageSize)) {
      let para = UtilsBase.deepCopy(this.lastQueryPara || {});
      para.pageSize = pageSize;
      para.pageNum = 1;
      this.query(para).catch();
    }
  }

  sort(name, order) {
    let para = UtilsBase.deepCopy(this.lastQueryPara || {});
    para.sortField = name;
    para.sortType = order;
    this.query(para).catch();
  }

  getQueryPara() {
    let temp, para;

    // 初始化查询的参数
    para = Object.assign({}, (this.queryPara || {}));

    //如果存在queryBind 先设置值
    temp = this.queryBind;
    if (temp) {
      para = Object.assign(para, temp.getCurrentData() || {});
    }

    //queryBind
    temp = this.queryPara;
    if (temp) {
      para = Object.assign(para, temp || {});
    }

    //添加分页参数
    if (this.isPagination) {
      para.pageSize = this.pageSize;
      para.pageNum = this.pageNum;
    }

    return para;
  }

  /*****************************get*****************************/
  /**
   * 获取当前的数据
   * @returns {*}
   */
  getCurrentData() {
    let record = this.getCurrentRecord();
    return !!record ? record.getData() : null;
  }

  /**
   * 获取当前的record
   * @returns {*}
   */
  getCurrentRecord() {
    return this.currentRecord;
  }

  /**
   * 获取records
   * @returns {Array}
   */
  getRecords() {
    return this.records;
  }

  /**
   * 获取数据
   * @returns {Array}
   */
  getData() {
    let data = [], records = this.getRecords();
    for (let i = 0, l = records.length; i < l; i++) {
      data.push(records[i].getData());
    }
    return data;
  }

  /**
   * 获取选择的数据
   * @returns {Array}
   */
  getSelectedData() {
    return DataSet.getRecordsData(this.getRecords(), true);
  }

  /**
   * 获取选择的records
   * @returns {Array}
   */
  getSelectedRecords() {
    return DataSet.getRecordsData(this.getRecords(), true, true);
  }

  /*********************对ds的操作******************************/
  doAction(type) {
    let actionType = DataSet.actionType;
    switch (type) {
      case actionType.query:
        this.query().catch();
        break;

      case actionType.add:
        this.add();
        break;

      case actionType.reset:
        this.resetCurrentRecord();
        break;

      default:
        return false;
    }
    return true;
  }

  /**
   * 重置当前record
   */
  resetCurrentRecord() {
    this.getCurrentRecord().reset();
  }

  /**
   *  发起校验
   *  校验每一条record
   *  所有的都通过返回true
   * @returns {boolean}
   */
  sendVerify() {
    let records = this.records, isPass = true, result;
    for (let i = 0, l = records.length; i < l; i++) {
      result = records[i].sendVerify();
      isPass = isPass && result.isPass;
    }
    return isPass;
  }

  /**
   * 批量更新dataSet的records
   * @param data
   */
  updateAllRecords(data) {
    DataSet.updateRecords(this.getRecords(), data);
  }

  /**
   * 批量更新records
   * @param records 要更新的records
   * @param data 数据
   */
  static updateRecords(records, data) {
    for (let i = 0, l = records.length; i < l; i++) {
      records[i].update(data);
    }
  }

  /**
   * 获取records相关的内容
   * @param records
   * @param isSelected record是否为选择的状态 true表示是， false表示所有
   * @param isRecord
   * @returns {Array}
   */
  static getRecordsData(records, isSelected, isRecord = false) {
    let record, result = [];
    for (let i = 0; i < records.length; i++) {
      record = records[i];
      if (!isSelected || (isSelected && record.isSelected)) {
        result.push(isRecord ? record : record.getData());
      }
    }
    return result;
  }
}
