<script type="text/javascript">
  import MoneyApi from "../lib/utils/MoneyApi";
  import DateApi from "../lib/utils/DateApi";

  export const EnColumnEvents = {
    click: 'click'
  };

  export default{
    name: "sk-column",
    props: {
      record: {},

      // 这个参数至关重要
      // 开启的话讲话弃置内部渲染
      // 完全由模板渲染完成
      isAutoRender: {
        type: Boolean,
        default: true
      },

      name: {}, // 对应列内容的字段名
      title: {}, // 标题
      width: {}, // 宽度
      sortable: {}, // 列是否可以排序
      align: {default: 'left'}, // 列的对齐方式
      cellAlign: {default: 'left'}, // 单元格对齐方式
      tooltip: {}, // 列的提示文字
      formatter: {type: Function},

      format: {type: String}, // yyyy/MM/dd hh:mm:ss 数据类型为date时候有效
      viewType: {default: "text", type: String}, // 数据类型 money img date

      isHide: {type: Boolean, default: false},
      required: {default: false},
      index:{},
      editable:{},
      editType:{},
      type: {type: String},
      min: {type: Number},
      displayField:{},
      valueField:{},
      optionBind:{},
      checkedValue:{},
      uncheckedValue:{},
    },

    data(){
      return {
        owner: {}
      };
    },

    render: function (createElement) {
      // 不自动渲染
      if (!this.isAutoRender) {
        return createElement(
          "td",
          {
            on: {
              click: this.onClick
            },
            props: {
              name: name
            },
            style: {
              width: this.width,
              textAlign: this.align || "center"
            }
          },
          [this.$slots.default]
        );
      }

      /*****************自动渲染开始****************/
      let editable = this.editable;
      editable = editable !== false && typeof editable !== 'undefined';

      if (editable){
        let editType = this.editType || "text-input";
        let componentName;

        switch(editType){
          default:
            componentName = editType;
        }
        componentName = "sk-" + componentName;

        let props = this.$options.propsData;
        props.record = this.record;

        //返回
        return createElement(
          "td",
          {
            on: {
              click: this.onClick
            },
            props: {
              name: this.name,
              required: this.required
            },
            style: {
              width: this.width,
              textAlign: "center" || this.align
            }
          },
          [
            createElement(componentName, {
              props: props
            })
          ]
        );
      }else{
        //保存cellContent
        let display = this.getDisplay();
        let cellContent = this.owner.cellContent = createElement("div", {
          style: {
          },

          props: {},

          attrs: {
            name: this.name,
            class: "sk-td-content " + this.className,
            title: !this.formatter ? display : ""
          },
          domProps: {
            innerHTML: display
          },
        });

        let record = this.record, name = this.name;
        if (record){
          let columns = record.columns || (record.columns = {});
          columns[name] = this;
        }

        return createElement(
          "td",
          {
            on: {
              click: this.onClick
            },
            props: {
              name: name
            },
            style: {
              width: this.width,
              textAlign: this.align || "center"
            }
          },
          [cellContent, this.$slots.default]
        );
      }
    },

    created(){

    },

    watch: {

    },

    methods: {
      //获取tdValue
      getValue(){
        if (this.record){
          return this.record.getValue(this.name);
        }
      },

      getDisplay(){
        let func = this.formatter;
        let value = this.getValue();

        //value可以二次渲染
        if (typeof func === "function"){
          value = func(value, this.index, this.record);
        }else{
          value = this.getViewByType(value);
        }

        if (!value && value !== 0) {
          value =  '--';
        }
        return value;
      },

      onClick(event){
        this.$emit(EnColumnEvents.click, {event, value: this.getValue(), index: this.index, record: this.record});
      },

      getViewByType(v){
        let viewType = this.viewType;
        let result;
        switch(viewType){
          case "money":
            result = MoneyApi.format(v);
            break;

          case "date":
            result = DateApi.format(v);
            break;

          default:
            result = v;
        }

        return result;
      }
    }
  };
</script>
