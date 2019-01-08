let path = require('path')
let fs = require("fs");

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}


function readFileList(path, result) {
    try {
        var files = fs.readdirSync(path);
        files.forEach(function (file) {
            var np = path + "\\" + file;
            var stat = fs.statSync(np);

            if (stat.isDirectory()) {
                //递归读取文件
                readFileList(np + "\\", result);
            } else {

                var obj = {}; //定义一个对象存放文件的路径和名字
                obj.path = path; //路径

                obj.filename = file.substring(0, file.lastIndexOf(".")); //名字

                obj.pathName = path + "\\" + obj.filename;
                obj.pathName = obj.pathName.replace(/\\\\|\\/g, "/");

                if (!isPluginPath(obj.pathName)) {
                    obj.code = createJsCode(obj.pathName);
                    result.push(obj.code);
                }
            }
        });

    } catch (e) {
        console.log("读取文件夹出错")
    }
}

const staticPath = "src/";
function createJsCode(pathName) {
    var str = [], name;
    pathName = pathName.substring(pathName.indexOf(staticPath) + staticPath.length);
    name = pathName.replace(/\//g, ".");

    str.push('path: "/' + pathName + '"');
    str.push('component: ' + 'resolve => require(["@/' + pathName +  '"], resolve)');
    str.push('name: "' + name + '"');
    mapResult[camelCase(pathName)] = name;

    return "{" + str.join(", ") + "}";
}

function camelCase(string){
  return string.replace( /\/([a-zA-Z])/g, function( all, letter ) {
    return letter.toUpperCase();
  });
}

let result = [], mapResult = {};
readFileList(resolve("src/page"), result);

// 过滤result
console.log(result);
function isPluginPath(pathName) {
    return pathName.indexOf('/plugins/') > -1;
}

replaceConfig("src/plugin/router/template.js");

let iconv = require('iconv-lite');
function replaceConfig(p) {
    //获取要写入的字符串
    jscode = "[\n" + result.join(",\n") + "\n]";

    //读取配置
    var path = resolve(p);

    fs.readFile(path, function(err, data){
        if(err)
            console.log("读取文件fail " + err);
        else{
            // 读取成功时
            // 输出字节数组
            // 把数组转换为gbk中文
            var str = iconv.decode(data, 'utf-8');
            str = str.replace(/\[]/g, jscode);
            str = str.replace(/Template/gi, "");
            str = str.replace(/\{\}/g, JSON.stringify(mapResult));
            writeFile("src/plugin/router/index.js", str);
        }
    });
}

function writeFile(p, str){
    var path = resolve(p);
    // appendFile，如果文件不存在，会自动创建新文件
    // 如果用writeFile，那么会删除旧文件，直接写新文件
    fs.writeFile(path, str, function(err){
        if(err){
            console.log("fail " + err);
        }else{
            console.log("写入路由成功！");
        }
    });
}
