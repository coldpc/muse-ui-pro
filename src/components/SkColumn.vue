<script type="text/javascript">
  import MoneyApi from "../lib/utils/MoneyApi";
  import DateApi from "../lib/utils/DateApi";

  export default{
    name: "sk-column",
    props: {
      record: {},

      name: {}, // 对应列内容的字段名
      title: {}, // 标题
      width: {}, // 宽度
      sortable: {}, // 列是否可以排序
      align: {default: 'left'}, // 列的对齐方式
      cellAlign: {default: 'left'}, // 单元格对齐方式
      tooltip: {}, // 列的提示文字
      formatter: {type: Function},

      viewType: {default: "text", type: String}, // 数据类型

      isHide: {type: Boolean, default: false},
      required: {default: false},
      rowIndex:{},
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
      //现将数据拷贝过去
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

        let props = this.props;
        props.record = this.record;
        props.type = this.type;

        //返回
        return createElement(
          "td",
          {
            on: {
              click: this.onClick,
              cellClick: this.onClick
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
          }
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
              click: this.onClick,
              cellClick: this.onClick
            },
            props: {
              name: name
            },
            style: {
              width: this.width,
              textAlign: this.align || "center"
            }
          },
          [cellContent]
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
          value = func(value, this.rowIndex, this.record);
        }else{
          value = this.getViewByType(value);
        }

        if (!value && value !== 0) {
          value =  '--';
        }
        return value;
      },

      onClick(e){
        let listener = this.listeners;
        if (listener && listener['cell-click']){
          listener['cell-click'](e, this.getValue(), this.name, this.rowIndex, this.record);
        }
      },

      getViewByType(v){
        let viewType = this.viewType;
        let result;
        switch(viewType){
          case "img":
            let src = typeof v ==="string" ? v : ((!!v && v[0] && v[0].path) ? v[0].path : "");
            if (src){
              result = "<div class='sk-img-viewer'><img class='sk-img' src='" + src + "'/></div>";
            }else{
              result = "";
            }
            break;

          case "money":
            result = MoneyApi.format(v);
            break;

          case "time":
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
