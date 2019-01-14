<template>
  <sk-layout>
    <sk-form :bind="queryDs">
      <sk-row>
        <sk-col :span="6">
          <sk-date-picker label="开始日期" name="minDate" init-value="2018-09-02" bind-max="maxDate"></sk-date-picker>
        </sk-col>
        <sk-col :span="6">
          <sk-date-picker label="结束日期" name="maxDate" init-value="2018-09-02" bind-min="minDate"></sk-date-picker>
        </sk-col>
        <sk-col :span="6">
          <sk-select
            display-field="channelName" value-field="channelCode"
            name="channelCode" label="渠道编码"
            :option-bind="channelDs"></sk-select>
        </sk-col>

        <sk-col :span="6">
          <sk-select
            display-field="productParentName" value-field="id"
            name="parentId" label="父类"
            :option-bind="parentDs"></sk-select>
        </sk-col>

        <sk-col :span="6">
          <sk-select
            display-field="productChildName" value-field="id" name="childId" label="子类"
            :option-bind="childDs"></sk-select>
        </sk-col>

        <sk-col :span="6">
          <sk-button-group align="right">
            <sk-button action="reset">重置</sk-button>
            <sk-button action="query" :bind="tableDs" color="primary">查询</sk-button>
          </sk-button-group>
        </sk-col>
      </sk-row>
    </sk-form>

    <sk-table :bind="tableDs" :selectable="false">
      <template slot-scope="record">
        <sk-column @click="onClickCell" title="平台" name="platformName" :sortable="false" align="center"></sk-column>
        <sk-column @click="onClickCell" title="类别" name="productChildName" :sortable="false" align="center"></sk-column>
      </template>
    </sk-table>

  </sk-layout>
</template>

<script>
  import DataSet from "../lib/utils/DataSet";
  import SystemApi from "../lib/http/SystemApi";

  export default {
    data() {
      window.test = this;

      const queryDs = new DataSet({
        isAutoCreate: true
      });

      return {
        isOpenDialog: false,
        value1: null,

        channelDs: new DataSet({
          isPagination: true,
          isAutoQuery: true,
          pageSize: 1000,
          queryUrl: SystemApi.getChannelList
        }),

        queryDs,

        tableDs: new DataSet({
          isPagination: true,
          queryUrl: SystemApi.getDataMonitorList,
          isAutoQuery: true,
          queryBind: queryDs
        }),

        parentDs: new DataSet({
          isAutoQuery: true,
          queryUrl: SystemApi.getProductParent
        }),

        childDs: new DataSet({
          bindParent: queryDs,
          bindField: 'parentId',
          queryUrl: SystemApi.getProductChildByParentId
        })
      };
    },

    created() {

    },

    methods: {
      query() {
        this.tableDs.query().catch();
      },

      onConfirm() {
        this.isOpenDialog = false;
      },

      submit() {
        this.ds.sendVerify();
      },

      reset() {
        this.ds.resetCurrentRecord();
      },

      clear() {
        this.ds.getCurrentRecord().setData({});
      },

      onClickCell(e, value, index, record) {
        console.log(arguments);
      }
    }
  }
</script>


<style scoped lang="scss">

</style>
