/**
 * @date 2016-10-07
 * @descriptions http代理请求类，可以将请求代理到其他服务器
 */

var httpProxy = function(url, data, success, error) {

    var ng = require('nodegrass');
  
    // @定义需要远程连接或者本地的服务器主机
    // var host = "http://192.168.5.223:8080/bus/wechat" + url;
    // var host = "http://wxcdtest.happyev.com/bus/wechat" + url;
    // var host = "http://111.230.129.41:8080/guizhoubus/wechat" + url; // @示例 http://111.230.129.41:8080/guizhoubus/wechat/product/queryProductKeywords url 为 /product/queryProductKeywords 
    var host = "http://127.0.0.1:3333/guizhoubus/wechat" + url;
    // var host = "http://47.100.171.74:3333/guizhoubus/wechat" + url;

    var header = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    console.log("代理-发起的请求：" + host);
    
    console.log("代理-请求的参数：" + JSON.stringify(data));

    var startTime = new Date().getTime(); // @代理请求的起始时间点变量

    ng.post(host, function(data, status, hearders) {

            console.log("代理-请求的耗时：" + (new Date().getTime() - startTime) + " ms");
            // logger.info("请求耗时:"+(new Date().getTime()-startTime)+"ms");
            console.log("代理-返回的数据：" + data);
            if(status == 200) {
                success(data); // success为httpProxy对象的回调函数参数
            } else if(status == 404) {
                error({"code": 404, data: "服务器资源未找到"});
            } else if(status == 500) {
                error({"code": 500, data: "服务器错误"});
            } else {
                error({"code": 502, data: "请求网关错误"});
            }
        }, header, data, 'utf8'
    ).on('error', function(e) {
            console.log(e);
            if(e.code == "ETIMEDOUT") {
                error({"code": 502, data: "网关连接超时！"});
            } else if(e.code == "EHOSTUNREACH") {
                error({"code": 502, data: "无法连接到服务器，请检查您的网络设置"});
            } else {
                error({"code": 502, data: "请求网关错误！"});
            }
    });

};

module.exports = httpProxy;

// ng.post(url,callback,reqheaders,data,charset)
// url请求地址,
// callback回调函数,
// reqheaders请求头标识,一般使用 'Content-Type': 'application/x-www-form-urlencoded'
// data请求所包含的具体数据,
// charset编码方式，一般为utf8