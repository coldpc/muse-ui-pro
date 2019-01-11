import EventListener from "./EventListener";
import HttpClient from "../http/HttpClient";
import ArrayApi from "./ArrayApi";

const prefix = "file-item-";

//定义文件类型
export const EnFileType = {
  img: "image/gif, image/jpeg, image/png",
  video: "video/mp4,video/mpg,video/avi"
};

export const EnErrorMessage = {
  outNumber: "文件数量超出",
  incorrectFormat: "文件根式不对",
  outFileSize: function (size, bigSize) {
    size = 0.01 * Math.round(100 * size / 1024);
    return `文件大小不能超出${size}M，此文件大小为${0.01 * Math.round(100 * bigSize / 1024)}M`;
  }
};

// 序列号
let sequence = 1;

export default class UploadController extends EventListener{

  filesList = []; // 文件列表
  accept = ""; // 允许的文件格式
  type = null; // 文件类型 img|video

  fileSizeLimit = 1024 * 1024; // kb
  maxFiles = 10; // 最多文件数量

  static eventTypes = {
    onFilesChange: "onFilesChange",
    onCompleteUpload: "onCompleteUpload",
    onProgress: 'onProgress',
    onError: 'onError'
  };

  /**
   * 上传文件控制器
   * @param type 文件类型
   * @param accept 允许的文件格式
   * @param maxFiles 最多文件数量
   * @param fileSizeLimit 文件大小限制 单位kb
   */
  constructor({type, accept, maxFiles, fileSizeLimit}){
    super();

    this.maxFiles = parseInt(maxFiles) || 8;
    this.fileSizeLimit = fileSizeLimit || 8 * 1024;
    this.accept = accept || EnFileType[type];
    this.type = type;
  }

  // 批量添加多张图片
  addFiles(files){
    let isError;
    for (let i = 0, l = files.length; i < l; i++) {
      isError = this.addFile(files[i]);
      if (isError) {
        break;
      }
    }
  }

  // 添加图片
  addFile(file) {
    //文件校验
    let errorMessage = this.checkFile(file);
    let isError = !!errorMessage;

    if ( isError ){
      this.dispatch(UploadController.eventTypes.onError, errorMessage);
    }else {
      this.addClientFile(file, window.URL.createObjectURL(file));
    }
    return isError;
  }

  /**
   *
   * @param file
   * 校验文件
   * name:"fyzw_200921810852.jpg"
   * size:82377
   * type:"image/jpeg" //video/mp4
   */
  checkFile(file){
    let num = this.getFilesList().length, errorMessage;
    if (this.maxFiles !== 1 && num + 1 >= this.maxFiles){
      errorMessage = EnErrorMessage.outNumber;
    }

    // 校验格式
    if (this.accept.indexOf(file.type) === -1){
      errorMessage = EnErrorMessage.incorrectFormat;
    }

    // 校验大小 转化为kb
    let size = file.size / 1024;
    if (size >= this.fileSizeLimit){
      errorMessage = EnErrorMessage.outFileSize(this.fileSizeLimit, size);
    }
    return errorMessage;
  }


  /**************************get系列***************************/
  getFilesList() {
    return this.filesList;
  }

  getAccept() {
    return this.accept;
  }

  /**
   * 文件转化为url地址
   * @param file
   */
  fileTransformUrl(file){
    let reader = new FileReader();
    let _this = this;

    reader.onload = function () {
      file = null;
      _this.addClientFile(file, this.result);
      _this = null;
      reader = null;
    };
    reader.readAsDataURL(file);
  }

  /**
   * 添加客户端图片
   * @param file
   * @param src
   */
  addClientFile(file, src){
    // 单文件上传比较特殊 不需要删除
    if (this.maxFiles === 1){
      this.clearFiles();
    }

    let fileItem = {
      isUploading: false,
      isClient: true,
      file: file,
      src: src,
      remoteSrc: '',
      sign: prefix + (++ sequence),
      sort: (10000 + 1 + sequence),
      type: this.type
    };

    this.filesList.push(fileItem);
    this.onChange();
    this.doUpload(fileItem).catch();
  }

  /**
   * 清空文件
   */
  clearFiles(){
    this.filesList = [];
    this.onChange();
  }

  /**
   * 批量添加远程文件
   * @param urls
   */
  addRemoteFiles(urls = []) {
    urls.forEach((url) => {
      this.addRemoteFile(url);
    });
  }

  /**
   * 添加远程文件
   * @param url
   *
   */
  addRemoteFile(url) {
    this.filesList.push({
      isClient: false,
      src: url,
      type: this.type,
      sign: `id-${++UploadController.remoteFileIndex}`,
      sort: `${UploadController.remoteFileIndex}`,
      remoteSrc: url
    });
    this.onChange();
  }

  // 服务器文件地址
  static remoteFileIndex = 1;


  /**
   * 上传所有文件
   */
  uploadAll(){
    let filesList = this.getFilesList(), isComplete = true, fileItem;

    // 遍历图片上传
    for (let i = 0, l = filesList.length; i < l; i++) {
      fileItem = filesList[i];
      if (fileItem.isClient && !fileItem.isUploading) {
        isComplete = false;
        this.doUpload(fileItem).catch();
      }
    }

    if (!isComplete) {
      this.dispatch(UploadController.eventTypes.onCompleteUpload, this.getFilesList());
    }
  }

  //单个文件上传
  async doUpload(fileItem) {
    if (fileItem.isUploading) {
      return;
    }else{
      fileItem.isUploading = true;
    }

    let formData = new FormData(), res;
    formData.append("file", fileItem.file);

    try{
      res = await HttpClient.request({
        data: formData,
        onUploadProgress: (progressEvent) => {
          this.dispatch(UploadController.eventTypes.onProgress, progressEvent, fileItem);
        }
      });
      this.uploadSuccess(fileItem, res);
    }catch (e) {
      this.uploadFailed(e);
    }
  }

  /**
   * attachId:"2017061815490512854716112612"
   * attachType:"IMG"
   * bucket:"BUCKET_IMG"
   * path:"http://img.yaok.com/user/2017-06-18/be392004-2643-41c8-b6a4-5a1181e00296fyzw_2009218101719.jpg"
   * source:"USER"
   *
   **/
  uploadSuccess(fileItem, res){
    // 设置好状态
    fileItem.isUploading = false;
    fileItem.isClient = false;
    fileItem.remoteSrc = res;

    //抛出消息
    this.dispatch(UploadController.eventTypes.onProgress, 1, fileItem);

    if (this.checkIsComplete()) {
      this.dispatch(UploadController.eventTypes.onCompleteUpload, this.getFilesList());
    }
  }

  /**
   * 检测是否上传完成
   * @returns {boolean}
   */
  checkIsComplete() {
    let isComplete = true;
    let filesList = this.getFilesList(), tempFilItem;

    for (let i = 0, l = filesList.length; i < l; i++) {
      tempFilItem = filesList[i];
      if (tempFilItem.isClient) {
        isComplete = false;
        break;
      }
    }
    return isComplete;
  }

  /**
   * 处理错误异常
   * @param error {{code, message}}
   */
  uploadFailed(error){
    this.dispatch(UploadController.eventTypes.onError, error);
  }

  removeFileBySign(sign){
    let fileList = this.getFilesList();
    let index = ArrayApi.indexByFieldValue(fileList, 'sign', sign);

    if (index > -1){
      fileList.splice(index, 1);
      this.onChange();
    }
  }

  /**
   * 文件改变
   */
  onChange() {
    this.dispatch(UploadController.eventTypes.onFilesChange, this.getFilesList());
  }
};
