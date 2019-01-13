<template>
  <div class="login-part-container">
    <div v-if="isMini" class="login-mini-page scroll-y">
      <div class="login-content">
        <h1>
          <div class="title">{{title}}</div>
          <div class="desc">{{desc}}</div>
        </h1>
        <sk-form :bind="ds" :has-padding="false">
          <div class="form-item">
            <sk-text-input name="userName" label="用户名" required></sk-text-input>
          </div>
          <div class="form-item">
            <sk-text-input name="password" label="密码" type="password" required></sk-text-input>
          </div>
        </sk-form>
        <div class="btn-con">
          <sk-button color="primary" full-width large @click="onsubmit">登陆</sk-button>
        </div>
      </div>
    </div>

    <div v-else class="login-pc-page">
      <div class="main-container">
        <div class="login-line">
          <img class="line-img" src="../../assets/login-line.png" alt="">
        </div>
        <div class="left-part">
          <div class="circle1 circles">
            <div class="inner"></div>
          </div>
          <div class="circle2 circles">
            <div class="inner"></div>
          </div>
          <div class="login-icon"/>
        </div>
        <div class="right-part">
          <div class="circle3 circles">
            <div class="inner"></div>
          </div>
          <div class="user-form" @keydown.enter="onsubmit">
            <sk-form :bind="ds" :has-padding="false">
              <div class="logo-con">
                <div class="title">{{title}}</div>
                <div class="desc">{{desc}}</div>
              </div>
              <div class="form-item">
                <sk-text-input name="userName" label="用户名" required></sk-text-input>
              </div>
              <div class="form-item">
                <sk-text-input name="password" label="密码" type="password" required></sk-text-input>
              </div>
            </sk-form>
            <div class="btn-con">
              <sk-button color="primary" full-width large @click="onsubmit">登陆</sk-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DataSet from "../../lib/utils/DataSet";
  import HttpClient from "../../lib/http/HttpClient";
  import {EnRoutesConfig, RouterService} from "../../plugin/router";
  import SystemApi from "../../lib/http/SystemApi";
  import {mapGetters} from 'vuex';

  export default {
    components: {},

    data() {
      return {
        ds: new DataSet({
          isAutoCreate: true
        }),

        title: "SASS管理系统",
        desc: "MANAGEMENT SYSTEM"
      }
    },

    computed: {
      ...mapGetters({
        isMini: 'isMini'
      })
    },

    methods: {

      async onsubmit() {
        if (!this.check()) {
          return false;
        }

        let data = await HttpClient.request({
          url: SystemApi.login,
          mask: {text: "登陆中..."},
          data: this.ds.getCurrentData()
        });

        this.$store.dispatch("login", data);
        RouterService.replace(EnRoutesConfig.pageHome);
      },

      check() {
        return this.ds.sendVerify();
      }
    }
  }
</script>

<style scoped lang="scss">
  .login-mini-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 0;
    background-color: #fff;

    .login-content {
      padding: 0 30px;
      width: 100%;
      left: 0;
    }

    .btn-con {
      margin-top: 30px;
    }

    h1 {
      margin: 0;
      padding-bottom: 40px;
      padding-top: 80px;
      font-weight: normal;
      text-align: center;
      color: #222;
      font-size: 30px;
      line-height: 1;

      .desc {
        color: #828282;
        font-size: 14px;
        letter-spacing: 4px;
        margin-top: 10px;
      }
    }
  }


  .login-pc-page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("../../assets/back.png") no-repeat center fixed #fff;
    background-size: cover;

    .circles {
      position: absolute;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.5);
      text-align: center;
      z-index: 3;

      .inner {
        width: 50%;
        height: 50%;
        margin-top: 25%;
        border-radius: 50%;
        background-color: #fff;
        display: inline-block;
      }

      &.circle1 {
        left: 50px;
        top: 20px;
      }

      &.circle2 {
        left: 70px;
        bottom: 10px;
        width: 30px;
        height: 30px;
      }

      &.circle3 {
        left: 180px;
        top: 25px;
        width: 30px;
        height: 30px;
        background-color: rgba(255, 54, 45, 0.5);

        .inner {
          background-color: #ff362d;
        }
      }
    }

    .main-container {
      top: 50%;
      background-color: #fff;
      left: 50%;
      margin-top: -241px;
      margin-left: -482px;
      position: fixed;
      padding: 0;
      list-style: none;
      font-size: 14px;
      width: 964px;
      height: 482px;
      white-space: nowrap;
      box-shadow: 0 1px 6px rgba(0, 0, 0, .117647), 0 1px 4px rgba(0, 0, 0, .117647);
    }

    .login-line {
      position: absolute;
      top: -217px;
      left: -256px;
      z-index: 2;
      width: 150%;
      opacity: .7;
      pointer-events: none;

      .line-img {
        width: 100%;
      }
    }

    .left-part {
      background-color: #ff542d;

      .login-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 160px;
        height: 160px;
        background: url("../../assets/login-icon.png") no-repeat center;
        background-size: contain;
        margin-top: -80px;
        margin-left: -80px;

      }
    }

    .left-part, .right-part {
      width: 50%;
      height: 100%;
      position: relative;
      display: inline-block;
      vertical-align: top;
    }

    .right-part {
      padding: 80px 20px 50px 20px;
    }

    .top-bar {
      background-color: #333;
      padding: 20px;
      height: 80px;
      width: 100%;
      position: relative;
    }

    .top-bar img {
      vertical-align: middle;
      height: 40px;
    }

    .top-bar .img-prompt {
      vertical-align: -6px;
      padding-left: 10px;
      border-left: 1px solid #fff;
      margin-left: 10px;
      color: #ddd;
      white-space: nowrap;
    }

    .right {
      position: absolute;
      right: 20px;
      top: 20px;
    }

    .top-bar .mu-item-title {
      color: #fff;
    }

    .user-form {
      text-align: center;
      margin: auto;
      width: 340px;
    }

    .user-form .mu-text-field {
      width: 100%;
    }

    .user-form {
      .mu-raised-button {
        margin-top: 20px;
      }
    }

    .main-container {
      .logo-con {
        text-align: center;
        padding-bottom: 30px;

        .title {
          color: #222;
          font-size: 30px;
          line-height: 1;
        }

        .desc {
          color: #828282;
          font-size: 14px;
          letter-spacing: 4px;
          margin-top: 10px;
        }
      }

      .logo {
        height: 100px;
      }

      .mu-raised-button-wrapper {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -moz-osx-font-smoothing: grayscale;
        -webkit-transition-duration: 0.3s;
        transition-duration: 0.3s;
        -webkit-transition-property: all;
        transition-property: all;
      }

      .mu-raised-button.hover .mu-raised-button-wrapper {
        background-color: #fafafa;
      }

      .submit-error-info {
        text-align: right;
        color: #e00;
        margin: 0;
      }
    }
  }
</style>
