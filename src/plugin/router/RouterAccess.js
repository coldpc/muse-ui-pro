import systemBase from "../../lib/systemBase";

export default class RouterAccess {

  // 收集非权限页面 默认登陆页
  noAccessPageArray = ["page.user.login", "page.test"];
  router = null;
  store = null;

  constructor(router, store) {
    this.router = router;
    this.store = store;

    router.beforeEach( (to, from, next) => {
      this.beforeEach(to, from, next);
    });

    router.afterEach((route) => {
      this.afterEach(route);
    });
  }

  beforeEach(to, from, next) {
    let isNeedAccess = this.noAccessPageArray.indexOf(to.name) === -1;
    if (isNeedAccess && !systemBase.checkIsLogin()) {
      next({name: this.noAccessPageArray[0]});
    } else {
      next();
    }
  }

  afterEach(route) {
    let name = route.name;
    if (name === 'page.home') {
      name = 'home';
    }

    this.store.dispatch("switchRoute", name);
    // 新页面滚动到顶部
    window.document.documentElement.scrollTop = window.document.body.scrollTop = 0;
  }
}
