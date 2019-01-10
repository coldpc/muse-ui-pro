<template>
  <sk-layout>
    <skForm :bind="ds">
      <SkRow>
        <SkCol :span="6">
          <SkDatePicker label="开始日期" name="minDate" init-value="2018-09-02" bind-max="maxDate"></SkDatePicker>
        </SkCol>
        <SkCol :span="6">
          <SkDatePicker label="结束日期" name="maxDate" init-value="2018-09-02" bind-min="minDate"></SkDatePicker>
        </SkCol>
        <SkCol :span="6">
          <SkTimePicker label="时间" name="time" init-value="12:24"></SkTimePicker>
        </SkCol>
        <SkCol :span="6">
          <SkTextInput label="姓名" name="productChildName" required init-value="22"></SkTextInput>
        </SkCol>
        <SkCol :span="6">
          <SkTextInput label="昵称" name="productName" :max-length="6" required></SkTextInput>
        </SkCol>
        <SkCol :span="6">
          <SkMoney label="金额" name="money" :max-length="6" required></SkMoney>
        </SkCol>
        <SkCol :span="6">
          <SkCheckBox label="是否同意" name="isAgree" checked-value="1" unchecked-value="-1"></SkCheckBox>
        </SkCol>
        <SkCol :span="6">
          <SkRadio name="type" label="选项目" :options="[{label: `生活`, value: 1}, {label: `工作`, value: 2}]" init-value="2"></SkRadio>
        </SkCol>

        <SkCol :span="6">
          <SkSelect display-field="productChildName" value-field="productChildId" name="productChildId" label="类型"  :option-bind="selectOptionDs" init-value="2"></SkSelect>
        </SkCol>

        <SkCol :span="6">
          <SkTag name="tags" label="标签" :init-value="[2]"></SkTag>
        </SkCol>
      </SkRow>
    </skForm>


    <Table :bind="tableDs">
      <template slot-scope="record">
        <SkColumn title="渠道id" name="id" :sortable="true" align="center"/>
        <SkColumn title="渠道code" name="channelCode"  :sortable="true" align="center"/>
        <SkColumn title="链接" name="channelUrl"/>
      </template>
    </Table>

    <SkFixedBottom>
      <SkButtonGroup align="center">
        <skButton @click="reset">重置</skButton>
        <skButton color="primary" @click="clear">清除</skButton>
      </SkButtonGroup>
    </SkFixedBottom>
  </sk-layout>
</template>

<script>
  import SkTextInput  from '../components/SkTextInput';
  import Table  from '../components/Table';
  import SkColumn  from '../components/SkColumn';
  import SkRadio from '../components/SkRadio';
  import SkCheckBox from '../components/SkCheckBox';
  import SkButton from '../components/SkButton';
  import SkDatePicker from '../components/SkDatePicker';
  import SkTimePicker from '../components/SkTimePicker';
  import SkForm from '../components/SkForm';
  import SkRow from '../components/SkRow';
  import SkFixedBottom from '../components/SkFixedBottom';
  import SkCol from '../components/SkCol';
  import SkButtonGroup from '../components/SkButtonGroup';
  import SkMoney from '../components/SkMoney';
  import SkSelect from '../components/SkSelect';
  import SkTag from '../components/SkTag';
  import DataSet from "../lib/utils/DataSet";
  import SystemApi from "../lib/http/SystemApi";

  export default {
    components: {
      SkCheckBox,
      SkTextInput,
      SkForm,
      SkDatePicker,
      SkTimePicker,
      SkMoney,
      SkButtonGroup,
      SkFixedBottom,
      SkButton,
      SkRadio,
      SkTag,
      SkSelect,
      SkCol,
      SkRow,
      Table,
      SkColumn
    },

    data() {
      window.test = this;

      return {
        value1: null,
        ds: new DataSet({
          isAutoCreate: true,
          isPagination: false,
          isAutoQuery: false,
          queryUrl: "/admin/channel/getDataMonitorList"
        }),

        selectOptionDs: new DataSet({
          queryUrl: SystemApi.getProductChild,
          isAutoQuery: true
        }),

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
      submit() {
        this.ds.sendVerify();
      },

      reset() {
        this.ds.resetCurrentRecord();
      },

      clear() {
        this.ds.getCurrentRecord().setData({});
      }
    }
  }
</script>


<style scoped lang="scss">

</style>
