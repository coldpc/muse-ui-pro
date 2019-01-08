import base from "./lib/base";

export default class RouterAccess {

  // 收集非权限页面 默认登陆页
  noAccessPageArray = ["page.user.login", "page.test"];
  router = null;

  constructor(router) {
    this.router = router;

    router.beforeEach( (to, from, next) => {
      this.beforeEach(to, from, next);
    });

    router.afterEach(() => {

    });
  }

  beforeEach(to, from, next) {
    let isNeedAccess = this.noAccessPageArray.indexOf(to.name) === -1;
    if (isNeedAccess && !base.checkIsLogin()) {
      next({name: this.noAccessPageArray[0]});
    } else {
      next();
    }
  }

  afterEach(route) {
    // 新页面滚动到顶部
    window.document.documentElement.scrollTop = window.document.body.scrollTop = 0;
  }
}
