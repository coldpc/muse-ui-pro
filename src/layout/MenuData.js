import {MenuModel} from "./componets/MenuModel";
import {EnRoutesConfig} from "../plugin/router";

const MENU_DATA = [{
    title: "数据监控",
    routeName: EnRoutesConfig.pageHome,
    icon: "timeline"
  },

  {
    title: "添加渠道",
    icon: "settings",
    children: [{
      title: "table测试",
      routeName: EnRoutesConfig.pageTestTable
    }]
  },

  {
    title: "渠道管理",
    icon: "tram",
    routeName: EnRoutesConfig.pageChannelManager
  }
];

export class MenuData {
  routeList;

  constructor() {
    this.routeList = this.initRouteData(MENU_DATA);
  }

  /**
   * 处理路由数据
   * @param data
   * @returns {Array<MenuModel>}
   */
  initRouteData(data) {
    if (!data) {
      return null;
    }

    let result = [], temp;
    for (let i = 0, l = data.length; i < l; i ++) {
      temp = data[i];
      result.push(new MenuModel({
        title: temp.title,
        routeName: temp.routeName,
        icon: temp.icon,
        isUnfold: true,
        children: this.initRouteData(temp.children)
      }));
    }

    return result;
  }

  getRouteList() {
    return this.routeList;
  }
}
