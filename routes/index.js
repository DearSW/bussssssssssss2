
var express = require('express');
var router = express.Router();
var httpProxy = require('../routes/http-proxy');

// @取code，向微信获取用户信息，使用scope=snsapi_base方式
router.get('/', function(req, res, next) {
    res.redirect('/spatest/index?');
});
router.get('/spatest', function(req, res, next) {
    res.redirect('/spatest/index?');
});
router.get('/spatest/index', function(req, res, next) {

    // req.session.user = {
    //     "userInfo":{
    //         "userid":"2017120514584241037118",
    //         "phone":"18585830057",
    //         "sex":"0",
    //         "userStatus":1,
    //         "balance":0.0,
    //         "openid":"o5mL51Jzzud0npqbG9u-nrK8M9cc",
    //         "talSpendind":0.0,
    //         "tripCount":0,
    //         "type":0
    //     }
	// };

	req.session.user = {};

    // if(req.session.user == undefined) {
    //     console.log("开始获取微信Code (/spatest/index)");
    //     console.log("开始重定向到微信服务器(/spatest/index)");
    //     // @如果没有用户信息，那么重定向来获取用户信息
    //     var wechatUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6294d62f6cb34553&redirect_uri=MyUrl&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
    //     var url = encodeURIComponent("http://gzzhlx.com/spatest/getUserInfoByCode?return="+req.query.return); // @授权后，重定向的地址：redirect_uri/?code=CODE&state=STATE
    //     res.redirect(wechatUrl.replace('MyUrl',url));
    //     console.log("获取到Code，完成重定向 (/spatest/index)");
    // }
    // @渲染视图，并把参数传给index.ejs
    res.render('index', {
        "user": req.session.user,
        "version": '3.0'
    });

});

router.get('/spatest/getUserInfoByCode', function(req, res, next) {

    console.log("开始获取用户信息 (/getUserInfoByCode)");
    // @进行代理
    httpProxy("/user/getUserOpenid", {code: req.query.code}, function(data) {
        var result = JSON.parse(data).data;
        // @将用户信息放到session
        req.session.user = {
            openId: result.openid,
            userInfo: result.user
        };
        console.log("获取用户信息 (/getUserInfoByCode)");

        // @拿到用户信息后重定向到主页，之所以带上return，是为了在服务器session丢失的时候，重新刷新页面可以重定向到当前页
        res.redirect('/spatest/index?return='+req.query.return+'#/'+req.query.return);
    }, function(data) {
        res.send(data);
        res.end();
    });

});

module.exports = router;
