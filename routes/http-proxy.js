﻿/**
 * @author 周快
 * @date 2016-10-07
 * @version 1.0.0
 * @descriptions http代理请求类，可以将请求代理到其他服务器
 */

var httpProxy = function(url, data, success, error) {

    var ng = require('nodegrass');
  
    //定义主机
    // var host = "http://192.168.5.223:8080/bus/wechat" + url;
    var host = "http://wxcdtest.happyev.com/bus/wechat" + url;
    // var host = "http://111.230.129.41:8080/guizhoubus/wechat" + url;
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    console.log("Start a request:  " + host);
    
    console.log("Request's prama:  " + JSON.stringify(data)); // 将参数data变成json类型的字符串

    var startTime = new Date().getTime(); // 先保存一个时间点

    ng.post(host, function(data, status, hearders) {

            console.log("Request Timeline:  " + (new Date().getTime() - startTime) + " ms");
            //logger.info("请求耗时:"+(new Date().getTime()-startTime)+"ms");
            console.log("Return data:  " + data);
            if(status == 200) {
                success(data); // success为httpProxy对象的回调函数参数
            } else if(status == 404) {
                error({"code":404,data:"应用服务器资源未找到"});
            } else if(status == 500) {
                error({"code":500,data:"应用服务器错误"});
            } else {
                error({"code":502,data:"请求网关错误"});
            }
        }, header, data, 'utf8'
    ).on('error', function(e) {
            console.log(e);
            if(e.code == "ETIMEDOUT"){
                error({"code":502,data:"网关连接超时！"});
            } else if(e.code == "EHOSTUNREACH"){
                error({"code":502,data:"无法连接到服务器，请检查您的网络设置"});
            } else {
                error({"code":502,data:"请求网关错误！"});
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