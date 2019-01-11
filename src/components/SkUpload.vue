<template>
  <div class="attachment-container">
    <div class="prompt-con">
      <div class="prompt mu-input-label">{{label}}</div>
    </div>
    <div class="files-part">
      <sk-row>
        <!--图片列表-->
        <div class="item-col" v-for="fileItem in filesList" :key="fileItem.sign">
          <div class="att-item" :class="isImgFile(fileItem) ? 'video-item' : 'img-item'" :style="{width: itemWidth, height: itemWidth}">

            <!--删除按钮-->
            <div v-if="!disabled" class="img-close-con" @click="removeFile(fileItem)">
              <div class="i-con">
                <mu-icon value="close"></mu-icon>
              </div>
            </div>

            <!--图片-->
            <div v-if="isImgFile(fileItem)" class="content img-con" :style="{backgroundImage: `url(${getSrc(fileItem)})`}">
              <img class="file-img" :src="getSrc(fileItem)" alt="">
            </div>

            <!--视频-->
            <div v-else class="content video-con">
                <video style="width: 100%;height: 100%;" :src="getSrc(fileItem)" controls="controls">
                    您的浏览器不支持 video 标签。
                </video>
            </div>
          </div>
        </div>

        <!--上传按钮-->
        <div class="item-col">
          <div class="att-input att-item" v-if="!disabled && filesList.length < maxFiles" v-bind:style="{width: itemWidth, height: itemWidth}">
            <label class="input-btn" :for="pickerId">
              <div class="input-icon">
                <mu-icon color="#aaa" :size="parseInt(itemWidth) / 2" value="add"></mu-icon>
              </div>
            </label>
            <input @change="onChangeFile"
                   style="position:absolute;clip:rect(0 0 0 0);"
                   :id="pickerId"
                   :multiple="maxFiles > 1"
                   type="file" :accept="uploadController.getAccept()" class="upload-img-input">
          </div>
        </div>

      </sk-row>
    </div>
    <div class="error-msg-con" v-show="errorText">{{errorText}}</div>
  </div>
</template>

<script type="text/javascript">
  import SkCore from "./SkCore"
  import UploadController from "../lib/utils/UploadController";
  import {UtilsBase} from "../lib/utils/UtilsBase";

  const promise = {
    resolve: null,
    reject: null
  };

  let pickerId = 1;

  export default {
    name: "sk-upload",

    extends: SkCore,

    data() {
      return {
        pickerId: `input-file-id-${++pickerId}`,
        uploadController: new UploadController({
          type: this.type,
          maxFiles: this.maxFiles,
          fileSizeLimit: this.fileSizeLimit * 1024,
          accept: this.accept
        }),

        // 各个文件的上传进度
        progressList: {},

        filesList: []
      };
    },

    props: {
      maxFiles: {type: Number, default: 1},
      fileSizeLimit: {type: Number, default: 8}, //文件大小 单位M
      itemWidth: {type: String, default: '120px'},
      type: {type: String, default: 'img'},
      accept: {type: String},
      remark: {type: String}
    },

    //创建前
    beforeCreate() {},

    //创建后
    created() {
      let controller = this.uploadController;
      controller.addEventListener(UploadController.eventTypes.onFilesChange, this.onControllerFilesChange);
      controller.addEventListener(UploadController.eventTypes.onCompleteUpload, this.onCompleteUpload);
      controller.addEventListener(UploadController.eventTypes.onError, this.onError);
    },

    methods: {
      getSrc(fileItem) {
        return fileItem.src;
      },

      isImgFile(fileItem) {
        return fileItem.type !== 'video';
      },

      removeFile(fileItem) {
        if (fileItem) {
          this.uploadController.removeFileBySign(fileItem.sign);
        }
        this.verify();
      },

      save() {
        let pro = new Promise((resolve, reject) => {
          promise.reject = reject;
          promise.resolve = resolve;
        });
        this.controller.uploadAll();
        return pro;
      },

      setInnerValue(value) {
        if (!UtilsBase.checkIsEqual(this.innerValue, value)) {
          this.innerValue = value;
        }
        this.resetUploadController(value);
      },

      resetUploadController(value) {
        let files = typeof value === 'string' ? [value] : value;
        this.uploadController.clearFiles();
        this.uploadController.addRemoteFiles(files);
      },

      setViewFiles(filesList) {
        this.filesList = filesList;
      },

      /***************事件*****************/
      onChangeFile(e) {
        let input = e.target;
        this.uploadController.addFiles(input.files);
        input.value = null;
      },

      // 改变视图
      onControllerFilesChange(filesList) {
        this.setViewFiles(filesList);
      },

      // 完成上传
      onCompleteUpload(filesList) {
        this.setValue(this.getFilesValue(filesList));
        this.doPromise();
      },

      /**
       * 获取文件的值集
       **/
      getFilesValue(filesList = []) {
        let result = filesList.map(file => file.remoteSrc);
        if (this.maxFiles < 2) {
          return result[0];
        }else {
          return result;
        }
      },

      onError(error) {
        this.doPromise(error);
        this.setError(error.message);
      },

      doPromise(error) {
        if (error) {
          if (promise.reject) {
            promise.reject(error);
          }
        }else if(promise.resolve) {
          resolve(this.getValue());
        }
        promise.reject = null;
        promise.resolve = null;
      },

      /**
       * 重新定义父组件的校验空值的问题
       * @param value
       * @returns {boolean}
       */
      checkIsNull(value) {
        return !value || value.length === 0;
      }
    }
  }
</script>


<style lang="scss" scoped>
  .error-msg-con {
    color: #f44336;
    font-size: 12px;
    margin-top: 2px;
  }

  .file-img {
    cursor: pointer;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }

  .att-item {
    text-align: center;
    position: relative;
    width: 100%;
    height: 100%;
    padding: 6px;
    border: 1px dashed #ccc;
    margin-left: 8px;
    margin-bottom: 8px;

    .img-con {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

  }

  .att-item.att-input {
    border: 1px dashed #ccc;
  }

  .att-input .input-btn {
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    text-align: center;
    cursor: pointer;
  }

  .att-input .input-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .img-close-con {
    position: absolute;
    top: 0px;
    right: 0px;
    color: #666;
    z-index: 2;
  }

  .att-item:hover .img-close-con {
    color: #000;
  }

  .row + .row {
    margin-top: 10px;
  }

  .attachment-container {
    margin-top: 0px;
    padding-bottom: 16px;
  }

  .prompt-con {
    padding-bottom: 6px;
    font-size: 16px;
    color: rgba(0,0,0,.54);
  }

  .pro-remark {
    margin-left: 10px;
    color: #aaa;
  }

  .i-con {
    transform: scale(0.6, 0.6);
    display: inline-block;
    margin-right: -6px;
    margin-top: -6px;
  }
</style>
