let path = require('path');
let fs = require("fs");
let iconv = require('iconv-lite');

const staticPath = "src/";

class GenerateRouter {
  static resolve(dir) {
    return path.join(__dirname, '..', dir)
  }

  /**
   * 检测是否为plugin的文件夹
   * plugins则忽略构建路由
   * @param pathName
   * @returns {boolean}
   */
  static isPluginPath(pathName) {
    return pathName.indexOf('/plugins/') > -1;
  }

  /**
   * 读取文件列表 生成路由模板
   * @param path
   * @param result
   */
  static readFileList(path, result, routeEnumConfig) {
    try {
      let files = fs.readdirSync(path);

      files.forEach(function (file) {
        let np = path + "\\" + file;
        let stat = fs.statSync(np);

        if (stat.isDirectory()) {
          GenerateRouter.readFileList(np + "\\", result, routeEnumConfig);
        } else {
          let filename = file.substring(0, file.lastIndexOf("."));
          let obj = {
            code: '',
            path,
            filename,
            pathName: (path + "\\" + filename).replace(/\\\\|\\/g, "/")
          };

          // 如果不是插件的目录生成路由
          if (!GenerateRouter.isPluginPath(obj.pathName)) {
            obj.code = GenerateRouter.createJsCode(obj.pathName, routeEnumConfig);
            result.push(obj.code);
          }
        }
      });

    } catch (e) {
      console.log("读取文件夹出错")
    }
  }

  /**
   * 生成路由js代码
   * @param pathName
   * @returns {string}
   */
  static createJsCode(pathName, routeEnumConfig) {
    let str = [], name;
    pathName = pathName.substring(pathName.indexOf(staticPath) + staticPath.length);
    name = pathName.replace(/\//g, ".");

    str.push('path: "/' + pathName + '"');
    str.push('component: ' + 'resolve => require(["@/' + pathName + '"], resolve)');
    str.push('name: "' + name + '"');
    routeEnumConfig[GenerateRouter.camelCase(pathName)] = name;

    return "{" + str.join(", ") + "}";
  }

  /**
   * 大小写转换 page/name 转化为 pageName
   * @param string
   * @returns {*|void|never}
   */
  static camelCase(string) {
    return string.replace(/\/([a-zA-Z])/g, function (all, letter) {
      return letter.toUpperCase();
    });
  }

  constructor() {
    // 生成的路由结果
    this.routeResult = [];

    // 路由枚举的配置
    this.routeEnumConfig = {};

    GenerateRouter.readFileList(GenerateRouter.resolve("src/page"), this.routeResult, this.routeEnumConfig);

    console.log(this.routeResult);

    this.replaceConfig("src/plugin/router/template.js");
  }

  replaceConfig(p) {
    //获取要写入的字符串
    let jsCode = "[\n" + this.routeResult.join(",\n") + "\n]";

    //读取配置
    let path = GenerateRouter.resolve(p);

    fs.readFile(path, (err, data) => {
      if (err)
        console.log("读取文件fail " + err);
      else {
        // 读取成功时
        // 输出字节数组
        // 把数组转换为gbk中文
        let str = iconv.decode(data, 'utf-8');
        str = str.replace(/\[]/g, jsCode);
        str = str.replace(/Template/gi, "");
        str = str.replace(/\{\}/g, JSON.stringify(this.routeEnumConfig));
        this.writeFile("src/plugin/router/index.js", str);
      }
    });
  }

  writeFile(p, str) {
    let path = GenerateRouter.resolve(p);

    // appendFile，如果文件不存在，会自动创建新文件
    // 如果用writeFile，那么会删除旧文件，直接写新文件
    fs.writeFile(path, str, function (err) {
      if (err) {
        console.log("fail " + err);
      } else {
        console.log("写入路由成功！");
      }
    });
  }
}

new GenerateRouter();
