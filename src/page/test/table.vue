<template>
  <sk-layout>
    <sk-table :bind="tableDs" selectable>
      <template slot-scope="record">
        <sk-column @click="onClickCell" view-type="text" title="渠道id" name="channelCode" :sortable="false" align="center"></sk-column>
        <sk-column @click="onClickCell" view-type="date" title="日期" name="updateTime" :sortable="false" align="center"></sk-column>
      </template>
    </sk-table>
  </sk-layout>
</template>

<script>
  import DataSet from "../../lib/utils/DataSet";
  import SystemApi from "../../lib/http/SystemApi";

  export default {
    data() {
      return {
        pageSize: 20,
        tableDs: new DataSet({
          isPagination: true,
          queryUrl: SystemApi.getChannelList,
          isAutoQuery: true
        })
      };
    },

    created() {

    },

    methods: {
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
