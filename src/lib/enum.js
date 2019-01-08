const SystemEnum = {

  checkIsEvalEnum: function(v1, v2) {
    return v1 + '' === v2 + '';
  },


  // 是否热门：0：否 1:是
  productHot: {
    yes: '1',
    no: '0'
  },

  // 1:上架 2:下架
  productStatus: {
    offline: '2',
    onLine: '1'
  },

  //@ApiModelProperty(value = "banner类型:0:app 1:h5")
  /*** banner类型：0:app 1:h5 */
  bannerType: {
    h5: '1',
    app: '0'
  },

  // @ApiModelProperty(value = "状态：1:有效 2:删除")
  bannerActionType: {
    delete: "2",
    enable: "1"
  }
};

SystemEnum.productStatusOption = [{value: SystemEnum.productStatus.onLine, label: '上架'}, {value: SystemEnum.productStatus.offline, label: '下架'}];
SystemEnum.productHotOption =  [{value: SystemEnum.productHot.yes, label: '是'}, {value: SystemEnum.productHot.no, label: '否'}];


export default SystemEnum;
