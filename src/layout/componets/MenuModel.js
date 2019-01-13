/**
 * menuModel是定义菜单的数据模型的地方
 * 菜单分为可折叠和不可折叠两种
 */
export class MenuModel {

  // 菜单标题
  title;

  // 菜单的图标
  icon;

  // 菜单的路由名
  routeName;

  // 是否展开子菜单
  isUnfold;

  // 是否为首页 由于目前首页有两种路由，因此判断比较麻烦 page.home | home
  isHome;

  // 子菜单
  children;

  /**
   * 构造menu的数据模型
   * @param title 标题
   * @param icon 图标
   * @param routeName 路由名称
   * @param isUnfold 是否展开
   * @param children {Array<MenuModel>} 子路由
   */
  constructor({title, icon, routeName, isUnfold = true, children}) {
    this.title = title;
    this.icon = icon;
    this.routeName = routeName;
    this.isUnfold = isUnfold;
    this.children = children;
    this.isHome = this.checkIsHome(routeName);
  }

  /**
   * 展开菜单
   */
  unfold() {
    this.isUnfold = true;
  }

  /**
   * 折叠菜单
   */
  fold() {
    this.isUnfold = false;
  }

  toggle() {
    this.isUnfold = !this.isUnfold;
  }

  /**
   * 是否为激活的路由
   * @param currentRouteName 当前的路由
   * @returns {boolean}
   */
  checkIsActive(currentRouteName) {
    return this.routeName === currentRouteName || this.checkIsHome(currentRouteName) && this.isHome;
  }

  /**
   * 校验是否为主页 如果是返回true
   * @param routeName
   * @returns {boolean}
   */
  checkIsHome(routeName) {
    return routeName === 'home' || routeName === 'page.home';
  }
}
