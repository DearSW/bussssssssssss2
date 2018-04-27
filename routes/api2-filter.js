// @此代理需要对用户进行权限校验
var httpProxy = require('../routes/http-proxy');
var filter = function(req, res, next) { // @定义了一个过滤函数，在应用程序中当做中间件来使用，中间件就是一个函数。
    // @检验用户信息是否存在
    if(req.session.user == undefined) {
        res.send({"code": 401, "data": "没有权限"})
        res.end();
    } else {
        // @获取完整目录名
        var url = req.originalUrl;//var url = req._parsedUrl.pathname; 截取完整目录名
        // @截取请求网关后的目录名
        var serviceUrl =url.substring(4,url.length);
        httpProxy(serviceUrl, req.body, function(data) {
            res.send(data);
            res.end();
        }, function(data) {
            res.send(data);
            res.end();
        });
    }
}
module.exports = filter;
