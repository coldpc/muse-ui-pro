import Record from "./Record"
import EventListener from "./EventListener";
import HttpClient from "../http/HttpClient";
import {UtilsBase} from "./UtilsBase";

export default class DataSet extends EventListener {

  static eventTypes = {
    onStartQuery: "onStartQuery", //record ds
    onLoad: "onLoad", //record ds
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
    reset: "reset",
    delete: "delete"
  };

  // 是否加载过数据 加载中 加载完成 自动发起查询 自动创建一条空数据 是否分页
  hasLoadData = false;
  isLoading = false;
  isLoadCompleted = false;
  isAutoQuery = false;
  isAutoCreate = false;

  // 是否分页 是否有更多的数据
  isPagination = false;
  isMore = true;
  pageSize = 10;
  currentPage = 1;


  // 查询的服务
  queryUrl = '';
  masker = null;
  parseData = null;
  queryPara = null; // 默认查询的参数
  lastQueryPara = null; // 上一次查询的数据
  queryBind = null; // 上一次查询的数据

  records = [];

  /**
   * 构造函数
   * @param queryUrl 查询的url地址
   * @param isAutoQuery 是否自动发起查询
   * @param parseData 格式化数据
   * @param isAutoCreate 自动创建数据
   * @param pageSize 每一页数据条数 默认10
   * @param dataSource 数据源头
   * @param masker 遮罩 {info: '', dom}
   */
  constructor({queryUrl, isAutoQuery, queryBind, queryPara, parseData, isPagination = false, isAutoCreate, pageSize = 10, dataSource, masker = null}) {
    super();

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
  }

  /**
   * 重置dataSet的状态
   */
  reset() {
    this.setData();
    this.currentPage = 1;
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
      this.currentPage = 1;
      para = this.getQueryPara();
    }

    try{
      let data = await HttpClient.request({
        url: this.queryUrl,
        data: para
      });
      this.onLoadData(data);
    }catch (e) {
      this.dispatch(DataSet.eventTypes.onLoadFailed, e);
    }

    this.isLoading = false;
  }

  nextPage() {
    this.gotoPage(++this.currentPage);
  }

  prePage() {
    this.gotoPage(--this.currentPage);
  }

  gotoPage() {
    let queryPara = UtilsBase.deepCopy(this.lastQueryPara || {});
    queryPara.currentPage = this.currentPage;
    queryPara.pageSize = this.pageSize;
    this.query(queryPara);
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
      this.currentPage = data.pageNum;
      this.totalPage = data.totalPage;
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
  onRecordUpdate = (value, key, record, origin) => {
    this.dispatch(DataSet.eventTypes.onUpdate, ...arguments);
  };

  //新增
  add(data = {}) {
    let record = this.createRecord(data, Record.statusMap.new);
    this.records.push(record);
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

    records = this.records;
    currentRecord = this.currentRecord;

    if (!(value instanceof Record)) {
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
  setCurrentPage(page) {
    if (this.currentPage != page) {
      this.currentPage = page;
      let para = this.lastQueryPara;
      this.query(this.setPaginationPara(para), true);
    }
  }

  setPageSize(size) {
    this.pageSize = size;
    let para = this.lastQueryPara;
    this.query(this.setPaginationPara(para), true);
  }

  nextPage() {
    let page = this.currentPage;
    page += 1;
    this.setCurrentPage(page);
  }

  prePage() {
    let page = this.currentPage;
    page -= 1;
    if (page > 0) {
      this.setCurrentPage();
    }
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

    //处理查询参数
    if (typeof this.parseQueryPara == "function") {
      para = this.parseQueryPara(para);
    }

    //添加分页参数
    para = this.setPaginationPara(para);
    return para;
  }

  setPaginationPara(para) {
    if (this.pagination) {
      if (!para) {
        para = {};
      }
      para.pageSize = this.pageSize;
      para.pageNum = this.currentPage;
    }
    return para;
  }

  /*****************************get*****************************/
  getCurrentValue(key) {
    let record = this.getCurrentRecord();
    if (record) {
      return record.getValue(key);
    }
  }

  //获取
  getCurrentData() {
    let record = this.currentRecord;
    return !!record ? record.getData() : null;
  }

  getCurrentRecord() {
    return this.currentRecord;
  }

  getAllData() {
    let data = [], records = this.records;
    for (var i = 0, l = records.length; i < l; i++) {
      data.push(records[i].getData());
    }
    return data;
  }

  //获取查询参数


  /*********************对ds的操作******************************/
  doAction(type) {
    let actions = this.actionType;
    switch (type) {
      case actions.query:
        this.query();
        break;

      case actions.submit:
        this.submit();
        break;

      case actions.delete:
        this.delete();
        break;

      case actions.add:
        this.add();
        break;

      case actions.reset:
        this.resetCurrentRecord();
        break;

      default:
        return false;
    }

    return true;
  }

  resetCurrentRecord() {
    this.getCurrentRecord().reset();
  }

  submit() {
    let service = this.submitService;
    let data = this.getCurrentData();
    service.execute({
      data: data,
      mask: {},
      success: function () {

      }.bind(this)
    })
  }

  /**
   *
   * @param record
   * 一行记录的record
   *
   */
  deleteRecord(record) {
    let deleteService = this.deleteService;
    if (deleteService) {
      deleteService.execute({
        data: record.getData(),
        success: function () {
          this.remove(record);
          record = null;
        }.bind(this)
      });
    } else {
      this.remove(record);
      record = null;
    }
  }

  //如果存在deleteService将会直接调用
  delete(outerRecords) {
    let records = outerRecords || this.getSelectedRecords();
    for (let i = 0; i < records.length; i++) {
      this.deleteRecord(records[i]);
    }
    return records;
  }

  //获取选中的records
  getSelectedRecords() {
    let records = this.records, record, result = [];
    for (let i = 0; i < records.length; i++) {
      record = records[i];
      if (record.selected) {
        result.push(record);
      }
    }
    return result;
  }

  getSelectedData() {
    return this.getRecordsData(this.records, true);
  }

  getRecordsData(records, ifSelected) {
    let record, result = [];
    for (let i = 0; i < records.length; i++) {
      record = records[i];
      if (!ifSelected || (ifSelected && record.selected)) {
        result.push(record.getData());
      }
    }
    return result;
  }

  getRecords() {
    return this.records;
  }

  sendVerify() {
    let records = this.records, isPass = true, result;
    for (let i = 0, l = records.length; i < l; i++) {
      result = records[i].sendVerify();
      isPass = isPass && result.isPass;
    }
    return isPass;
  }

  updateRecordsData(records, data) {
    for (let i = 0, l = records.length; i < l; i++) {
      records[i].update(data);
    }
  }
}
