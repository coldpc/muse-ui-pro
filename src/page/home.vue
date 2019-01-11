<template>
  <sk-layout>
    <sk-form :bind="ds">
      <sk-row>
        <sk-col :span="12">
          <sk-upload name="tags" label="附件" :max-files="10"></sk-upload>
        </sk-col>

        <sk-col :span="6">
          <sk-date-picker label="开始日期" name="minDate" init-value="2018-09-02" bind-max="maxDate"></sk-date-picker>
        </sk-col>
        <sk-col :span="6">
          <sk-date-picker label="结束日期" name="maxDate" init-value="2018-09-02" bind-min="minDate"></sk-date-picker>
        </sk-col>
        <sk-col :span="6">
          <sk-time-picker label="时间" name="time" init-value="12:24"></sk-time-picker>
        </sk-col>
        <sk-col :span="6">
          <sk-text-input label="姓名" name="productChildName" required init-value="22"></sk-text-input>
        </sk-col>
        <sk-col :span="6">
          <sk-text-input label="昵称" name="productName" :max-length="6" required></sk-text-input>
        </sk-col>
        <sk-col :span="6">
          <sk-money label="金额" name="money" :max-length="6" required></sk-money>
        </sk-col>
        <sk-col :span="6">
          <sk-checkbox label="是否同意" name="isAgree" checked-value="1" unchecked-value="-1"></sk-checkbox>
        </sk-col>
        <sk-col :span="6">
          <sk-radio name="type" label="选项目" :options="[{label: `生活`, value: 1}, {label: `工作`, value: 2}]" init-value="2"></sk-radio>
        </sk-col>

        <sk-col :span="6">
          <sk-select display-field="productChildName" value-field="productChildId" name="productChildId" label="类型"  :option-bind="selectOptionDs" init-value="2"></sk-select>
        </sk-col>

        <sk-col :span="6">
          <sk-tag name="tags" label="标签"></sk-tag>
        </sk-col>
      </sk-row>
    </sk-form>

    <sk-table :bind="tableDs" selectable>
      <template slot-scope="record">
        <sk-column @click="onClickCell" view-type="text" title="渠道id" name="channelCode" :sortable="false" align="center"></sk-column>
        <sk-column @click="onClickCell" view-type="date" title="日期" name="updateTime" :sortable="false" align="center"></sk-column>
        <sk-column @click="onClickCell" editable edit-type="text-input" title="渠道code" name="channelName" :sortable="true" align="center"/>
        <sk-column @click="onClickCell" editable edit-type="money" title="渠道code" name="channelCode" :sortable="true" align="center"/>
        <sk-column @click="onClickCell" editable edit-type="select" :option-bind="selectOptionDs" display-field="productChildName" value-field="productChildId" title="渠道code" name="channelName" :sortable="true" align="center"/>
        <sk-column @click="onClickCell" editable edit-type="date-picker" title="日期" name="updateTime" align="center"/>
      </template>
    </sk-table>

    <sk-fixed-bottom>
      <sk-button-group align="center">
        <sk-button @click="reset">重置</sk-button>
        <sk-button color="primary" @click="clear">清除</sk-button>
        <sk-button color="primary" @click="isOpenDialog = true">显示</sk-button>
      </sk-button-group>
    </sk-fixed-bottom>

    <sk-dialog :show.sync="isOpenDialog" title="欢迎">
      <sk-form :bind="ds" :has-padding="false">
        <sk-row>
          <sk-col :span="6">
            <sk-date-picker label="开始日期" name="minDate" init-value="2018-09-02" bind-max="maxDate"></sk-date-picker>
          </sk-col>
          <sk-col :span="6">
            <sk-date-picker label="结束日期" name="maxDate" init-value="2018-09-02" bind-min="minDate"></sk-date-picker>
          </sk-col>
          <sk-col :span="6">
            <sk-time-picker label="时间" name="time" init-value="12:24"></sk-time-picker>
          </sk-col>
          <sk-col :span="6">
            <sk-text-input label="姓名" name="productChildName" required init-value="22"></sk-text-input>
          </sk-col>
          <sk-col :span="6">
            <sk-text-input label="昵称" name="productName" :max-length="6" required></sk-text-input>
          </sk-col>
          <sk-col :span="6">
            <sk-money label="金额" name="money" :max-length="6" required></sk-money>
          </sk-col>
          <sk-col :span="6">
            <sk-checkbox label="是否同意" name="isAgree" checked-value="1" unchecked-value="-1"></sk-checkbox>
          </sk-col>
          <sk-col :span="6">
            <sk-radio name="type" label="选项目" :options="[{label: `生活`, value: 1}, {label: `工作`, value: 2}]" init-value="2"></sk-radio>
          </sk-col>

          <sk-col :span="6">
            <sk-select display-field="productChildName" value-field="productChildId" name="productChildId" label="类型"  :option-bind="selectOptionDs" init-value="2"></sk-select>
          </sk-col>

          <sk-col :span="6">
            <sk-tag name="tags" label="标签" :init-value="[2]"></sk-tag>
          </sk-col>

          <sk-col :span="6">
            <sk-select display-field="productChildName" value-field="productChildId" name="productChildId" label="类型"  :option-bind="selectOptionDs" init-value="2"></sk-select>
          </sk-col>

          <sk-col :span="6">
            <sk-tag name="tags" label="标签" :init-value="[2]"></sk-tag>
          </sk-col>
        </sk-row>
      </sk-form>

      <div slot="actions">
        <sk-button-group align="right">
          <sk-button>取消</sk-button>
          <sk-button color="primary" @click="onConfirm">确定</sk-button>
        </sk-button-group>
      </div>
    </sk-dialog>
  </sk-layout>
</template>

<script>
  import DataSet from "../lib/utils/DataSet";
  import SystemApi from "../lib/http/SystemApi";

  export default {
    components: {

    },

    data() {
      window.test = this;

      return {
        isOpenDialog: false,
        value1: null,

        ds: new DataSet({
          isAutoCreate: false,
          isPagination: false,
          isAutoQuery: false,
          queryUrl: "/admin/channel/getDataMonitorList"
        }),

        selectOptionDs: new DataSet({
          queryUrl: SystemApi.getProductChild,
          isAutoQuery: false
        }),

        tableDs: new DataSet({
          isPagination: true,
          queryUrl: SystemApi.getChannelList,
          isAutoQuery: false
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
