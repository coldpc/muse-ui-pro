<template>
  <div class="account-info-con">
    <div class="profile-element" style="text-align: center;">
      <div class="icon-con">
        <img alt="image" class="img-circle" src="./assets/default.png">
      </div>

      <div class="user-info">
        <div class="title">后台管理系统</div>
        <div class="user">
          <span class="desc">您好，{{userInfo.userName}}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    data() {
      return {};
    },

    computed: {
      ...mapGetters({
        "viewPort": "viewPort",
        "userInfo": "user/info",
      })
    },

    methods: {}
  }
</script>

<style scoped lang="scss">
  .account-info-con {
    padding: 50px 20px 20px 20px;
    .profile-element {
      display: table;
      text-align: center;

      .icon-con {
        display: table-cell;
        width: 70px;
        padding-left: 20px;
        padding-right: 10px;
        vertical-align: top;

        .img-circle {
          pointer-events: none;
          width: 40px;
          height: 40px;
          box-shadow: 0 2px 13px 2px rgba(236, 74, 35, 0.5), 0 1px 1px 0 rgba(236, 74, 35, 0.5), 0 1px 3px 0 rgba(236, 74, 35, 0.5);
        }

        .info {
          color: #fff;
          margin-top: 10px;
        }
      }
    }
    .user-info {
      vertical-align: top;
      text-align: left;
      display: table-cell;

      .title {
        width: 160px;
        height: 22px;
        font-size: 16px;
        color: rgba(34, 34, 34, 1);
        line-height: 22px;
      }

      .user {
        color: #828282;
        white-space: nowrap;
        cursor: default;

        .desc {
          font-size: 12px;
          vertical-align: middle;
        }
        .i-con {
          cursor: pointer;
          width: 30px;
          vertical-align: -5px;
          display: inline-block;
          line-height: 1;
          text-align: center;
        }
      }
    }
  }
</style>

