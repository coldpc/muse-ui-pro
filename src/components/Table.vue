<script type="text/javascript">
  import DataSet from "../lib/utils/DataSet";
  import {UtilsBase} from "../lib/utils/UtilsBase";

  export const EnTableEvents = {
    onRowClick: 'onRowClick',
    onChangeSelects: "onChangeSelects",
    sortChange: "onSortChange"
  };

  export default {
    name: "sk-table",

    render() {
      let columns = getTableColumns(this.$scopedSlots.default());

      let scopedSlots = {
        default: (scope) => {
          let row = scope.row;
          return setNodesRecord(this.$scopedSlots.default(row), row);
        }
      };

      if (this.$scopedSlots.th) {
        scopedSlots.th = (scope) => {
          let thSlot = this.$scopedSlots.th;
          if (thSlot) {
            return thSlot(scope)
          }else {
            return null;
          }
        };
      }

      return (<div className="main-container">
        <mu-paper zDepth={2}>
          <div class="sk-table-part">
            <mu-data-table ref="table" selectable={this.selectable} selectAll={this.selectAll} checkbox={this.selectable}
                           columns={columns} data={this.records}
                           selects={this.selects} sort={this.sort} stripe={this.stripe}
                           autoExpand={this.autoExpand} loading={this.isLoading} hideHeader={this.hideHeader}

                           {...{
                              on:{
                                'update:selects': (selects) => {
                                  this.selects = selects;
                                },
                                'update:sort': (sort) => {
                                  this.sort = sort;
                                },
                                'row-click': this.onClickRow,
                                'select-change': this.onSelectChange,
                                'sort-change': this.handleSortChange
                              }
                           }}

                          slots={{

                          }}

                           scopedSlots={scopedSlots}>
            </mu-data-table>
          </div>

          {(this.bind && this.bind.isPagination) ? <div class="page-part">
            <div class="page-num">
              <mu-pagination
                current={this.pageNum} total={this.totalCount} pageCunt={5} pageSize={this.pageSize}
                {...{
                  on:{
                    'update:current': this.onChangePageNum
                  }
                }}
                raised={false} circle={false}/>
            </div>

            <div class="page-options">
              <sk-select value={this.pageSize} {...{
                on:{
                  'change': this.onChangePageSize
                }
              }} options={[10, 20, 50, 100]} />
            </div>

          </div> : null}
        </mu-paper>
      </div>);

      // 获取table的配置
      function getTableColumns(nodes) {
        let columns = [], node;
        for (let i = 0, l = nodes.length; i < l; i++) {
          node = nodes[i];
          if (node.tag && node.tag.indexOf("sk-column")) {
            columns.push(UtilsBase.deepCopy(node.componentOptions.propsData || {}));
          }
        }
        return columns;
      }

      // 设置绑定的record
      function setNodesRecord(nodes, record) {
        let node, props;
        for (let i = 0, l = nodes.length; i < l; i++) {
          node = nodes[i];
          if (node.tag && node.tag.indexOf("sk-column")) {
            props = node.componentOptions.propsData || {};
            props.record = record;
            node.componentOptions.propsData = props;
          }
        }

        return nodes;
      }
    },

    data() {
      return {
        isLoading: false,
        hasLoadData: false,

        records: [],
        selects: [],
        sort: {
          name: '',
          order: 'asc' // asc, desc
        },
        pageNum: 1,
        pageSize: 10,
        totalCount: 1,

      }
    },

    props: {
      bind: {
        type: DataSet
      },

      autoExpand: {
        type: Boolean,
        default: true
      },

      stripe: {
        type: Boolean,
        default: true
      },

      // 是否隐藏header
      hideHeader: {
        type: Boolean,
        default: false
      },

      // 列的宽度是否自撑开
      fit: {
        type: Boolean,
        default: true
      },

      // 是否可选择
      selectable: {
        type: Boolean,
        default: false
      },

      // 是否开启全选选择框
      selectAll: {
        type: Boolean,
        default: true
      }
    },

    created() {
      if (this.bind) {
        this.setBindDs(this.bind);
      }
    },

    watch: {
      bind(newDs, oldDs) {
        this.setBindDs(newDs, oldDs);
      }
    },

    methods: {
      setBindDs(ds, old) {
        if (!!old) {
          old.removeEventListener(DataSet.eventTypes.onLoad, this.onLoad);
          old.removeEventListener(DataSet.eventTypes.onLoading, this.onLoading);
          old.removeEventListener(DataSet.eventTypes.onLoadFailed, this.onLoadFailed);
        }
        ds.addEventListener(DataSet.eventTypes.onLoad, this.onLoad);
        ds.addEventListener(DataSet.eventTypes.onLoading, this.onLoading);
        ds.addEventListener(DataSet.eventTypes.onLoadFailed, this.onLoadFailed);

        this.isLoading = ds.isLoading;
        if (ds.hasLoadData) {
          this.setRecords(ds.getRecords());
        }
      },

      onLoading() {
        this.isLoading = true;
      },

      onLoad(records) {
        this.setRecords(records);
        this.isLoading = false;

        let ds = this.bind;
        this.pageSize = ds.pageSize;
        this.totalCount = ds.totalCount;
        this.pageNum = ds.pageNum;
      },

      onLoadFailed() {
        this.isLoading = false;
      },

      setRecords(records) {
        this.hasLoadData = true;
        this.records = records;
      },

      onSortChange() {

      },

      getSelectedRecords(selects) {
        let records = this.bind.getRecords(), record;
        for (let i = 0, l = records.length; i < l; i++) {
          record.isSelected = selects.indexOf(i) > -1;
        }
      },

      onSelectChange(selects) {
        this.$emit(EnTableEvents.onChangeSelects, this.getSelectedRecords(selects));
      },

      onClickRow(index, row, event) {
        this.$emit(EnTableEvents.onRowClick, ...arguments);
      },

      handleSortChange(value){
        this.bind.sort(value.name, value.order);
      },

      onChangePageSize(value) {
        value = parseInt(value);
        this.pageSize = value;
        this.bind.setPageSize(value);
      },

      onChangePageNum(pageNum) {
        this.pageNum = pageNum;
        this.bind.gotoPage(this.pageNum);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-part{
    padding: 20px;
  }
  .page-num, .page-options{
    display: inline-block;
    vertical-align: middle;
  }
  .page-options{
    height: 45px;
    margin-left: 20px;
    width: 100px;
  }
</style>
