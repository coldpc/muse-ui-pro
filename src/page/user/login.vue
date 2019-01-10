<template>
  <div class="login-part-container">
    <div class="login-page-part">
      <div class="login-content">
        <h1>
          <div>后台管理系统</div>
          <div class="desc">MANAGER SYSTEM</div>
        </h1>
        <skForm :bind="ds">
          <div class="form-item">
            <SkTextInput name="userName" label="用户名" required></SkTextInput>
          </div>
          <div class="form-item">
            <SkTextInput name="password" label="密码" type="password" required></SkTextInput>
          </div>
        </skForm>
        <div class="btn-con">
          <SkButton color="primary" full-width large @click="onsubmit">登陆</SkButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import skForm from '../../components/SkForm';
  import SkTextInput from '../../components/SkTextInput';
  import SkButton from '../../components/SkButton';
  import DataSet from "../../lib/utils/DataSet";
  import HttpClient from "../../lib/http/HttpClient";
  import {EnRoutesConfig, RouterService} from "../../plugin/router";
  import SystemApi from "../../lib/http/SystemApi";

  export default {
    components: {
      skForm,
      SkTextInput,
      SkButton
    },

    data() {
      return {
        ds: new DataSet({
          isAutoCreate: true
        })
      }
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
  .login-part-container{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("./../../assets/banner.jpg");
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
  }
  .login-page-part{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -150px;
    margin-top: -200px;
  }
  .login-content{
    width: 300px;
    background-color: rgba(255, 255, 255, 1);
    padding: 20px 30px 50px 30px;
  }
  .btn-con{
    margin-top: 30px;
  }
  h1{
    margin: 0;
    padding-bottom: 20px;
    font-weight: normal;

    .desc{
      font-size: 12px;
      color: #888;
    }
  }
</style>
