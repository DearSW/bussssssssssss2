/**
 * Created by 滕召维 
 * 2017.07.25
 * @sessionStorage命名方式 项目名简称_页面名简称_用途全称
 */
/**************************************** 
 * 
 * @贵旅景区直通车 我的线路、行程、账户
 * 
 ****************************************/
var app = angular.module('app');

/**
 * @描述：HTTP请求的Error回调函数
 */
var errorFn = function() {
        console.log("你好，数据请求失败");
};

/**
 * @描述：存储数据
 * @参数：命名，数据
 */
var storageData = function(name, data) {
    sessionStorage.setItem(name, JSON.stringify(data));
}

/**
 * @描述：获取数据
 * @参数：命名，数据
 * @返回：数据对象
 */
var getStorageData = function(name) {
    return JSON.parse(sessionStorage.getItem(name));
}

/**
 * @描述：格式化请求参数对象，去掉其中值为空的属性 
 * @参数：需要格式化的对象
 * @返回：格式化之后的对象
 */
var formatParamObject = function(obj) {
    for (var key in obj) {  
        if(obj[key] === '' && obj[key] !== false) {
                delete obj[key];
           }
    }
    return obj;
}

/**
 * @描述：数组差集 
 * @参数：求差集的两个数组
 * @返回：差集数组
 */
var arrayMinus = function (arrA, arrB) {
    var result = [];
    var obj = {};
    for (var i = 0; i < arrB.length; i++) {
        obj[arrB[i]] = 1;
    }
    for (var j = 0; j < arrA.length; j++) {
        if (!obj[arrA[j]])
        {
            obj[arrA[j]] = 1;
            result.push(arrA[j]);
        }
    }
    return result;
};

/* 
 *  @描述：浮点数运算对象，解决JS运算精度丢失的问题
 */
var floatObj = function() {
    /*
     * @判断obj是否为一个整数
     */
    function isInteger(obj) {
        return Math.floor(obj) === obj
    }
    /*
     * @将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
     * @param floatNum {number} 小数
     * @return {object}
     * @{times:100, num: 314}
     */
    function toInteger(floatNum) {
        var ret = {times: 1, num: 0}
        if (isInteger(floatNum)) {
            ret.num = floatNum
            return ret
        }
        var strfi  = floatNum + ''
        var dotPos = strfi.indexOf('.')
        var len    = strfi.substr(dotPos+1).length
        var times  = Math.pow(10, len)
        var intNum = parseInt(floatNum * times + 0.5, 10)
        ret.times  = times
        ret.num    = intNum
        return ret
    }
    /*
     * @核心方法，实现加减乘除运算，确保不丢失精度
     * @思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
     *
     * @param a {number} 运算数1
     * @param b {number} 运算数2
     * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
     * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
     *
     */
    function operation(a, b, digits, op) {
        var o1 = toInteger(a); // 一个浮点数转成整数
        var o2 = toInteger(b); // 一个浮点数转成整数
        var n1 = o1.num
        var n2 = o2.num
        var t1 = o1.times
        var t2 = o2.times
        var max = t1 > t2 ? t1 : t2
        var result = null
        switch (op) {
            case 'add':
                if (t1 === t2) { // 两个小数位数相同
                    result = n1 + n2
                } else if (t1 > t2) { // o1 小数位 大于 o2
                    result = n1 + n2 * (t1 / t2)
                } else { // o1 小数位 小于 o2
                    result = n1 * (t2 / t1) + n2
                }
                return result / max
            case 'subtract':
                if (t1 === t2) {
                    result = n1 - n2
                } else if (t1 > t2) {
                    result = n1 - n2 * (t1 / t2)
                } else {
                    result = n1 * (t2 / t1) - n2
                }
                return result / max
            case 'multiply':
                result = (n1 * n2) / (t1 * t2)
                return result
            case 'divide':
                result = (n1 / n2) * (t2 / t1)
                return result
        }
    }
    // @加减乘除的四个接口
    function add(a, b, digits) {
        return operation(a, b, digits, 'add')
    }
    function subtract(a, b, digits) {
        return operation(a, b, digits, 'subtract')
    }
    function multiply(a, b, digits) {
        return operation(a, b, digits, 'multiply')
    }
    function divide(a, b, digits) {
        return operation(a, b, digits, 'divide')
    }
    // @exports
    return {
        add: add,
        subtract: subtract,
        multiply: multiply,
        divide: divide
    }
}();

/* 
 *  @描述：页面控制器
 */
app
    /**
     * @首页、搜索、控制器
     */
    .controller('City_select', function($rootScope, $scope, $state, $timeout, $interval, $myLocationService, $myHttpService, $ionicSlideBoxDelegate, $ionicActionSheet, $selectCity, $filter, ionicDatePicker, $ionicModal) {
        
        var slideImageTimer = null; // @图片定时器
        
        // @流程控制，确保推荐在未关闭Ng页面之前仅仅请求一次，优化
        if(sessionStorage.getItem("recommendImgCount") == null) { // @首次加载

            var recommendImgCount = 1; // @流程控制变量
            $rootScope.recommendProducts2 = []; // @推荐图片数组

        } else {

            var recommendImgCount = sessionStorage.getItem("recommendImgCount"); // @读取次数变量

        }

        $scope.dataContainer = { // @数据容器
            input: "" // @用户输入
        }
        
        if(recommendImgCount == 1) { // @首次加载

            sessionStorage.setItem("recommendImgCount", 2);

            $rootScope.showDefaultImg = true; // @推荐图片不存在时，默认的placeholder
        
            // @请求获取推荐路线数据  /web/product/queryRecommendProductList
            $myHttpService.postNoLoad('api/product/queryRecommendProductList', {}, function(data) {
                console.log("首页：图片推荐API返回的数据");
                console.log(data);
                $rootScope.recommendProducts2 = data.products;
                if($rootScope.recommendProducts2.length == 0) {
                    $timeout(function() {
                        $rootScope.showDefaultImg = true;
                        $ionicSlideBoxDelegate.update();
                    }, 500);
                } else {
                    $rootScope.showDefaultImg = false;
                    $ionicSlideBoxDelegate.update();
                    $timeout(function() {
                        $ionicSlideBoxDelegate.next();
                    }, 1000);
                }
            }, errorFn);

            // $rootScope.recommendProducts2Index = 0;

        }
        
        function slideImage() { // @轮播控制函数
            if($rootScope.recommendProducts2 && $rootScope.recommendProducts2.length > 0) {
                $rootScope.recommendProducts2Index = $rootScope.recommendProducts2Index === $rootScope.recommendProducts2.length - 1 ? 0 : $rootScope.recommendProducts2Index + 1;
                $rootScope.slideNumber = $ionicSlideBoxDelegate.$getByHandle("adBanner").currentIndex();
                if ($rootScope.slideNumber + 1 != $rootScope.recommendProducts2Index && $rootScope.recommendProducts2Index != 0) {
                    $rootScope.recommendProducts2Index = $rootScope.slideNumber; //手动滑动后和自动轮播保持一致
                    $ionicSlideBoxDelegate.$getByHandle("adBanner").slide($rootScope.recommendProducts2Index); //只有首页的banner轮播
                } else {
                    $ionicSlideBoxDelegate.$getByHandle("adBanner").slide($rootScope.recommendProducts2Index); //只有首页的banner轮播
                }
            }
        }

        slideImageTimer = $interval(function() { // @定时器，开始轮播
            slideImage();
        }, 4000);

        // @当DOM元素从页面中被移除时，Ng将会在scope中触发$destory事件。
        $scope.$on("$destroy", function() { // @清除定时器，防止定时的叠加效应
            $interval.cancel(slideImageTimer); // @专业的清除函数
        });

        // @推荐路线 数据详情，点击图片进行跳转到 产品 页面
        $scope.recommendProductsDetail = function(item, i) {

            var data = {
                productid: item.productid
            };
            console.log("首页：点击图片进入产品页打印参数");
            console.log(data);
            $state.go('tabs', {data: JSON.stringify(data)}, {reload: true});

        };

        // @所在城市
        /*
            if(recommendImgCount == 1) {
                $selectCity.getCity(function(data) {
                    $scope.positionCity = data;
                    // 判断用户当前位置是否在贵州省范围类
                    var pattern = /(贵阳.*|遵义.*|六盘水.*|毕节.*|黔南.*|黔东南.*|黔西南.*|铜仁.*|安顺.*)/g;
                    var re = pattern.test($scope.positionCity);
                    if(re) {
                        if(sessionStorage.getItem('search_city') == null) {
                            $scope.positionCity = '贵阳';
                            $rootScope.cityssss = $scope.positionCity;
                        } else {
                            $scope.positionCity = sessionStorage.getItem('search_city');
                            $rootScope.cityssss = $scope.positionCity;
                        }
                        if(sessionStorage.getItem('search_input') != null) {
                            $scope.dataContainer.input = sessionStorage.getItem('search_input');
                            $scope.dataContainer.btnDisabled = false;
                        }
                    } else {
                        $scope.positionCity = '贵阳';
                        $rootScope.cityssss = $scope.positionCity;
                    }
                });
            } else {
                if(sessionStorage.getItem('search_city') == null) {
                    $scope.positionCity = '贵阳';
                    $rootScope.cityssss = $scope.positionCity;
                } else {
                    $scope.positionCity = sessionStorage.getItem('search_city');
                    $rootScope.cityssss = $scope.positionCity;
                }
                if(sessionStorage.getItem('search_input') != null) {
                    $scope.dataContainer.input = sessionStorage.getItem('search_input');
                    $scope.dataContainer.btnDisabled = false;
                }
            }
        */

        // @查询城市区域
        // @对象数组去重函数
        function unique2(array, prop) {
            var n = {}, r = [], len = array.length, val, type;
            for (var i = 0; i < array.length; i++) {
                val = array[i][prop];
                type = typeof val;
                if (!n[val]) {
                    n[val] = [type];
                    r.push(val);
                } else if (n[val].indexOf(type) < 0) {
                    n[val].push(type);
                    r.push(val);
                }
            }
            return r;
        }
        
        /*
            if(recommendImgCount == 1) {
                $rootScope.tempsz = []; // 区域数组变量            
                $myHttpService.postNoLoad('api/product/queryBuslineRegion', {}, function(data) {
                    $scope.citysz  = unique2(data.regions, 'regionName');
                    // $rootScope.tempsz = []; // 区域数组变量
                    for (var i = 0, len = $scope.citysz.length; i < len; i++) {
                        var obj = {
                            text: $scope.citysz[i]
                        };
                        $rootScope.tempsz.push(obj);
                    }
                    $scope.show = function() {
                        var hideSheet = $ionicActionSheet.show({
                            buttons: $rootScope.tempsz,
                            titleText: '请选择城市',
                            cancel: function() {
                                // add cancel code..
                            },
                            buttonClicked: function(index, element) {
                                $scope.cityssss = element.text.toString();
                                return true;
                            }
                        });
                    };
                }, errorFn);
            } else {
                $scope.show = function() {
                    var hideSheet = $ionicActionSheet.show({
                        buttons: $rootScope.tempsz,
                        titleText: '请选择城市',
                        cancel: function() {
                            // add cancel code..
                        },
                        buttonClicked: function(index, element) {
                            $scope.cityssss = element.text.toString();
                            return true;
                        }
                    });
                };
            }
        */

        if(recommendImgCount == 1) {

            // @路线数据 数组，展现在路线选择的弹窗中 
            $rootScope.roadLineData = [];

            // @搜索关键字 wechat/product/queryProductKeywords
            $myHttpService.postNoLoad('api/product/queryProductKeywords', {}, function(data) {
                
                console.log("首页：搜索关键字API返回的数据");
                console.log(data);

                if(data.products != null && data.products.length != 0) {
                    $rootScope.roadLineData = data.products;
                    console.log("首页：路线数据数组");
                    console.log($rootScope.roadLineData);
                }

            }, errorFn);

            $rootScope.isSelectedRoadLine = ""; // @把用户点击的 某一条线路 存在这里
            $rootScope.isSelectedRoadLineBoolean = true; // @是否选择路线，控制“主题/路线/目的地”等字段的显示状态，true为显示，false不显示
            $rootScope.isSearchBtnDisabled = true; // @是否开启搜索按钮的可点击状态，true 不开启（默认、初始），false开启

        }

        // 选择路线的自定义弹窗
        $scope.modal = $ionicModal.fromTemplate('<ion-modal-view>'+
            '	  '+
            '        <ion-header-bar class="bar bar-header modal-one" style="margin-top: 35%;box-shadow: none;" >'+
            '		'+
        //    '		   <button class="button  button-balanced" ng-click="chooseScenicSpotTicket()" style="background: rgba(240, 248, 255, 0.09);color: #676464;">取消</button>'+
            '          <h1 class="title" style="font-weight: normal;color: #525151;"> 线路选择 </h1>'+
            '          <button class="button button-balanced" ng-click="modal.hide()" style="background: rgba(240, 248, 255, 0.09);color: rgba(103, 100, 100, 0.67);">取消</button>'+
            '		  '+
            '        </ion-header-bar>'+
            '		'+
            '        <ion-content class="padding" style="background: #ffffff;margin-top: 35%;" >'+
        //    '		    <p style="text-align:center;font-size: 20px;"><span>{{ticketInfo.viewName}}</span></p>	'+
            '			<button class="button button-outline button-dark" style="min-width: 0;min-height: 0;height: 42px;margin: 2px 4px 15px 8px;font-size: 14px;padding: 0px 7px;" ng-repeat="item in roadLineData track by $index" ng-click="selectedRoadLine(item.viewaddress)">{{item.viewaddress}}</button> '+
            '			'+
            '        </ion-content>'+
            '		'+
            '      </ion-modal-view>', {
            scope: $scope,
            animation: 'slide-in-up'
        });
            
        // @打开路线选择弹窗
        $scope.openRoadLine = function() {

            $scope.modal.show();

        }

        // @给每个路线选择弹窗中的路线绑定的事件函数
        $scope.selectedRoadLine = function(item) { 

            $rootScope.isSelectedRoadLineBoolean = false; // @隐藏“主题/路线/目的地”等字段

            $rootScope.isSearchBtnDisabled = false; // @开启搜索按钮的启用状态

            console.log("首页：用户当前点击选择的路线");
            console.log(item);

            $rootScope.isSelectedRoadLine = item;
            $scope.modal.hide();

        }

        // @时间选择的默认操作
        if(sessionStorage.getItem('jqztc_search_time') != null) {

            var tempTime = sessionStorage.getItem('jqztc_search_time');

        } else {

            var tempTime = new Date();

        }

        $scope.goDate = {
            time: tempTime // @赋予默认的时间，或者当前时间，或者用户选择的时间
        };

        var compareTime = new Date().getTime() + (60 * 86400000); // @60天时间的时间段，用来比较的

        $scope.openDatePicker = function (val) {

            var ipObj1 = {
              callback: function (val) {  // @必选
                var val2 = new Date(val);
                var val3 = $filter('date')(val2, 'yyyy-MM-dd');
                $scope.goDate.time = new Date(val);
              },
              titleLabel: '选择日期',
              closeLabel: '返回',
              from: new Date(),
              to: new Date(compareTime), // @11对应十二月，差1
              dateFormat: 'yyyy-MM-dd', // @可选
              closeOnSelect: true, // @可选,设置选择日期后是否要关掉界面。呵呵，原本是false。
              inputDate: new Date(),
              templateType: 'modal'
            };
            ionicDatePicker.openDatePicker(ipObj1);

        }

        // @点击搜索的同时，需要把数据传递到下一个tabs页面
        $scope.goTabs = function() {

            // 封装参数
            var data = {
                input: $rootScope.isSelectedRoadLine, // 路线
                date: $filter('date')($scope.goDate.time, 'yyyy-MM-dd') // 时间
            };

            console.log("首页：打印搜索按钮传递到产品页的参数");
            console.log(data);

            sessionStorage.setItem('jqztc_search_time', data.date);

            $state.go('tabs', {data: JSON.stringify(data)}, {reload: true});

        }

    })

    /**
     * @产品页  路线 点评 控制器
     */
    .controller('Tabs', function($rootScope, $scope, $state, $timeout,  $myHttpService, $myLocationService, $filter, ionicDatePicker, $ionicModal) {

        $scope.ticketsInfo1 = ''; // @图片推荐产品 数据
        $scope.ticketsInfo2 = []; // @手动搜索产品 数据
        $scope.commentsInfo = []; // @点评 数据
        $scope.paramsProductId = ''; // @产品ID，查询评论用
        $scope.sourceComeType = ''; // @类型来源判断，true：图片推荐接口来的；false：手动搜索接口来的
        $rootScope.currentSelectedDate = null;

        // @Mock数据 接口 api/product/queryProductList
        /* $scope.ticketsInfoMock = [
            {
                "viewName": "黔灵山公园",
                "productid": "1234567890",
                "productType": 0,
                "viewid": "4396",
                "haveTicket": 1,
                "departtime": "8:00",
                "backDeparttime": "8:00",
                "drivetime": 30,
                "leftTickets": 30,
                "totalTickets": 60,
                "departaddr": "贵州饭店北京路66号",
                "arriveaddr": "黔灵山东门客车站",
                "departName": "贵州饭店",
                "arriveName": "黔灵山公园",
                "viewPrices": [
                    {
                        "viewPriceId": "43962",
                        "viewCoupon": 8.8,
                        "viewPrice": 5.0,
                        "viewPriceType": "儿童票",
                        "couponPrice": 4.4,
                    },
                    {
                        "viewPriceId": "43963",
                        "viewCoupon": 8.8,
                        "viewPrice": 10.0,
                        "viewPriceType": "成人票",
                        "couponPrice": 8.8,
                    }
                ],
                "gobdid": "4396",
                "departdate": "2017-10-30",
                "productPrice": 29.50,
            },
            {
                "viewName": "黔灵山公园",
                "productid": "1234567890",
                "productType": 1,
                "viewid": "4396",
                "haveTicket": 1,
                "departtime": "8:00",
                "backDeparttime": "16:00",
                "drivetime": 30,
                "leftTickets": 30,
                "totalTickets": 60,
                "departaddr": "贵州饭店北京路66号",
                "arriveaddr": "黔灵山东门客车站",
                "departName": "贵州饭店",
                "arriveName": "黔灵山公园",
                "viewPrices": [
                    {
                        "viewPriceId": "43962",
                        "viewCoupon": 8.8,
                        "viewPrice": 5.0,
                        "viewPriceType": "儿童票",
                        "couponPrice": 4.4,
                    },
                    {
                        "viewPriceId": "43963",
                        "viewCoupon": 8.8,
                        "viewPrice": 10.0,
                        "viewPriceType": "成人票",
                        "couponPrice": 8.8,
                    }
                ],
                "gobdid": "4396",
                "backbdid": "43961",
                "departdate": "2017-10-30",
                "productPrice": 29.50,
            }
        ]; */

        // @接收 首页 传递过来的参数，并解析
        var paramsData = JSON.parse($state.params.data);

        if(paramsData != null) { // @进入产品页 有参数时

            if(paramsData.hasOwnProperty('productid')) { // @一、图片推荐类型的产品列表

                $scope.sourceComeType = true; // @类型来源 判断

                sessionStorage.setItem('jqztc_cpy_requestUrlType', '0'); // @类型来源 判断 存储数据，以便后用

                sessionStorage.setItem('jqztc_cpy_paramsProductId', paramsData.productid); // @给没有参数进入产品页时使用 存储数据，以便后用

                $scope.paramsProductId = paramsData.productid;  // @产品ID，查询评论用

                console.log("产品页：图片推荐类型流程，有参数，productid");

                var requestData = {
                    productid: paramsData.productid,
                    departDate: $filter('date')(new Date(), 'yyyy-MM-dd')
                };

                // @图片推荐类型产品列表 /web/product/queryProduct
                $myHttpService.post('api/product/queryProduct', requestData, function(data) {

                    console.log("产品页：图片推荐产品列表API返回的数据");
                    console.log(data);

                    $scope.ticketsInfo1 = data.product; // @产品对象
                    
                    storageData('jqztc_cpy_ticketsInfo1', $scope.ticketsInfo1); // @存储数据，以便后用 

                    if($scope.ticketsInfo1 != null) {
                        
                        if($scope.ticketsInfo1.plans != null) { // @产品 有车票时
                            
                            $scope.ticketsInfo1_havePlans = true; // @有无车票
    
                            $scope.ticketsInfo1_prodcutType = $scope.ticketsInfo1.productType.split("&"); // @产品类型
                            $scope.ticketsInfo1_prodcutType2 = $scope.ticketsInfo1.productType.replace("&", "+"); // @产品类型
    
                            $scope.ticketsInfo1_station = $scope.ticketsInfo1.plans[0].linename.split("-"); // @出发/返回 站点名
    
                            if($scope.ticketsInfo1.plans[0].bdidType == 0) { // @单程票
    
                                $scope.ticketsInfo1_plansType = true; // @车票类型
    
                                $scope.ticketsInfo1_departAddr = $scope.ticketsInfo1.plans[0].departaddr; // @出发发车地址
                                $scope.ticketsInfo1_driveTime = $scope.ticketsInfo1.plans[0].drivetime; // @行程时间
                                
                            } else { // @往返票
                                
                                $scope.ticketsInfo1_plansType = false; // @车票类型
                                $scope.ticketsInfo1_departAddr = $scope.ticketsInfo1.plans[0].departaddr; // @出发发车地址
                                $scope.ticketsInfo1_arriveAddr = $scope.ticketsInfo1.plans[1].departaddr; // @返回发车地址
                                $scope.ticketsInfo1_driveTime = $scope.ticketsInfo1.plans[0].drivetime; // @行程时间
    
                            }
    
                        } else { // @产品 无车票时
    
                            $scope.ticketsInfo1_havePlans = false;
    
                            if($scope.ticketsInfo1.viewInfo != null) { // @单独的门票
    
                                $scope.ticketsInfo1_viewName = $scope.ticketsInfo1.viewInfo.viewName; // @景点名字
                                $scope.ticketsInfo1_viewAddr = $scope.ticketsInfo1.viewInfo.viewaddr; // @景点地址
    
                            } 
    
                        }

                    } else {

                        layer.open({
                            content: '客官，您当前选择的推荐主题路线已售完，请返回进行主题线路搜索 (╯-╰)',
                            btn: '确定',
                            shadeClose: false,
                            yes: function(index) {
                                layer.closeAll();
                                $timeout(function() {
                                    window.history.back();
                                    return false;
                                }, 250)
                            }
                        });

                    }

                }, errorFn);
                
            } else { // @二、手动搜索类型的产品列表

                $scope.sourceComeType = false; // @数据来源 判断

                sessionStorage.setItem('jqztc_cpy_requestUrlType', '1'); // @数据来源 判断 存储数据，以便后用

                sessionStorage.setItem('tabsParamsDataInput', paramsData.input); // @存储数据，以便后用
                sessionStorage.setItem('tabsParamsDataDate', paramsData.date); // @存储数据，以便后用
                
                $rootScope.currentSelectedDate = paramsData.date; // @参数接收 日期数据
                $rootScope.currentSelectedRoadLine = paramsData.input; // @参数接收 线路选择数据
                
                var requestData = { // @请求参数封装
                    keyword: paramsData.input,
                    departDate: paramsData.date
                };

                // @手动搜索类型的产品列表 wechat/product/queryProductList
                $myHttpService.post('api/product/queryProductList', requestData, function(data) {

                    console.log("产品页：手动搜索类型的产品列表API返回的数据");
                    console.log(data);

                    $scope.ticketsInfo2 = data.products;

                    storageData('jqztc_cpy_ticketsInfo2', $scope.ticketsInfo2); // @存储数据，以便后用

                    if($scope.ticketsInfo2.length != 0) {

                        $scope.paramsProductId = $scope.ticketsInfo2[0].productid;  // @产品ID，查询评论用
                        
                    } else {

                        layer.open({
                            content: '客官，没有找到相关产品信息，请重新搜索 (╯-╰)',
                            btn: '确定',
                            yes: function(index){
                                $timeout(function() {
                                    window.history.back();
                                    return false;
                                }, 250)
                                layer.closeAll();
                            }
                        });

                    }

                }, errorFn);

            }

        } else { // @进入产品页 没有参数时

            if(sessionStorage.getItem('jqztc_cpy_requestUrlType') == '0') {  // @一、图片推荐类型的产品列表
 
                $scope.sourceComeType = true; // @来源类型 判断

                $scope.paramsProductId = sessionStorage.getItem('jqztc_cpy_paramsProductId'); // @产品ID，查询评论用


                $scope.ticketsInfo1 = getStorageData('jqztc_cpy_ticketsInfo1'); // @获取数据

                if($scope.ticketsInfo1 != null) {
                    
                    if($scope.ticketsInfo1.plans != null) { // @产品 有车票时
                        
                        $scope.ticketsInfo1_havePlans = true; // @有无车票

                        $scope.ticketsInfo1_prodcutType = $scope.ticketsInfo1.productType.split("&"); // @产品类型
                        $scope.ticketsInfo1_prodcutType2 = $scope.ticketsInfo1.productType.replace("&", "+"); // @产品类型

                        $scope.ticketsInfo1_station = $scope.ticketsInfo1.plans[0].linename.split("-"); // @出发/返回 站点名

                        if($scope.ticketsInfo1.plans[0].bdidType == 0) { // @单程票

                            $scope.ticketsInfo1_plansType = true; // @车票类型

                            $scope.ticketsInfo1_departAddr = $scope.ticketsInfo1.plans[0].departaddr; // @出发发车地址
                            $scope.ticketsInfo1_driveTime = $scope.ticketsInfo1.plans[0].drivetime; // @行程时间
                            
                        } else { // @往返票
                            
                            $scope.ticketsInfo1_plansType = false; // @车票类型
                            $scope.ticketsInfo1_departAddr = $scope.ticketsInfo1.plans[0].departaddr; // @出发发车地址
                            $scope.ticketsInfo1_arriveAddr = $scope.ticketsInfo1.plans[1].departaddr; // @返回发车地址
                            $scope.ticketsInfo1_driveTime = $scope.ticketsInfo1.plans[0].drivetime; // @行程时间

                        }

                    } else { // @产品 无车票时

                        $scope.ticketsInfo1_havePlans = false;

                        if($scope.ticketsInfo1.viewInfo != null) { // @单独的门票

                            $scope.ticketsInfo1_viewName = $scope.ticketsInfo1.viewInfo.viewName; // @景点名字
                            $scope.ticketsInfo1_viewAddr = $scope.ticketsInfo1.viewInfo.viewaddr; // @景点地址

                        } 

                    }

                } else {

                    layer.open({
                        content: '客官，您当前选择的推荐主题路线已售完，请返回进行主题线路搜索 (╯-╰)',
                        btn: '确定',
                        shadeClose: false,
                        yes: function(index) {
                            layer.closeAll();
                            $timeout(function() {
                                window.history.back();
                                return false;
                            }, 250)
                        }
                    });

                }
                
            } else if(sessionStorage.getItem('jqztc_cpy_requestUrlType') == '1') {  // @二、手动搜索类型的产品列表

                $scope.sourceComeType = false; // @来源类型 判断

                $rootScope.currentSelectedDate = sessionStorage.getItem('tabsParamsDataDate');
                $rootScope.currentSelectedRoadLine = sessionStorage.getItem('tabsParamsDataInput');

                $scope.ticketsInfo2 = getStorageData('jqztc_cpy_ticketsInfo2'); // @获取数据

                if($scope.ticketsInfo2.length != 0) {
                    
                    $scope.paramsProductId = $scope.ticketsInfo2[0].productid;  // @产品ID，查询评论用

                } else {
                    layer.open({
                        content: '客官，没有找到相关产品信息，请重新搜索 (╯-╰)',
                        btn: '确定'
                    });
                }

            } else {
                $state.go('search');
            }
        }

        // @购买按钮函数 传递参数
        $scope.purchase = function(item, i) {

            console.log("产品页：点击购买按钮传递的参数");
            console.log(item);
            $state.go('order_confirm_pay', {data: JSON.stringify(item)});

        };

        var check_click_count = 0; // @检测 产品tab 的点击次数
        var check_click_count2 = 0; // @检测 点评tab 的点击次数

        // @产品 信息 tab函数
        $scope.tab_road = function() {

            if(check_click_count < 1) {
                console.log('产品tab');
            }
            check_click_count++;

        }

        // @点评 信息 tab函数
        $scope.tab_comment = function() {

            if(check_click_count2 < 1) {
                console.log('点评tab');
            }
            check_click_count2++;

        }

        // @产品信息 下拉刷新
        /*
            $scope.doRefreshRoad = function() {
                if(paramsData != null) {

                    if(sessionStorage.getItem('jqztc_cpy_requestUrlType') == '0') { // @一、图片推荐类型的产品列表

                        console.log("1111");
                        var requestData = {
                            productid: paramsData.productid
                        };
                        // 图片推荐类型产品列表 /web/product/queryProduct
                        $myHttpService.postNoLoad('api/product/queryRecommendProduct', requestData, function(data){
                            console.log(data);
                            $scope.ticketsInfo = data.products;
                            $scope.$broadcast('scroll.refreshComplete');
                            layer.open({
                                content: '刷新成功',
                                skin: 'msg',
                                time: 1
                            });
                        }, function() {
                            $scope.$broadcast('scroll.refreshComplete');                        
                        });

                    } else if(sessionStorage.getItem('jqztc_cpy_requestUrlType') == '1') { // @二、手动搜索类型的产品列表
                        
                        var requestData = {
                            keyword: $rootScope.currentSelectedRoadLine,
                            departDate: $rootScope.currentSelectedDate,
                            region: $rootScope.currentSelectedCity
                        };
                        console.log(requestData);

                        $myHttpService.postNoLoad('api/product/queryProductList', requestData, function(data){
                            console.log(data);
                            $scope.ticketsInfo = data.products;
                            $scope.$broadcast('scroll.refreshComplete');
                            layer.open({
                                content: '刷新成功',
                                skin: 'msg',
                                time: 1
                            });
                        }, function() {
                            $scope.$broadcast('scroll.refreshComplete');                        
                        });
                    }

                } else {

                    if(sessionStorage.getItem('jqztc_cpy_requestUrlType') == '0') {
                            
                        var requestData = {
                            productid: sessionStorage.getItem('jqztc_cpy_paramsProductId')
                        };
                        $myHttpService.postNoLoad('api/product/queryRecommendProduct', requestData, function(data){
                            console.log(data);
                            $scope.ticketsInfo = data.products;
                            $scope.$broadcast('scroll.refreshComplete');
                            layer.open({
                                content: '刷新成功',
                                skin: 'msg',
                                time: 1
                            });
                        }, function() {
                            $scope.$broadcast('scroll.refreshComplete');                        
                        });
                                            
                    } else if(sessionStorage.getItem('jqztc_cpy_requestUrlType') == '1') {

                        var requestData = {
                            keyword: $rootScope.currentSelectedRoadLine,
                            departDate: $rootScope.currentSelectedDate,
                            region: $rootScope.currentSelectedCity
                        };
                        console.log(requestData);

                        $myHttpService.postNoLoad('api/product/queryProductList', requestData, function(data){
                            console.log(data);
                            $scope.ticketsInfo = data.products;
                            $scope.$broadcast('scroll.refreshComplete');
                            layer.open({
                                content: '刷新成功',
                                skin: 'msg',
                                time: 1
                            });
                        }, function() {
                            $scope.$broadcast('scroll.refreshComplete');                        
                        });
                    }
                }
            };
        */

        // @点评信息 下拉刷新
        $scope.isNoComment = false;
        $scope.pageCount = 1;
        $scope.doRefreshComment = function() {

            console.log("产品页：doRefreshComment已执行");
            
            // var productid = $scope.paramsProductId;
            $scope.pageCount = 1;

            // @产品评价wechat/product/queryProductHieList
            $myHttpService.postNoLoad('api/product/queryProductHieList', {
                // productid: productid,
                offset: '0',
                pagesize: '10'
            }, function(data) {
                console.log("产品页：产品评价API返回的数据(下拉刷新)");
                console.log(data);
                $scope.commentsInfo = data.buslineHierarchys;
                $scope.$broadcast('scroll.refreshComplete');
                if($scope.commentsInfo.length == 0) {
                    $scope.isNoComment = true;
                } else {
                    $scope.isNoComment = false;
                    layer.open({
                        content: '刷新成功',
                        skin: 'msg',
                        time: 1
                    });
                }
            });

        };

        // @点评信息 上拉加载
        $scope.hasmore = true;
        var run = false;
        $scope.loadMoreComment = function() {

            console.log("产品页：loadMoreComment已执行");
            // if($scope.ticketsInfo.length == 0) {
            //     $scope.isNoComment = true;
            //     return;
            // }
            // var productid = $scope.paramsProductId;
            var offset = ($scope.pageCount - 1) * 10;
            var requestData = {
                // productid: productid,
                offset: offset,
                pagesize: '10'
            };

            if(!run) {
                run = true;
                // @产品评价wechat/product/queryProductHieList
                $myHttpService.post('api/product/queryProductHieList', requestData, function(data) {

                    console.log("产品页：产品评价API返回的数据(上拉加载)");
                    console.log(data);
                    if (data.buslineHierarchys.length < 10) { 
                        $scope.hasmore = false; // @这里判断是否还能获取到数据，如果没有获取数据，则不再触发加载事件 
                    } 
                    $scope.pageCount++; 
                    console.log("计数： " + $scope.pageCount);
                    run = false;
                    console.log("评论加载");
                    $scope.commentsInfo = $scope.commentsInfo.concat(data.buslineHierarchys);
                    console.log($scope.commentsInfo);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    if($scope.commentsInfo.length == 0) {
                        $scope.isNoComment = true;
                    }

                });
            }
        }

        // @评论的星星 调用了Star的指令，这里相关是配置的信息
        $scope.max = 5; // @星星数量
        $scope.readonly = true; // @是否可读，此处为可读
        $scope.onHover = function(val){};
        $scope.onLeave = function(){};

    })

    /**
     * @订单页 确认、支付 控制器
     */ 
    .controller('order_confirm_pay', function($rootScope, $filter, $scope, $state, $myHttpService, $interval, $ionicModal, ionicDatePicker) {

        if(JSON.parse($state.params.data) == null) { // @访问此订单页时，如果没有传递过来参数那么将直接倒退2个页面

            window.history.go(-2); // @倒退回到首页，此动作不可逆
            return false; // @兼容处理

        } 
        
        // @访问订单页时，有参数的情况，走正常流程

        $scope.floatObj = floatObj; // @票价处理的运算对象

        $scope.dataContainer = { // @数据容器
            phone: "", // @用户电话
            verificationCode: "", // @验证码
            coupon: false, // @是否使用优惠券
            count: 1
        };

        $scope.sumPrice = 0; // @产品总价
        $scope.ticketSumPrice = 0; // @车票总价
        $scope.ticketSumPrice_forwardTicket = 0;  // @去程车票总价
        $scope.ticketSumPrice_backwardTicket = 0;  // @返程车票总价
        $scope.ticketViewSumPrice = 0; // @门票总价
        $scope.coupon = 0; // @优惠总价

        $rootScope.customerPhone = "18302505303"; // @客服电话

        $scope.againObtainCheckCode = false; // @显示重新获取验证码的提示

        $scope.currentSelectedDateOrTime = sessionStorage.getItem('tabsParamsDataDate'); // @唯一的当前选择的时间
        if($scope.currentSelectedDateOrTime == null) {
            $scope.currentSelectedDateOrTime = $filter('date')(new Date(), 'yyyy-MM-dd');
        }
        $scope.currentSelectedDateOrTime2 = "周" + "日一二三四五六".charAt(new Date($scope.currentSelectedDateOrTime).getDay()); // @周几

        var paramsData = JSON.parse($state.params.data); // @解析传递过来的参数

        console.log("订单页：传递到订单页的参数");
        console.log(paramsData);

        $scope.ticketInfo = paramsData; // @产品对象

        $scope.paramsProductid = $scope.ticketInfo.productid; // @产品ID
        
        $scope.checkPhoneState = false; // 检测电话号码是否正确
        $scope.verificationCodeBtnDisabled = true; // 控制获取验证码按钮的状态
        $scope.verificationCodeInputDisabled = true; // 控制验证码输入框的状态
        $scope.payBtnDisabled = true; // 控制确认支付按钮的状态
        $scope.countdownTxtShow = false; // 控制倒计时文本的状态

        $scope.couponBtnState = false; // 控制优惠券的状态
        $scope.couponTxTShow = false; // 控制优惠券文本的状态


        // ************************************************************************************************
        

        if($scope.ticketInfo.plans != null) { // @检测产品对象 是否有车票
            
            $scope.ticketInfo_Ticket_tempRequestParamArr = []; // @临时的车票 请求参数数组            

            if($scope.ticketInfo.plans[0] != null) { // @去程票 类型

                $scope.ticketInfo_forwardTicket_haveChoosed = false; // @控制选择出发时间时的 样式表现

                // @去程车票出发时间弹窗对象
                $scope.ticketInfo_forwardTicket_chooseTime_Modal = $ionicModal.fromTemplate('<ion-modal-view>'+
                    '	  '+
                    '        <ion-header-bar class="bar bar-header modal-two" >'+
                    '		'+
                    '		   <button class="button  button-balanced" ng-click="ticketInfo_forwardTicket_chooseTime_OKFn()" style="background: rgba(240, 248, 255, 0.09);color: #676464;">取消</button>'+
                    '          <h1 class="title" style="color: black;font-size: 17px;font-weight: 400;">请选择行程时间</h1>'+
                    '          <button class="button button-balanced" ng-click="ticketInfo_forwardTicket_chooseTime_OKFn()" style="background: rgba(240, 248, 255, 0.09);color: #676464;">确定</button>'+
                    '		'+
                    '        </ion-header-bar>'+
                    '		'+
                    '        <ion-content class="padding" style="background: #ffffff;margin-top: 300px;" >'+
                    // '		    <p style="text-align:center;font-size: 20px;"><span>{{ticketInfo.viewName}}</span></p>	'+
                    '			<ion-radio style="padding: 15px 10px;border: none;font-size: 17px;" ng-repeat="item in ticketInfo_forwardTicket_arr"'+
                    '               ng-value="item.bdid"'+
                    '               ng-model="ticketInfo_forwardTicket_timeType.type">'+
                    '      			{{ item.departTime }} <span style="margin-left: 5px;color: #a2a2a2;font-size: 14px;" >剩<span style="color: #DF6A0D;">{{ item.leftTickets }}</span>座/{{ item. totalTickets}}座</span> '+
                    '    		</ion-radio>'+
                    '			'+
                    '        </ion-content>'+
                    '		'+
                    '      </ion-modal-view>', {
                    scope: $scope,
                    animation: 'slide-in-up'
                });

                $scope.ticketInfo_forwardTicket_count = 1; // @去程车票数
                $scope.ticketInfo_forwardTicket_price = 0; // @去程车票价格

                $scope.ticketInfo_forwardTicket_bpid = $scope.ticketInfo.plans[0].bpid; // @去程票 线路ID
                
                $scope.ticketInfo_forwardTicket_selectGoTime_Fn = function() { // @去程票选择出发时间函数

                    $scope.ticketInfo_forwardTicket_haveChoosed = false; // @控制选择出发时间时的 样式表现
                
                    // @$filter('date')($scope.currentSelectedDateOrTime, 'yyyy-MM-dd')
                    var requestData = { // @参数封装
                        departDate: $filter('date')($scope.currentSelectedDateOrTime, 'yyyy-MM-dd'),
                        bpid: $scope.ticketInfo_forwardTicket_bpid
                    };

                    console.log(requestData);

                    // @排班出发时间查询 webchat/product/queryBuslineScheduleDetailsByBpid
                    $myHttpService.post('api/product/queryBuslineScheduleDetailsByBpid', requestData, function(data) {
                        
                        console.log("订单页：排班出发时间查询API返回的数据");
                        console.log(data);

                        $scope.ticketInfo_forwardTicket_arr = data.details; // @去程车票详情数组

                        if($scope.ticketInfo_forwardTicket_arr.length != 0) {

                            $scope.ticketInfo_forwardTicket_timeType = { // @去程票的时间类型
                                type:  $scope.ticketInfo_forwardTicket_arr[0].bdid // @指定数组的第一个为 默认类型
                            };

                            $scope.ticketInfo_forwardTicket_chooseTime_Modal.show(); // @弹窗显示

                        } else {

                            layer.open({
                                content: '客官，当前日期没有相关的车辆班次信息，请您重新选择日期 (╯-╰)',
                                btn: '确定'
                            });

                        }

                    }, errorFn);

                };

                $scope.ticketInfo_forwardTicket_chooseTime_OKFn = function() { // @出发时间弹窗中的确定、取消函数


                    for(var item in $scope.ticketInfo_forwardTicket_arr) {

                        var objTemp = $scope.ticketInfo_forwardTicket_arr[item];

                        if(objTemp.bdid == $scope.ticketInfo_forwardTicket_timeType.type) {

                            $scope.ticketInfo_forwardTicket_price = objTemp.price; // 找出用户选择的相应出发时间的车票价格
                            $scope.ticketInfo_forwardTicket_time = objTemp.departTime; // 找出用户选择的相应出发时间的车票出发时间
                            $scope.ticketInfo_forwardTicket_leftTickets = objTemp.leftTickets; // 找出用户选择的相应出发时间的车票剩余座位
                            $scope.ticketInfo_forwardTicket_totalTickets = objTemp.totalTickets; // 找出用户选择的相应出发时间的车票总座位
                            $scope.ticketInfo_forwardTicket_bdid = objTemp.bdid; // 找出用户选择的相应出发时间的车票bdid
                            
                        }
                    }

                    // $scope.ticketInfo_forwardTicket_count = 0; // @去程车票数量 清零

                    $scope.ticketInfo_forwardTicket_chooseTime_Modal.hide(); // @弹窗关闭                   

                    $scope.ticketInfo_forwardTicket_haveChoosed = true; // @控制选择出发时间时的 样式表现    
                    
                    // @去程车票票价计算

                    $scope.ticketSumPrice_forwardTicket = 0;  // @去程车票总价 清零，重新计算

                    $scope.ticketSumPrice_forwardTicket = $scope.floatObj.multiply($scope.ticketInfo_forwardTicket_price, $scope.ticketInfo_forwardTicket_count, 2); // @当前选择车票的总价

                    console.log("订单页：去程车票总价");
                    console.log($scope.ticketSumPrice_forwardTicket);

                    $scope.ticketInfo_Ticket_tempRequestParamArr[0] = [
                        $scope.ticketInfo_forwardTicket_bdid,
                        $scope.ticketInfo_forwardTicket_count
                    ]; 

                    console.log("订单页：车票参数数组");
                    console.log($scope.ticketInfo_Ticket_tempRequestParamArr);
                    
                }

                // @去程车票 票数增加 函数
                $scope.ticketInfo_forwardTicket_incr = function() {

                    if( $scope.ticketInfo_forwardTicket_count <= $scope.ticketInfo_forwardTicket_leftTickets ) {

                        $scope.ticketInfo_forwardTicket_count += 1;

                        var tempPrice = $scope.floatObj.multiply($scope.ticketInfo_forwardTicket_price, 1, 2);

                        $scope.ticketSumPrice_forwardTicket = $scope.floatObj.add($scope.ticketSumPrice_forwardTicket, tempPrice, 2);

                        console.log("订单页：去程车票总价");
                        console.log($scope.ticketSumPrice_forwardTicket);

                        $scope.ticketInfo_Ticket_tempRequestParamArr[0][1] = $scope.ticketInfo_forwardTicket_count;

                        console.log("订单页：车票参数数组");
                        console.log($scope.ticketInfo_Ticket_tempRequestParamArr);

                    } else {

                        layer.open({
                            content: '当前班次余票为: ' + $scope.ticketInfo_forwardTicket_count,
                            btn: '确定'
                        });

                    }
                }

                // @去程车票 票数减少 函数
                $scope.ticketInfo_forwardTicket_decr = function() {

                    if($scope.ticketInfo_forwardTicket_count >= 1) { // @只有当数量大于或者等于1的时候才可以减

                        $scope.ticketInfo_forwardTicket_count -= 1;

                        var tempPrice = $scope.floatObj.multiply($scope.ticketInfo_forwardTicket_price, 1, 2);
                        
                        $scope.ticketSumPrice_forwardTicket = $scope.floatObj.subtract($scope.ticketSumPrice_forwardTicket, tempPrice, 2);

                        console.log("订单页：去程车票总价");
                        console.log($scope.ticketSumPrice_forwardTicket);

                        $scope.ticketInfo_Ticket_tempRequestParamArr[0][1] = $scope.ticketInfo_forwardTicket_count;

                        console.log("订单页：车票参数数组");
                        console.log($scope.ticketInfo_Ticket_tempRequestParamArr);

                    }
                }

                $scope.$on('$destroy', function() { // @销毁工作
                    $scope.ticketInfo_forwardTicket_chooseTime_Modal.remove(); // @弹窗销毁
                });

            } 

            if($scope.ticketInfo.plans[1] != null) { // @反程票 类型
                
                $scope.ticketInfo_backwardTicket_haveChoosed = false; // @控制选择出发时间时的 样式表现

                // @返程车票出发时间弹窗对象
                $scope.ticketInfo_backwardTicket_chooseTime_Modal = $ionicModal.fromTemplate('<ion-modal-view>'+
                    '	  '+
                    '        <ion-header-bar class="bar bar-header modal-two" >'+
                    '		'+
                    '		   <button class="button  button-balanced" ng-click="ticketInfo_backwardTicket_chooseTime_OKFn()" style="background: rgba(240, 248, 255, 0.09);color: #676464;">取消</button>'+
                    '          <h1 class="title" style="color: black;font-size: 17px;font-weight: 400;">请选择行程时间</h1>'+
                    '          <button class="button button-balanced" ng-click="ticketInfo_backwardTicket_chooseTime_OKFn()" style="background: rgba(240, 248, 255, 0.09);color: #676464;">确定</button>'+
                    '		'+
                    '        </ion-header-bar>'+
                    '		'+
                    '        <ion-content class="padding" style="background: #ffffff;margin-top: 300px;" >'+
                    // '		    <p style="text-align:center;font-size: 20px;"><span>{{ticketInfo.viewName}}</span></p>	'+
                    '			<ion-radio style="padding: 15px 10px;border: none;font-size: 17px;" ng-repeat="item in ticketInfo_backwardTicket_arr"'+
                    '               ng-value="item.bdid"'+
                    '               ng-model="ticketInfo_backwardTicket_timeType.type">'+
                    '      			{{ item.departTime }} <span style="margin-left: 5px;color: #a2a2a2;font-size: 14px;">剩<span style="color: #DF6A0D;">{{ item.leftTickets }}</span>座/{{ item. totalTickets}}座</span> '+
                    '    		</ion-radio>'+
                    '			'+
                    '        </ion-content>'+
                    '		'+
                    '      </ion-modal-view>', {
                    scope: $scope,
                    animation: 'slide-in-up'
                });

                
                $scope.ticketInfo_backwardTicket_count = 1; // @返程车票数
                $scope.ticketInfo_backwardTicket_price = 0; // @返程车票价格

                $scope.ticketInfo_backwardTicket_bpid = $scope.ticketInfo.plans[1].bpid; // @返程票 线路ID
                
                $scope.ticketInfo_backwardTicket_selectGoTime_Fn = function() { // @返程票选择出发时间函数

                    $scope.ticketInfo_backwardTicket_haveChoosed = false; // @控制选择出发时间时的 样式表现
                
                    // @$filter('date')($scope.currentSelectedDateOrTime, 'yyyy-MM-dd')
                    var requestData = { // @参数封装
                        departDate: $filter('date')($scope.currentSelectedDateOrTime, 'yyyy-MM-dd'),
                        bpid: $scope.ticketInfo_backwardTicket_bpid
                    };

                    console.log(requestData);

                    // @排班出发时间查询 webchat/product/queryBuslineScheduleDetailsByBpid
                    $myHttpService.post('api/product/queryBuslineScheduleDetailsByBpid', requestData, function(data) {
                        
                        console.log("订单页：排班出发时间查询API返回的数据");
                        console.log(data);

                        $scope.ticketInfo_backwardTicket_arr = data.details; // @返程车票详情数组

                        if($scope.ticketInfo_backwardTicket_arr.length != 0) {

                            $scope.ticketInfo_backwardTicket_timeType = { // @返程票的时间类型
                                type:  $scope.ticketInfo_backwardTicket_arr[0].bdid // @指定数组的第一个为 默认类型
                            };

                            $scope.ticketInfo_backwardTicket_chooseTime_Modal.show(); // @弹窗显示

                        } else {

                            layer.open({
                                content: '客官，当前日期没有相关的车辆班次信息，请您重新选择日期 (╯-╰)',
                                btn: '确定'
                            });

                        }

                    }, errorFn);

                };

                $scope.ticketInfo_backwardTicket_chooseTime_OKFn = function() { // @出发时间弹窗中的确定、取消函数


                    for(var item in $scope.ticketInfo_backwardTicket_arr) {

                        var objTemp = $scope.ticketInfo_backwardTicket_arr[item];

                        if(objTemp.bdid == $scope.ticketInfo_backwardTicket_timeType.type) {

                            $scope.ticketInfo_backwardTicket_price = objTemp.price; // 找出用户选择的相应出发时间的车票价格
                            $scope.ticketInfo_backwardTicket_time = objTemp.departTime; // 找出用户选择的相应出发时间的车票出发时间
                            $scope.ticketInfo_backwardTicket_leftTickets = objTemp.leftTickets; // 找出用户选择的相应出发时间的车票剩余座位
                            $scope.ticketInfo_backwardTicket_totalTickets = objTemp.totalTickets; // 找出用户选择的相应出发时间的车票总座位
                            $scope.ticketInfo_backwardTicket_bdid = objTemp.bdid; // 找出用户选择的相应出发时间的车票bdid
                            
                        }
                    }

                    // $scope.ticketInfo_backwardTicket_count = 0; // @返程车票数量 清零

                    $scope.ticketInfo_backwardTicket_chooseTime_Modal.hide(); // @弹窗关闭                   

                    $scope.ticketInfo_backwardTicket_haveChoosed = true; // @控制选择出发时间时的 样式表现    
                    
                    // @返程车票票价计算

                    $scope.ticketSumPrice_backwardTicket = 0;  // @返程车票总价 清零，重新计算

                    $scope.ticketSumPrice_backwardTicket = $scope.floatObj.multiply($scope.ticketInfo_backwardTicket_price, $scope.ticketInfo_backwardTicket_count, 2); // @当前选择车票的总价

                    console.log("订单页：返程车票总价");
                    console.log($scope.ticketSumPrice_backwardTicket);

                    $scope.ticketInfo_Ticket_tempRequestParamArr[1] = [
                        $scope.ticketInfo_backwardTicket_bdid,
                        $scope.ticketInfo_backwardTicket_count
                    ]; 

                    console.log("订单页：车票参数数组");
                    console.log($scope.ticketInfo_Ticket_tempRequestParamArr);
                    
                }

                // @返程车票 票数增加 函数
                $scope.ticketInfo_backwardTicket_incr = function() {

                    if( $scope.ticketInfo_backwardTicket_count <= $scope.ticketInfo_backwardTicket_leftTickets ) {

                        $scope.ticketInfo_backwardTicket_count += 1;

                        var tempPrice = $scope.floatObj.multiply($scope.ticketInfo_backwardTicket_price, 1, 2);

                        $scope.ticketSumPrice_backwardTicket = $scope.floatObj.add($scope.ticketSumPrice_backwardTicket, tempPrice, 2);

                        console.log("订单页：返程车票总价");
                        console.log($scope.ticketSumPrice_backwardTicket);

                        $scope.ticketInfo_Ticket_tempRequestParamArr[1][1] = $scope.ticketInfo_backwardTicket_count;

                        console.log("订单页：车票参数数组");
                        console.log($scope.ticketInfo_Ticket_tempRequestParamArr);

                    } else {

                        layer.open({
                            content: '当前班次余票为: ' + $scope.ticketInfo_backwardTicket_count,
                            btn: '确定'
                        });

                    }
                }

                // @返程车票 票数减少 函数
                $scope.ticketInfo_backwardTicket_decr = function() {

                    if($scope.ticketInfo_backwardTicket_count >= 1) { // @只有当数量大于或者等于1的时候才可以减

                        $scope.ticketInfo_backwardTicket_count -= 1;

                        var tempPrice = $scope.floatObj.multiply($scope.ticketInfo_backwardTicket_price, 1, 2);
                        
                        $scope.ticketSumPrice_backwardTicket = $scope.floatObj.subtract($scope.ticketSumPrice_backwardTicket, tempPrice, 2);

                        console.log("订单页：返程车票总价");
                        console.log($scope.ticketSumPrice_backwardTicket);

                        $scope.ticketInfo_Ticket_tempRequestParamArr[1][1] = $scope.ticketInfo_backwardTicket_count;

                        console.log("订单页：车票参数数组");
                        console.log($scope.ticketInfo_Ticket_tempRequestParamArr);

                    }
                }

                $scope.$on('$destroy', function() { // @销毁工作
                    $scope.ticketInfo_backwardTicket_chooseTime_Modal.remove(); // @弹窗销毁
                });

            } 

        }


        // ************************************************************************************************


        if($scope.ticketInfo.viewInfo != null) { // @检测产品对象 是否有门票

            var len = $scope.ticketInfo.viewInfo.viewPrices.length; // @临时的循环变量

            $scope.ticketInfo_viewInfo_tempRequestParamArr = []; // @临时的门票 请求参数数组

            $scope.ticketInfo_viewInfo_priceStr = ''; // @票价字符串

            for(var index in $scope.ticketInfo.viewInfo.viewPrices) {

                var item = $scope.ticketInfo.viewInfo.viewPrices[index];
                $scope.ticketInfo_viewInfo_priceStr += item.viewPriceType + item.couponPrice + '元 ';

                $scope["ticketInfo_viewInfo_count" + index] = 0; // @动态创建相对应的门票数量 双向绑定变量

            }

            // @门票数量 增加 函数
            $scope.ticket_viewInfo_incr = function(index) {
            
                for(var i = 0; i < len; i++) {
    
                    if(index == i) {
    
                        if($scope["ticketInfo_viewInfo_count" + index] < 99) {
    
                            $scope["ticketInfo_viewInfo_count" + index] += 1;

                            console.log("订单页：相应门票的数量" + $scope["ticketInfo_viewInfo_count" + index]);
    
                            $scope.ticketInfo_viewInfo_tempRequestParamArr[index] = [
                                $scope.ticketInfo.viewInfo.viewPrices[index].viewPriceId,
                                $scope["ticketInfo_viewInfo_count" + index]
                            ];
    
                            var tempPrice = $scope.floatObj.multiply($scope.ticketInfo.viewInfo.viewPrices[index].couponPrice, 1, 2); // @临时的对应门票价格计算
    
                            $scope.ticketViewSumPrice = $scope.floatObj.add($scope.ticketViewSumPrice, tempPrice, 2); // @门票总价计算
    
                            console.log("订单页：门票请求参数数组");
                            console.log($scope.ticketInfo_viewInfo_tempRequestParamArr);
    
                            console.log("订单页：对应的门票价格");
                            console.log(tempPrice);
    
                            console.log("订单页：门票总价");
                            console.log($scope.ticketViewSumPrice);
    
                        }
                    }
                }
            }

            // @门票数量 减少 函数
            $scope.ticket_viewInfo_decr = function(index) {
            
                for(var i = 0; i < len; i++) {
    
                    if(index == i) {
    
                        if($scope["ticketInfo_viewInfo_count" + index] >= 1) {
    
                            $scope["ticketInfo_viewInfo_count" + index] -= 1;
                            console.log("订单页：相应门票的数量" + $scope["ticketInfo_viewInfo_count" + index]);
    
                            $scope.ticketInfo_viewInfo_tempRequestParamArr[index] = [
                                $scope.ticketInfo.viewInfo.viewPrices[index].viewPriceId,
                                $scope["ticketInfo_viewInfo_count" + index]
                            ];
    
                            var tempPrice = $scope.floatObj.multiply($scope.ticketInfo.viewInfo.viewPrices[index].couponPrice, 1, 2); // @临时的对应门票价格计算
    
                            
                            $scope.ticketViewSumPrice = $scope.floatObj.subtract($scope.ticketViewSumPrice, tempPrice, 2); // @门票总价计算

                            console.log("订单页：门票请求参数数组");
                            console.log($scope.ticketInfo_viewInfo_tempRequestParamArr);
    
                            console.log("订单页：对应的门票价格");
                            console.log(tempPrice);
    
                            console.log("订单页：门票总价");
                            console.log($scope.ticketViewSumPrice);
    
                        }
                    }
                }
            }

        }
        

        // ************************************************************************************************


        // @日历选择 $scope.currentSelectedDateOrTime
        
        // @下一天 
        $scope.nextDay = function() {
            
            var nextDayTime = new Date($scope.currentSelectedDateOrTime).getTime() + (1 * 86400000); // @ms
            var temp1 = new Date();
            var temp2 = $filter('date')(temp1, 'yyyy-MM-dd');
            var endTime = new Date(temp2).getTime() + (60 * 86400000);

            if(nextDayTime <= endTime) {

                var temp = new Date(nextDayTime);
                $scope.currentSelectedDateOrTime = $filter('date')(temp, 'yyyy-MM-dd');
                $scope.currentSelectedDateOrTime2 = "周" + "日一二三四五六".charAt(new Date($scope.currentSelectedDateOrTime).getDay());
        

                // @验证码更新
                // @清除掉验证码计时器
                $scope.stopFight(); // @停止计时器
                $scope.resetFight(); // @重置计时器
                $scope.countdownTxtShow = false;

                // @根据验证码按钮之前的状态来设置状态 
                if($scope.verificationCodeBtnDisabled == false) {
                    $scope.verificationCodeBtnDisabled = false; // @启用获取验证码按钮            
                } else {
                    $scope.verificationCodeBtnDisabled = true; // @禁用获取验证码按钮
                }

                $scope.dataContainer.verificationCode = ''; // @清空验证码
                $scope.againObtainCheckCode = true; // @显示重新获取验证码的提示
                $scope.payBtnDisabled = true; // @禁用确认支付按钮

                // @门票更新
                if($scope.ticketInfo.viewInfo != null) { // @检测产品对象是否有门票
                    
                    var len = $scope.ticketInfo.viewInfo.viewPrices.length; // @临时循环变量
        
                    $scope.ticketInfo_viewInfo_tempRequestParamArr = []; // @门票请求参数数组 清空
        
                    for(var index in $scope.ticketInfo.viewInfo.viewPrices) {

                        $scope["ticketInfo_viewInfo_count" + index] = 0; // @门票数量 清零
        
                    }

                    $scope.ticketViewSumPrice = 0; // @门票总价 清零
                
                }

                // @优惠券更新
                if($scope.useCoupon == true) {
                    $scope.couponType.type = ''; // @将优惠券类型 清空
                    $scope.couponPrice = 0; // @将优惠券金额 清空
                    $scope.useCoupon = false; // @同时未使用优惠券
                    $scope.noCouponTxt = false; // @无可用优惠券时，控制文本
                    $scope.noCouponTxt2 = false; // @有可用优惠券时，控制文本 
                }

                // @车票更新
                // @车票选择出发时间 显示更新
                if($scope.ticketInfo_forwardTicket_arr != null) {

                    $scope.ticketInfo_forwardTicket_count = 1; // @车票数量 清1                                     
                    $scope.ticketInfo_forwardTicket_arr = [];
                    $scope.ticketInfo_forwardTicket_haveChoosed = false; // @控制选择出发时间时的 样式表现    
                    $scope.ticketSumPrice_forwardTicket = 0;  // @去程车票总价 清零，重新计算
                    
                }
                if($scope.ticketInfo_backwardTicket_arr != null) {

                    $scope.ticketInfo_backwardTicket_count = 1; // @车票数量 清1                                     
                    $scope.ticketInfo_backwardTicket_arr = [];
                    $scope.ticketInfo_backwardTicket_haveChoosed = false; // @控制选择出发时间时的 样式表现    
                    $scope.ticketSumPrice_backwardTicket = 0;  // @返程程车票总价 清零，重新计算
                    
                }


            } else {
                layer.open({
                    content: '不在预售范围内，预售期仅为60天，请重新选择！',
                    btn: '确定'
                });
            }
        }
            
        // @上一天
        $scope.prevDay = function() {


            var prevDayTime = new Date($scope.currentSelectedDateOrTime).getTime() - (1 * 86400000); // ms

            var temp3 = new Date();
            var temp4 = $filter('date')(temp3, 'yyyy-MM-dd');

            var startTime = new Date(temp4).getTime();

            // var nextDayTime = new Date($rootScope.currentSelectedDate).getTime() + (1 * 86400000); // ms
            // var endTime = new Date().getTime() + (60 * 86400000);

            if(prevDayTime >= startTime) {

                var temp = new Date(prevDayTime);
                $scope.currentSelectedDateOrTime = $filter('date')(temp, 'yyyy-MM-dd');
                $scope.currentSelectedDateOrTime2 = "周" + "日一二三四五六".charAt(new Date($scope.currentSelectedDateOrTime).getDay());                
               
                // @验证码更新
                // @清除掉验证码计时器
                $scope.stopFight(); // @停止计时器
                $scope.resetFight(); // @重置计时器
                $scope.countdownTxtShow = false;

                // @根据验证码按钮之前的状态来设置状态 
                if($scope.verificationCodeBtnDisabled == false) {
                    $scope.verificationCodeBtnDisabled = false; // @启用获取验证码按钮            
                } else {
                    $scope.verificationCodeBtnDisabled = true; // @禁用获取验证码按钮
                }

                $scope.dataContainer.verificationCode = ''; // @清空验证码
                $scope.againObtainCheckCode = true; // @显示重新获取验证码的提示
                $scope.payBtnDisabled = true; // @禁用确认支付按钮

                // @门票更新
                if($scope.ticketInfo.viewInfo != null) { // @检测产品对象是否有门票
                    
                    var len = $scope.ticketInfo.viewInfo.viewPrices.length; // @临时循环变量
        
                    $scope.ticketInfo_viewInfo_tempRequestParamArr = []; // @门票请求参数数组清空
        
                    for(var index in $scope.ticketInfo.viewInfo.viewPrices) {

                        $scope["ticketInfo_viewInfo_count" + index] = 0; // @门票数量 清零
        
                    }

                    $scope.ticketViewSumPrice = 0; // @门票总价
                
                }

                // @优惠券更新
                if($scope.useCoupon == true) {
                    $scope.couponType.type = ''; // @将优惠券类型清空
                    $scope.couponPrice = 0; // @将优惠券金额清空
                    $scope.useCoupon = false; // @同时未使用优惠券
                    $scope.noCouponTxt = false; // @无可用优惠券时，控制文本
                    $scope.noCouponTxt2 = false; // @有可用优惠券时，控制文本 
                }

                // @车票更新
                // @车票选择出发时间 显示更新
                if($scope.ticketInfo_forwardTicket_arr != null) {
                    
                    $scope.ticketInfo_forwardTicket_count = 1; // @车票数量清1
                    $scope.ticketInfo_forwardTicket_arr = [];
                    $scope.ticketInfo_forwardTicket_haveChoosed = false; // @控制选择出发时间时的 样式表现    
                    $scope.ticketSumPrice_forwardTicket = 0;  // @去程车票总价 清零，重新计算
                    
                }
                if($scope.ticketInfo_backwardTicket_arr != null) {

                    $scope.ticketInfo_backwardTicket_count = 1; // @车票数量清1                    
                    $scope.ticketInfo_backwardTicket_arr = [];
                    $scope.ticketInfo_backwardTicket_haveChoosed = false; // @控制选择出发时间时的 样式表现    
                    $scope.ticketSumPrice_backwardTicket = 0;  // @返程车票总价 清零，重新计算
                    
                }

            } else {
                var temp = new Date();
                var temp2 = $filter('date')(temp, 'yyyy-MM-dd');
                layer.open({
                    content: '选择日期仅当从' + temp2 + '往后' ,
                    btn: '确定'
                });
            }
        }

        // @日期展开选择

        $scope.canPurchaseInfo = false;

        if($scope.ticketInfo.counts != null && $scope.ticketInfo.counts.length != 0) {

            $scope.canPurchaseInfo = true;
            $scope.canPurchaseInfoTxt = '';

            $scope.disabledWeeks = [];            
            $scope.disabledWeeksTemp = [0, 1, 2, 3, 4, 5, 6];
            $scope.disabledWeeksTemp1 = $scope.ticketInfo.counts.map(function(item) {  return item - 1 }).sort();
            
            $scope.disabledWeeks = arrayMinus($scope.disabledWeeksTemp, $scope.disabledWeeksTemp1);

            if($scope.disabledWeeksTemp1.toString() == $scope.disabledWeeksTemp.toString()) {
                $scope.canPurchaseInfo = false;
            }

            for(var i = 0; i < $scope.disabledWeeksTemp1.length; i++) {
                
                switch($scope.disabledWeeksTemp1[i]) {
                    
                    case 1:
                        $scope.canPurchaseInfoTxt += '周一';
                        break;
                    case 2:
                        $scope.canPurchaseInfoTxt += '周二';
                        break;
                    case 3:
                        $scope.canPurchaseInfoTxt += '周三';
                        break;
                    case 4:
                        $scope.canPurchaseInfoTxt += '周四';
                        break;
                    case 5:
                        $scope.canPurchaseInfoTxt += '周无';
                        break;
                    case 6:
                        $scope.canPurchaseInfoTxt += '周六';
                        break;
                    case 0:
                        $scope.canPurchaseInfoTxt += '周日';
                        break;

                }

            }

        } else {
            $scope.disabledWeeks = [];
            $scope.canPurchaseInfo = false;
        }

        console.log("订单页：被禁用的星期数组");        
        console.log($scope.disabledWeeks);
        
        var compareTimeTemp1 = new Date();
        var compareTimeTemp2 = $filter('date')(compareTimeTemp1, 'yyyy-MM-dd');
        var compareTime = new Date(compareTimeTemp2).getTime() + (60 * 86400000); // @60天时间
        $scope.selectDay = function(val) {

            var ipObj1 = {
                callback: function (val) {  // @必选

                    var val2 = new Date(val);
                    $scope.currentSelectedDateOrTime = $filter('date')(val2, 'yyyy-MM-dd');
                    $scope.currentSelectedDateOrTime2 = "周" + "日一二三四五六".charAt(new Date($scope.currentSelectedDateOrTime).getDay());                

                    // @验证码更新
                    // @清除掉验证码计时器
                    $scope.stopFight(); // @停止计时器
                    $scope.resetFight(); // @重置计时器
                    $scope.countdownTxtShow = false;

                    // @根据验证码按钮之前的状态来设置状态 
                    if($scope.verificationCodeBtnDisabled == false) {
                        $scope.verificationCodeBtnDisabled = false; // @启用获取验证码按钮            
                    } else {
                        $scope.verificationCodeBtnDisabled = true; // @禁用获取验证码按钮
                    }

                    $scope.dataContainer.verificationCode = ''; // @清空验证码
                    $scope.againObtainCheckCode = true; // @显示重新获取验证码的提示
                    $scope.payBtnDisabled = true; // @禁用确认支付按钮

                    // @门票更新
                    if($scope.ticketInfo.viewInfo != null) { // @检测产品对象是否有门票
                        
                        var len = $scope.ticketInfo.viewInfo.viewPrices.length; // @临时循环变量
            
                        $scope.ticketInfo_viewInfo_tempRequestParamArr = []; // @门票请求参数数组清空
            
                        for(var index in $scope.ticketInfo.viewInfo.viewPrices) {

                            $scope["ticketInfo_viewInfo_count" + index] = 0; // @门票数量 清零
            
                        }

                        $scope.ticketViewSumPrice = 0; // @门票总价
                    
                    }

                    // @优惠券更新
                    if($scope.useCoupon == true) {
                        $scope.couponType.type = ''; // @将优惠券类型清空
                        $scope.couponPrice = 0; // @将优惠券金额清空
                        $scope.useCoupon = false; // @同时未使用优惠券
                        $scope.noCouponTxt = false; // @无可用优惠券时，控制文本
                        $scope.noCouponTxt2 = false; // @有可用优惠券时，控制文本 
                    }

                    // @车票更新
                    // @车票选择出发时间 显示更新
                    if($scope.ticketInfo_forwardTicket_arr != null) {
                        
                        $scope.ticketInfo_forwardTicket_count = 1; // @车票数量清1                  
                        $scope.ticketInfo_forwardTicket_arr = [];
                        $scope.ticketInfo_forwardTicket_haveChoosed = false; // @控制选择出发时间时的 样式表现    
                        $scope.ticketSumPrice_forwardTicket = 0;  // @去程车票总价 清零，重新计算
                        
                    }
                    if($scope.ticketInfo_backwardTicket_arr != null) {

                        $scope.ticketInfo_backwardTicket_count = 1; // @车票数量清1                                       
                        $scope.ticketInfo_backwardTicket_arr = [];
                        $scope.ticketInfo_backwardTicket_haveChoosed = false; // @控制选择出发时间时的 样式表现    
                        $scope.ticketSumPrice_backwardTicket = 0;  // @返程车票总价 清零，重新计算
                        
                    }

                },
                titleLabel: '选择日期',
                closeLabel: '返回',
                from: new Date(),
                to: new Date(compareTime), // @11对应十二月，差1
                dateFormat: 'yyyy-MM-dd', // @可选
                closeOnSelect: true, // @可选,设置选择日期后是否要关掉界面。呵呵，原本是false。
                inputDate: new Date(),
                templateType: 'modal',
                disableWeekdays: $scope.disabledWeeks
            };
            ionicDatePicker.openDatePicker(ipObj1);

        }


        // ************************************************************************************************
        

        // @函数 验证手机号码
        $scope.checkPhone = function() {
            if($scope.dataContainer.phone !=  undefined) {
                if($scope.dataContainer.phone.length == 11) {
                    var phone = $scope.dataContainer.phone.toString();
                    if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) { // 正则检测
                        layer.msg("输入的手机号码有误"); 
                        $scope.verificationCodeBtnDisabled = true; // 禁用获取验证码按钮
                        $scope.payBtnDisabled = true; // 禁用确认支付按钮
                        return false; 
                    } else {
                        $scope.verificationCodeBtnDisabled = false; // 启用获取验证码按钮
                    }
                } else{
                    $scope.verificationCodeBtnDisabled = true; // 禁用获取验证码按钮
                    $scope.payBtnDisabled = true; // 禁用确认支付按钮
                }
            } else {
                // 
            }
        }


        // ************************************************************************************************
        

        // @验证码倒计时 处理流程
        var defaultCountdown = 60; // @默认60秒的倒计时时间
        $scope.countdownTime = defaultCountdown;
        var stopCountdownTime;
        $scope.fight = function() {
            $scope.countdownTxtShow = true;
            if ( angular.isDefined(stopCountdownTime) ) {
                return;  // Don't start a new fight if we are already fighting
            }
            stopCountdownTime = $interval(function() {
                if ($scope.countdownTime >  0) {
                    $scope.countdownTime = $scope.countdownTime - 1;
                } else {
                    $scope.stopFight();
                    $scope.countdownTxtShow = false;
                    $scope.verificationCodeBtnDisabled = false;
                    $scope.resetFight();
                }
            }, 1000);
        };
        $scope.stopFight = function() {
            if (angular.isDefined(stopCountdownTime)) {
                $interval.cancel(stopCountdownTime);
                stopCountdownTime = undefined;
            }
        };
        $scope.resetFight = function() {
            $scope.countdownTime = defaultCountdown;
        };
        $scope.$on('$destroy', function() {
            $scope.stopFight(); // Make sure that the interval is destroyed too
        });

        $scope.countdown = function() { // @获取验证码 并开始倒计时

            // @进行倒计时的同时，还需要向服务器发送获一个获取验证码的请求

            var departDate = $filter('date')($scope.currentSelectedDateOrTime, 'yyyy-MM-dd');
            var checkcode = parseInt($scope.dataContainer.phone) % parseInt($scope.dataContainer.phone.substring(1,4)) ;
            
            // @参数分情况封装
            if($scope.ticketInfo.plans != null) { // @有车票时

                if($scope.ticketInfo.plans[0] != null && $scope.ticketInfo.plans[1] == null) { // @有去程，无返程的情况

                    if($scope.ticketInfo_forwardTicket_haveChoosed == true) {
                        
                        var bsids = $scope.ticketInfo.plans[0].linename + '&' + departDate + '&' + $scope.ticketInfo_forwardTicket_time
                        
                        var requestData = {
                            phone: $scope.dataContainer.phone,
                            servicename: 'UserBuyViewTicket',
                            checkcode: checkcode.toString(),
                            bsids: bsids
                        };

                    } else {

                        layer.open({
                            content: '请先选择出发时间',
                            btn: '确定'
                        });
                        
                        return false;
                    }

                } else if($scope.ticketInfo.plans[0] != null && $scope.ticketInfo.plans[1] != null) { // @有去程，有返程的情况

                    if($scope.ticketInfo_forwardTicket_haveChoosed == true && $scope.ticketInfo_backwardTicket_haveChoosed == true) {
                        
                        var bsids = $scope.ticketInfo.plans[0].linename + '&' + departDate + '&' + $scope.ticketInfo_forwardTicket_time
                        
                        var requestData = {
                            phone: $scope.dataContainer.phone,
                            servicename: 'UserBuyViewTicket',
                            checkcode: checkcode.toString(),
                            bsids: bsids
                        };
    
                    } else {
    
                        layer.open({
                            content: '请先选择出发时间',
                            btn: '确定'
                        });
                        
                        return false;
                    }
                }

            } else { // @无车票时，只有门票

                var tickets = $scope.ticketInfo.viewInfo.viewName + '&' + departDate;

                var requestData = {
                    phone: $scope.dataContainer.phone,
                    servicename: 'UserBuyDoorTicket',
                    checkcode: checkcode.toString(),
                    tickets: tickets
                };

            }

            $scope.verificationCodeBtnDisabled = true;

            console.log("订单页：电话号码 " + $scope.dataContainer.phone);
            $scope.fight();
            console.log("订单页：验证码请求参数");
            console.log(requestData);

            // @获取短信验证码 /wechat/utils/sendCheckAuthcode
            $myHttpService.postNoLoad('api/utils/sendCheckAuthcode', requestData, function(data) {

                console.log("订单页：获取短信验证码API返回的数据");
            
                console.log(data);

            });

        }
        

        // ************************************************************************************************


        $scope.couponChooseModal = $ionicModal.fromTemplate('<ion-modal-view>'+
            '	  '+
            '        <ion-header-bar class="bar bar-header modal-two" >'+
            '		'+
            '		   <button class="button  button-balanced" ng-click="coupon_NOFn()" style="background: rgba(240, 248, 255, 0.09);color: #676464;">取消</button>'+
            '          <h1 class="title" style="color: black;font-size: 17px;font-weight: 400;">请选择优惠券</h1>'+
            '          <button class="button button-balanced" ng-click="coupon_OKFn()" style="background: rgba(240, 248, 255, 0.09);color: #676464;">确定</button>'+
            '		'+
            '        </ion-header-bar>'+
            '		'+
            '        <ion-content class="padding" style="background: #ffffff;margin-top: 300px;" >'+
            // '		    <p style="text-align:center;font-size: 20px;"><span>{{ticketInfo.viewName}}</span></p>	'+
            '			<ion-radio style="padding: 15px 10px;border: none;font-size: 17px;" ng-repeat="item in couponArr"'+
            '               ng-value="item.brcid"'+
            '               ng-model="couponType.type">'+
            '      			{{ item.couponMoney }} 元 <span style="margin-left: 5px;">有效期 {{item.overDate | date:"yyyy-MM-dd"}}</span> '+
            '    		</ion-radio>'+
            '			'+
            '        </ion-content>'+
            '		'+
            '      </ion-modal-view>', {
            scope: $scope,
            animation: 'slide-in-up'
        });

        // @优惠券的检测 函数

        $scope.useCoupon = false; // @是否使用优惠券

        $scope.noCouponTxt = false; // @无可用 优惠券时，控制文本
        $scope.noCouponTxt2 = false; // @有可用 优惠券时，控制文本
        $scope.noCouponTxt3 = true; // @未使用 优惠券时，控制文本

        $scope.couponType = { // @优惠券类型，同时也是 brcid
            type: ''
        };

        $scope.checkCoupon2 = function() { 

            // @查询用户是否有优惠卷 wechat/product/queryUserBuslineCoupon
            $myHttpService.post('api/product/queryUserBuslineCoupon', {userid: $rootScope.session.user.userInfo.userid}, function(data) {

                console.log("订单页：查询用户是否有优惠卷API返回的数据");
                console.log(data);

                if(data.isHaveCoupon) { // @有优惠券

                    $scope.couponArr = data.buslineCoupons; // @优惠券数组

                    if($scope.couponArr[0] == null) { // @优惠券数组为空
                        $scope.noCouponTxt = true;
                        $scope.noCouponTxt3 = false; 
                        $scope.useCoupon = false;
                    } else {
                        $scope.couponType = { // @优惠券类型，同时也是 brcid
                            type: $scope.couponArr[0].brcid // @默认取第一个为优惠券类型
                        };
                        $scope.couponChooseModal.show(); // @优惠券弹窗显示
                    }

                } else { // @无优惠券

                    $scope.noCouponTxt = true;
                    $scope.noCouponTxt3 = false;
                    $scope.useCoupon = false;

                }

            });

        }

        $scope.coupon_OKFn = function() { // @优惠券弹窗中的 确定函数
            
            for(var item in $scope.couponArr) {

                var objTemp = $scope.couponArr[item];

                if(objTemp.brcid == $scope.couponType.type) {

                    $scope.coupon = objTemp.couponMoney; // 找出用户选择的相应的优惠券金额
                    $scope.noCouponTxt2 = true;
                    $scope.noCouponTxt3 = false;
                    $scope.useCoupon = true;
                    
                }
            }

            console.log("订单页：优惠券类型");
            console.log($scope.couponType.type);

            $scope.couponChooseModal.hide();            

        }

        $scope.coupon_NOFn = function() { // @优惠券弹窗中的 取消函数

            $scope.couponType.type = ''; // @将优惠券类型清空
            $scope.coupon = 0; // @将优惠券金额清空

            $scope.useCoupon = false; // @同时未使用优惠券

            $scope.noCouponTxt = false; // @无可用优惠券时，控制文本
            $scope.noCouponTxt2 = false; // @有可用优惠券时，控制文本
            $scope.noCouponTxt3 = true; // @未使用 优惠券时，控制文本

            console.log("订单页：优惠券类型");
            console.log($scope.couponType.type);

            $scope.couponChooseModal.hide();            
            
        }

        $scope.$on('$destroy', function() {
            $scope.couponChooseModal.remove();
        });

        // ************************************************************************************************


        // @确认支付按钮的状态监控 函数
        $scope.payBtnCheck = function() {
            if($scope.dataContainer.phone !=  undefined) {
                if($scope.dataContainer.phone.length == 11) {
                    var phone = $scope.dataContainer.phone.toString();
                    if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) { 
                        layer.msg("输入的手机号码有误"); 
                        $scope.checkPhoneState = false;
                        return false; 
                    } else {
                        $scope.checkPhoneState = true;
                    }
                } else{
                    $scope.checkPhoneState = false;
                }
            } else {
                $scope.checkPhoneState = false;                
            }
            if($scope.checkPhoneState) {
                if($scope.dataContainer.verificationCode) {
                    $scope.payBtnDisabled = false;
                } else {
                    $scope.payBtnDisabled = true;
                }
            } else {
                $scope.payBtnDisabled = true;
            }
        }

        // @支付 函数
        $scope.recharge = function() {

            // @没有车票只有门票的情况 门票检测
            if($scope.ticketInfo.plans == null && $scope.ticketInfo.viewInfo != null) {

                var flag = false;

                // @对门票参数数组进行检测
                for(var i = 0; i < $scope.ticketInfo_viewInfo_tempRequestParamArr.length; i++) {

                    if($scope.ticketInfo_viewInfo_tempRequestParamArr[i] != undefined) { 

                        var item = $scope.ticketInfo_viewInfo_tempRequestParamArr[i][1];
                        if(item != 0) {
                            flag = true;
                        }

                    }
                    
                }

                if(flag == false) {
                    layer.open({
                        content: '客官，请至少选择一张门票 (╯-╰)',
                        btn: '确定'
                    });
                    return false;
                }

            }

            // @有车票 有门票的情况 门票检测
            if($scope.ticketInfo.plans != null && $scope.ticketInfo.viewInfo != null) {

                // @有去程，没有返程 的情况 门票检测
                if($scope.ticketInfo.plans[0] != null && $scope.ticketInfo.plans[1] == null) {

                    if($scope.ticketInfo_forwardTicket_count == 0) {

                        var flag2 = false;
                        
                        // @对门票参数数组进行检测
                        for(var i = 0; i < $scope.ticketInfo_viewInfo_tempRequestParamArr.length; i++) {
        
                            if($scope.ticketInfo_viewInfo_tempRequestParamArr[i] != undefined) { 
                                
                                var item = $scope.ticketInfo_viewInfo_tempRequestParamArr[i][1];
                                if(item != 0) {
                                    flag2 = true;
                                }

                            }
                            
                        }
        
                        if(flag2 == false) {
                            layer.open({
                                content: '客官，请至少选择一张门票 (╯-╰)',
                                btn: '确定'
                            });
                            return false;
                        }

                    }

                }

                // @有去程，有返程 的情况 门票检测
                if($scope.ticketInfo.plans[0] != null && $scope.ticketInfo.plans[1] != null) {

                    if($scope.ticketInfo_forwardTicket_count == 0 && $scope.ticketInfo_backwardTicket_count == 0) {

                        var flag3 = false;
                        
                        // @对门票参数数组进行检测
                        for(var i = 0; i < $scope.ticketInfo_viewInfo_tempRequestParamArr.length; i++) {

                            if($scope.ticketInfo_viewInfo_tempRequestParamArr[i] != undefined) {
                                var item = $scope.ticketInfo_viewInfo_tempRequestParamArr[i][1];
                                if(item != 0) {
                                    flag3 = true;
                                }
                            }
        
                        }
        
                        if(flag3 == false) {
                            layer.open({
                                content: '客官，请至少选择一张门票 (╯-╰)',
                                btn: '确定'
                            });
                            return false;
                        }

                    }
                
                }

            }

            // @支付参数封装
            
            // @车票参数数组提取
            var bdids = '';                
            if($scope.ticketInfo_Ticket_tempRequestParamArr != null) {

                for(var i = 0, len = $scope.ticketInfo_Ticket_tempRequestParamArr.length; i < len; i++) {

                    // if($scope.ticketInfo_Ticket_tempRequestParamArr[i][1] != 0) {
                    //     bdids += $scope.ticketInfo_Ticket_tempRequestParamArr[i][0] + '&' + $scope.ticketInfo_Ticket_tempRequestParamArr[i][1];
                    // }

                    if(i == len - 1) {
                        bdids += $scope.ticketInfo_Ticket_tempRequestParamArr[i][0] + '&' + $scope.ticketInfo_Ticket_tempRequestParamArr[i][1];
                    } else {
                        bdids += $scope.ticketInfo_Ticket_tempRequestParamArr[i][0] + '&' + $scope.ticketInfo_Ticket_tempRequestParamArr[i][1] + '&&';
                    }

                }

            }

            // @门票参数数组提取
            var viewPrices = '';
            if($scope.ticketInfo_viewInfo_tempRequestParamArr != null) {

                for(var i = 0, len = $scope.ticketInfo_viewInfo_tempRequestParamArr.length; i < len; i++) {

                    if($scope.ticketInfo_viewInfo_tempRequestParamArr[i] != undefined) {
                        if(i == len - 1) {
                            viewPrices += $scope.ticketInfo_viewInfo_tempRequestParamArr[i][0] + '&' + $scope.ticketInfo_viewInfo_tempRequestParamArr[i][1];                     
                        } else {
                            viewPrices += $scope.ticketInfo_viewInfo_tempRequestParamArr[i][0] + '&' + $scope.ticketInfo_viewInfo_tempRequestParamArr[i][1] + '&&';                                             
                        }
                    }
                    
                }
            }
                        
            // @$scope.currentSelectedDateOrTime
            var departDate = $filter('date')($scope.currentSelectedDateOrTime, 'yyyy-MM-dd');
            var userid = $rootScope.session.user.userInfo.userid;
            var openid = $rootScope.session.user.userInfo.openid;
            var authcode = $scope.dataContainer.verificationCode;
            var productid = $scope.paramsProductid;
            var couponuse = $scope.useCoupon + ''; // @将 布尔 false 转成字符串 'false'
            var brcid = $scope.couponType.type;
            
            var data2 = { 
                departDate: departDate,
                bdids: bdids,
                couponuse: couponuse,
                userid: userid,
                openid: openid,
                authcode: authcode,
                viewPrices: viewPrices,
                brcid: brcid,
                productid: productid
            };
            // @格式化 data2
            data2 = formatParamObject(data2);

            console.log("订单页：支付购买的请求参数");
            console.log(data2); 

            // @传递到支付成功页的参数封装

            var data3_count = '';
            var data3_backCount = '';
            var data3_gobdid = '';
            var data3_backbdid = '';
            var data3_doorCount = '';
            var data3_viewid = '';

            if($scope.ticketInfo.viewInfo != null) {
                data3_viewid = $scope.ticketInfo.viewInfo.viewid;
            }

            if($scope.ticketInfo_Ticket_tempRequestParamArr != null) {

                for(var i = 0, len = $scope.ticketInfo_Ticket_tempRequestParamArr.length; i < len; i++) {
                    if(i == 0) {
                        data3_gobdid = $scope.ticketInfo_Ticket_tempRequestParamArr[i][0];
                        data3_count = $scope.ticketInfo_Ticket_tempRequestParamArr[i][1];
                    } else if(i == 1) {
                        data3_backbdid = $scope.ticketInfo_Ticket_tempRequestParamArr[i][0];
                        data3_backCount = $scope.ticketInfo_Ticket_tempRequestParamArr[i][1];                        
                    }
                }

            }

            if($scope.ticketInfo_viewInfo_tempRequestParamArr != null) {

                data3_doorCount = 0;
                for(var i = 0; i < $scope.ticketInfo_viewInfo_tempRequestParamArr.length; i++) {

                    if($scope.ticketInfo_viewInfo_tempRequestParamArr[i] != undefined) {
                        data3_doorCount += Number.parseInt($scope.ticketInfo_viewInfo_tempRequestParamArr[i][1]);                    
                    }

                }

            }

            var data3 = {
                userid: userid,
                departDate: departDate,
                gobdid: data3_gobdid,
                backbdid: data3_backbdid,
                count: data3_count,
                backCount: data3_backCount,
                doorCount: data3_doorCount,
                viewid: data3_viewid
            };

            console.log("订单页：传递到支付成功页的参数");                        
            console.log(data3);


            // @支付请求接口 wechat/product/buyProductTicket
            $myHttpService.post("api/product/buyProductTicket", data2, function(data) {

                console.log("订单页：支付请求API返回的数据");
                console.log(data);

                if(data.counponUse != null) {
                    
                    if(data.updateCoupon) {
                        console.log("订单页：优惠券支付成功，传递到支付成功页的参数");                        
                        console.log(data3);
                        $state.go('order_detail_refund', {data: JSON.stringify(data3)}, {reload: true});                        
                    } else {
                        layer.open({
                            content: '支付失败',
                            btn: '确定'
                        });
                    }

                } else {

                    $scope.rechargeid = data.rechargeid;

                    var wxData = {
                        "appId": data.appId,   //公众号名称，由商户传入     
                        "timeStamp": data.timeStamp,    //时间戳，自1970年以来的秒数     
                        "nonceStr": data.nonceStr, //随机串     
                        "package": data.package,     
                        "signType": data.signType,   //微信签名方式：     
                        "paySign": data.paySign //微信签名 
                    };

                    function onBridgeReady() {
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest',
                            wxData,
                            function(res) {
                                if(res.err_msg == "get_brand_wcpay_request:ok") {
                                    //重新查询一次服务器
                                    $myHttpService.post("api/recharge/verifyWxorderStatus", {
                                        rechargeid: $scope.rechargeid
                                    }, function(data) {
                                        alert("您已成功支付");
                                        console.log("订单页：微信支付成功，传递到支付成功页的参数");
                                        console.log(data3);
                                        $state.go('order_detail_refund', {data: JSON.stringify(data3)}, {reload: true});
                                    }, function(data) {
                                        layer.open({
                                            content: '支付失败，请联系客服处理。',
                                            btn: '确定'
                                        });
                                    });
                                } else if(res.err_msg == "get_brand_wcpay_request:cancel") {
                                    layer.open({
                                            content: '你取消了本次支付',
                                            btn: '确定'
                                    });
                                } else {
                                    layer.open({
                                            content: '支付失败，请联系客服处理。',
                                            btn: '确定'
                                    });
                                }
                            }
                        );
                    }

                    if (typeof WeixinJSBridge == "undefined") {
                        if( document.addEventListener ) {
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                    } else {
                        onBridgeReady();
                    }

                }

            });
        }

        // @支付 车票检验 函数
        $scope.checkRecharge = function() {

            // @车票检测
            if($scope.ticketInfo.plans != null) { // @有车票

                console.log("1");
                
                // @有去程时 的情况
                if($scope.ticketInfo.plans[0] != null) {

                    console.log("2");

                    if($scope.ticketInfo_forwardTicket_haveChoosed == false) {
                        layer.open({
                            content: '客官，请选择行程出发时间日期 (╯-╰)',
                            btn: '确定'
                        });
                        return false;
                    }

                }
                
                // @有返程时 的情况
                if($scope.ticketInfo.plans[1] != null) {

                    console.log("3");
                
                    if($scope.ticketInfo_backwardTicket_haveChoosed == false) {
                        layer.open({
                            content: '客官，请选择行程出发时间日期 (╯-╰)',
                            btn: '确定'
                        });

                        return false;
                    }

                }
                
                // @有去程，没有返程 的情况
                if($scope.ticketInfo.plans[0] != null && $scope.ticketInfo.plans[1] == null) {

                    console.log("4");
                
                    
                    if($scope.ticketInfo_forwardTicket_count == 0) {

                        console.log("4-1");
                        
                        layer.open({
                            content: '您购买的订单中不包含车票，是否继续？',
                            btn: ['继续', '取消'],
                            shadeClose: false,
                            yes: function(index) {
                                $scope.recharge(); // @调用支付函数
                                layer.close(index);                                
                            }
                        })

                        return false;

                    }

                }

                // @有去程，有返程 的情况
                if($scope.ticketInfo.plans[0] != null && $scope.ticketInfo.plans[1] != null) {

                    console.log("5");
                
                    if($scope.ticketInfo_forwardTicket_count == 0 && $scope.ticketInfo_backwardTicket_count == 0) {

                        console.log("5-1");
                        layer.open({
                            content: '您购买的订单中不包含车票，是否继续？',
                            btn: ['继续', '取消'],
                            shadeClose: false,
                            yes: function(index) {
                                $scope.recharge(); // @调用支付函数            
                                layer.close(index);
                            }
                        })

                        return false;

                    }
                }

            }

            console.log("调用了");
            $scope.recharge(); // @调用支付函数

        }


        // ************************************************************************************************
        

        $scope.yonghuxuzhi_Fn = function() { // @用户须知弹窗函数
            
            layer.open({
                type: 1,
                content: '<p style="text-align: right;margin-top: 10px;"><i class="icon ion-ios-close-empty" style="color:#ccc;font-size: 45px;margin-right: 10px;" onclick="layer.closeAll();"></i></p><div style="margin: 5px 15px;">' + $scope.ticketInfo.productinfo + '</div>',
                anim: 'up',
                style: 'position: absolute; left:0; top:0; width:100%; height:100%; border: none; -webkit-animation-duration: .3s; animation-duration: .3s;background: white;'
            });

        }
        
    })

    /**
     * @支付成功页 车票购买成功 控制器
     */
    .controller('order_detail_refund', function($rootScope, $scope, $filter, $state, $myHttpService, $ionicSlideBoxDelegate) {

        $scope.ticketsInfo = []; // @车票
        $scope.ticketsViewInfo = []; // @门票

        if(JSON.parse($state.params.data) == null) { // @访问此页面时，如果没有传递过来参数

            $scope.ticketsInfo = getStorageData('jqztc_zfcgy_ticketsInfo');
            $scope.ticketsViewInfo = getStorageData('jqztc_zfcgy_ticketsViewInfo');
            $ionicSlideBoxDelegate.update();
            
        } else { // @访问此页面时，如果有参数传递过来

            $scope.ticketsInfoTemp = []; // @车票 临时变量
            
            var paramsData = JSON.parse($state.params.data); // @参数解析

            paramsData = formatParamObject(paramsData); // @参数格式化

            // backCount:1
            // backbdid:"2017112910420296374255"
            // count:1
            // departDate:"2017-12-01"
            // doorCount:0
            // gobdid:"2017112810380901002998"
            // userid:"2017112409511512371556"
            // viewid:"2017112711511975860548"

            console.log("支付成功页：请求参数");
            console.log(paramsData);

            // @获取用户刚刚购买的票  /web/product/queryProductOrderByBdid
            $myHttpService.post('api/product/queryProductOrderByBdid', paramsData, function(data) {

                console.log("支付成功页：获取用户刚刚购买的票API返回的数据");
                console.log(data);

                // @去程车票数组
                if(data.viewOrders != null && data.viewOrders.length != 0) {
                    $scope.ticketsInfo = data.viewOrders;
                    console.log($scope.ticketsInfo);
                }

                // @合并返程车票数组
                if(data.backViewOrders != null && data.backViewOrders.length != 0) {
                    $scope.ticketsInfo = $scope.ticketsInfo.concat(data.backViewOrders);
                }

                console.log("支付成功页: 车票数组");
                console.log($scope.ticketsInfo);

                // @门票数组
                if(data.ticketOrders != null && data.ticketOrders.length != 0) {
                    $scope.ticketsViewInfo = data.ticketOrders;
                }

                console.log("支付成功页: 合并之后的门票数组");
                console.log($scope.ticketsViewInfo);

                $ionicSlideBoxDelegate.update();

                storageData('jqztc_zfcgy_ticketsInfo', $scope.ticketsInfo);
                storageData('jqztc_zfcgy_ticketsViewInfo', $scope.ticketsViewInfo);

            }, errorFn);
            
        }

        // @车辆位置 函数
        $scope.getBusPosition = function(item) {
            
            var data = {
                carid: item.carid,
                lineid: item.lineid
            };
            $state.go('ticket_detail.bus_position', {data: JSON.stringify(data)}, {reload: false});
        } 
               
    })

    /**
     * @我的行程页 门票、车票 控制器
     */ 
    .controller('myplan', function($rootScope, $scope, $filter, $myHttpService, $state, $timeout, $ionicTabsDelegate, $ionicScrollDelegate) {

        if($rootScope.jqztc_xdxcy_current_tab_index) { // @tab项控制跳转
            
            if($rootScope.jqztc_xdxcy_current_tab_index == 0) {
                
                $timeout(function() {
                    $ionicTabsDelegate.select(0); 
                }, 50);

            } else if($rootScope.jqztc_xdxcy_current_tab_index == 1) {

                $timeout(function() {
                    $ionicTabsDelegate.select(1); 
                }, 50);

            } else if($rootScope.jqztc_xdxcy_current_tab_index == 2) {

                $timeout(function() {
                    $ionicTabsDelegate.select(2);
                }, 50);

            }
        }

        if(sessionStorage.getItem("myplanCount") == null) { // @流程控制变量
            var myplanCount = 1;
        } else {
            var myplanCount = sessionStorage.getItem("myplanCount");
        }

        $scope.ticketsInfoIsEmpty = false; // @当没有任何票信息时显现无票HTML，无票为 true；默认为有票 false
        $scope.jqztc_xdxcy_ticketsInfo_nouse_ticketsInfoIsEmpty = false;
        $scope.jqztc_xdxcy_ticketsInfo_refund_ticketsInfoIsEmpty = false;

        if(myplanCount == 1) { // 模拟onLoad的初次执行效果

            $rootScope.jqztc_xdxcy_ticketsInfo = []; // @tab_all 全部 车票集合数组
            $rootScope.jqztc_xdxcy_ticketsViewInfo = []; // @tab_all 全部 门票集合数组

            $rootScope.jqztc_xdxcy_ticketsInfo_nouse = []; // @tab_nouse 未使用的车票
            $rootScope.jqztc_xdxcy_ticketsViewInfo_nouse = []; // @tab_nosue 未使用的门票

            $rootScope.jqztc_xdxcy_ticketsInfo_refund = []; // @tab_refund 正在退款中的车票
            $rootScope.jqztc_xdxcy_ticketsViewInfo_refund = []; // @tab_refund 正在退款中的门票

            sessionStorage.setItem("myplanCount", 2);
            $rootScope.hasmore2 = false; // @首次进入页面时  关闭掉上拉加载行为 ion-infinite-scroll，false为关闭；true为开启
            
            // @当前的 tab index索引
            $rootScope.jqztc_xdxcy_current_tab_index = 0;

        }

        // @tab_all 全部的票据
        var run = false; // @防止在短时间内重复出发上拉加载请求函数的执行

        $scope.tab_all = function() { // @每次点击tab项时，就会执行一遍这个函数 15张

            console.log("我的行程页：tab_all执行");   

            $rootScope.jqztc_xdxcy_current_tab_index = $ionicTabsDelegate.selectedIndex(); // @获取当前索引

            console.log("我的行程页：当前索引");
            console.log($rootScope.jqztc_xdxcy_current_tab_index);
            
            var requestData = {
                userid: $rootScope.session.user.userInfo.userid,
                offset: 0,
                pagesize: 15,
            };

            // @订单列表 wechat/product/queryUserProductTicketList
            $myHttpService.post('api/product/queryUserProductTicketList', requestData, function(data) {

                console.log("我的行程页：获取所有订单的列表API返回的数据");
                console.log(data);
                
                $rootScope.jqztc_xdxcy_ticketsInfo = data.userViewList;
                $rootScope.jqztc_xdxcy_ticketsViewInfo = data.ticketOrders;
                
                $scope.$broadcast('scroll.refreshComplete');

                console.log("我的行程页：全部车票数组");
                console.log($rootScope.jqztc_xdxcy_ticketsInfo);

                console.log("我的行程页：全部门票数组");
                console.log($rootScope.jqztc_xdxcy_ticketsViewInfo);   

                if($rootScope.jqztc_xdxcy_ticketsInfo.length == 0 && $rootScope.jqztc_xdxcy_ticketsViewInfo.length == 0) {

                    $timeout(function() {
                        $scope.ticketsInfoIsEmpty = true;                        
                    }, 700);

                }

                if( (data.userViewList.length + data.ticketOrders.length) < 15) {
                    $rootScope.hasmore2 = false;
                } else {
                    $rootScope.hasmore2 = true;
                    $scope.pageCount = 2;
                }

            }, function() {
                $scope.$broadcast('scroll.refreshComplete'); 
            });

        }
        
        // @票据信息 下拉刷新函数 15张
        $scope.refresh_tab_all = function() {

            console.log("我的行程页：doRefreshTicket执行");           

            var requestData = {
                userid: $rootScope.session.user.userInfo.userid,
                offset: 0,
                pagesize: 15,
            };

            // @订单列表 wechat/product/queryUserProductTicketList
            $myHttpService.postNoLoad('api/product/queryUserProductTicketList', requestData, function(data) {

                console.log("我的行程页：获取所有订单的列表API返回的数据(下拉刷新)");
                console.log(data);

                $rootScope.jqztc_xdxcy_ticketsInfo = data.userViewList;
                $rootScope.jqztc_xdxcy_ticketsViewInfo = data.ticketOrders;
                
                $scope.$broadcast('scroll.refreshComplete');

                console.log("我的行程页：全部车票数组");
                console.log($rootScope.jqztc_xdxcy_ticketsInfo);

                console.log("我的行程页：全部门票数组");
                console.log($rootScope.jqztc_xdxcy_ticketsViewInfo);   

                if($rootScope.jqztc_xdxcy_ticketsInfo.length == 0 && $rootScope.jqztc_xdxcy_ticketsViewInfo.length == 0) {

                    $timeout(function() {
                        $scope.ticketsInfoIsEmpty = true;                        
                    }, 700);

                } else {
                    layer.open({
                        content: '刷新成功',
                        skin: 'msg',
                        time: 1
                    });
                }

                if( (data.userViewList.length + data.ticketOrders.length) < 15) {
                    $rootScope.hasmore2 = false;
                } else {
                    // $timeout(function() {
                    //     $rootScope.hasmore2 = true;                    
                    // }, 2000);
                    $rootScope.hasmore2 = true; 
                    $scope.pageCount = 2;
                }

            }, function() {
                $scope.$broadcast('scroll.refreshComplete'); 
            });
        };

        // @比较函数，对票进行排序，从大到小
        var compare = function (prop) {
            return function (obj1, obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if(val1 == undefined) {
                    val1 = 100000;
                }
                if(val2 == undefined) {
                    val2 = 100000;
                }
                if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                    val1 = Number(val1) / 10000;
                    val2 = Number(val2) / 10000;
                }
                return val2 - val1;
            } 
        }
        
        // @上拉加载更多票信息 15张
        $scope.load_more_tab_all = function() {

            console.log("我的行程页：load_more_tab_all执行");

            var offset = ($scope.pageCount - 1) * 15;
            var requestData = {
                userid: $rootScope.session.user.userInfo.userid,
                offset: offset,
                pagesize: 15,
            };

            if(!run) {

                run = true;
                
                $myHttpService.postNoLoad('api/product/queryUserProductTicketList', requestData, function(data) {

                    console.log("我的行程页：获取所有订单的列表API返回的数据(上拉加载)");  
                    console.log(data);

                    $rootScope.jqztc_xdxcy_ticketsInfo = $rootScope.jqztc_xdxcy_ticketsInfo.concat(data.userViewList); // @车票
                    $rootScope.jqztc_xdxcy_ticketsViewInfo = $rootScope.jqztc_xdxcy_ticketsViewInfo.concat(data.ticketOrders); // @门票

                    console.log("我的行程页：全部车票数组");
                    console.log($rootScope.jqztc_xdxcy_ticketsInfo);

                    console.log("我的行程页：全部门票数组");
                    console.log($rootScope.jqztc_xdxcy_ticketsViewInfo);                    

                    $rootScope.jqztc_xdxcy_ticketsInfo.sort(compare('departDate'));  // @车票排序

                    $scope.$broadcast('scroll.infiniteScrollComplete');

                    if($rootScope.jqztc_xdxcy_ticketsInfo.length == 0  && $rootScope.jqztc_xdxcy_ticketsViewInfo.length == 0) { // @无票

                        $timeout(function() {
                            $scope.ticketsInfoIsEmpty = true;                        
                        }, 700);

                    } else {
                        layer.open({
                            content: '加载成功',
                            skin: 'msg',
                            time: 1
                        });
                    }

                    if ( (data.userViewList.length + data.ticketOrders.length) < 15) { 
                        $scope.hasmore = false; // @这里判断是否还能获取到数据，如果没有获取数据，则不再触发加载事件 
                        $rootScope.hasmore2 = false;
                    } else {
                        $scope.pageCount++; // @计数
                    }
                    run = false;

                }, function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            }
        }

        // @tab_nouse 未使用的票据 20张
        $scope.tab_nouse = function() { // @每次点击tab项时，就会执行一遍这个函数
            
            console.log("我的行程页：tab_nouse执行");   

            $rootScope.jqztc_xdxcy_current_tab_index = $ionicTabsDelegate.selectedIndex(); // @获取当前索引     
            console.log("我的行程页：当前索引");
            console.log($rootScope.jqztc_xdxcy_current_tab_index);       
            
            var requestData = {
                userid: $rootScope.session.user.userInfo.userid,
                viewOrderStatus: 2,
                offset: 0,
                pagesize: 20,
            };

            // @订单列表 wechat/product/queryUserProductTicketList
            $myHttpService.post('api/product/queryUserProductTicketList', requestData, function(data) {

                console.log("我的行程页：获取未使用订单的列表API返回的数据");
                console.log(data);

                if( (data.userViewList.length + data.ticketOrders.length) < 20) {
                    $rootScope.jqztc_xdxcy_ticketsInfo_nouse_hasmore2 = false;
                } else {
                    $rootScope.jqztc_xdxcy_ticketsInfo_nouse_hasmore2 = true;
                    $scope.jqztc_xdxcy_ticketsInfo_nouse_pageCount = 2;
                }

                $rootScope.jqztc_xdxcy_ticketsInfo_nouse = data.userViewList;
                $rootScope.jqztc_xdxcy_ticketsViewInfo_nouse = data.ticketOrders;
                
                $scope.$broadcast('scroll.refreshComplete');

                console.log("我的行程页：未使用车票数组");
                console.log($rootScope.jqztc_xdxcy_ticketsInfo_nouse);

                console.log("我的行程页：未使用门票数组");
                console.log($rootScope.jqztc_xdxcy_ticketsViewInfo_nouse);   

                if($rootScope.jqztc_xdxcy_ticketsInfo_nouse.length == 0 && $rootScope.jqztc_xdxcy_ticketsViewInfo_nouse.length == 0) {

                    $timeout(function() {
                        $scope.jqztc_xdxcy_ticketsInfo_nouse_ticketsInfoIsEmpty = true;                        
                    }, 700);

                }

            }, function() {
                $scope.$broadcast('scroll.refreshComplete'); 
            });
            
        }

        // @tab_refund 退款中的票据 20张
        $scope.tab_refund = function() { // @每次点击tab项时，就会执行一遍这个函数
            
            console.log("我的行程页：tab_refund执行");   

            $rootScope.jqztc_xdxcy_current_tab_index = $ionicTabsDelegate.selectedIndex(); // @获取当前索引 
            console.log("我的行程页：当前索引");
            console.log($rootScope.jqztc_xdxcy_current_tab_index);           
            
            var requestData = {
                userid: $rootScope.session.user.userInfo.userid,
                viewOrderStatus: 4,
                offset: 0,
                pagesize: 20,
            };

            // @订单列表 wechat/product/queryUserProductTicketList
            $myHttpService.post('api/product/queryUserProductTicketList', requestData, function(data) {

                console.log("我的行程页：获取正在退款中订单的列表API返回的数据");
                console.log(data);

                if( (data.userViewList.length + data.ticketOrders.length) < 20) {
                    $rootScope.jqztc_xdxcy_ticketsInfo_refund_hasmore2 = false;
                } else {
                    $rootScope.jqztc_xdxcy_ticketsInfo_refund_hasmore2 = true;
                    $scope.jqztc_xdxcy_ticketsInfo_refund_pageCount = 2;
                }

                $rootScope.jqztc_xdxcy_ticketsInfo_refund = data.userViewList;
                $rootScope.jqztc_xdxcy_ticketsViewInfo_refund = data.ticketOrders;
                
                $scope.$broadcast('scroll.refreshComplete');

                console.log("我的行程页：未使用车票数组");
                console.log($rootScope.jqztc_xdxcy_ticketsInfo_refund);

                console.log("我的行程页：未使用门票数组");
                console.log($rootScope.jqztc_xdxcy_ticketsViewInfo_refund);   

                if($rootScope.jqztc_xdxcy_ticketsInfo_refund.length == 0 && $rootScope.jqztc_xdxcy_ticketsViewInfo_refund.length == 0) {

                    $timeout(function() {
                        $scope.jqztc_xdxcy_ticketsInfo_refund_ticketsInfoIsEmpty = true;                        
                    }, 700);

                }

            }, function() {
                $scope.$broadcast('scroll.refreshComplete'); 
            });
            
        }

        // @点击 未使用 车票进入 车票详情界面
        $scope.unusedTicketToDetail = function(item, i, $event) {

            console.log("我的行程页：当前元素的位置");
            console.log($event);
            $state.go('ticket_detail.ticketdetail', {data: JSON.stringify(item)}, {reload: false});

        }

        // @点击 已使用 车票进入 车票评价界面，同时还需要判断是否已评价
        $scope.usedTicketToComment = function(item, i) {

            layer.open({
                type: 2,
                content: '加载中'
            });

            var isCommented = false;
            var isCommentedText = '';
            var isCommentedScore = 1;

            if(item.orderhie != null) {
                isCommented = true;
                isCommentedText = item.orderhie;
                isCommentedScore = item.orderScore;
            }

            $state.go('order_check_comment', {
                data: JSON.stringify(item),
                isCommented: JSON.stringify(isCommented),
                isCommentedText: JSON.stringify(isCommentedText),
                isCommentedScore: JSON.stringify(isCommentedScore)
            }, {reload: true});
            layer.closeAll();

        }

        // @点击 正在退款 车票 进入 车票详情界面
        $scope.refundingToRefund = function(item, i) {

            $state.go('ticket_detail.ticketdetail', {data: JSON.stringify(item)}, {reload: false});

        }

        // @点击 未使用 门票进入 门票详情界面
        $scope.unusedAdmissionTicketToDetail = function(item, i) {

            $state.go('ticket_admission_detail', {data: JSON.stringify(item)}, {reload: false});

        }

    })

     /**
      * @测试 控制器
      */
    .controller('test', function($rootScope, $scope, $state, $timeout, $myLocationService, $myHttpService, $ionicLoading, $ionicScrollDelegate, $ionicActionSheet, $selectCity, $filter, ionicDatePicker, City, $location,$anchorScroll) {

        $scope.selectedDate1;
        $scope.selectedDate2;
    
        $scope.openDatePickerOne = function (val) {
          var ipObj1 = {
            callback: function (val) {  //Mandatory
              console.log('Return value from the datepicker popup is : ' + val, new Date(val));
              $scope.selectedDate1 = new Date(val);
            },
            from: new Date(),
            to: new Date(2099, 11, 31),
            inputDate: new Date(),
            titleLabel: '选择日期',
            setLabel: '选择',
            todayLabel: '今天',
            closeLabel: '返回',
            mondayFirst: false,
            disableWeekdays: [],
            dateFormat: 'yyyy-MM-dd', //可选
            closeOnSelect: false, //可选,设置选择日期后是否要关掉界面。呵呵，原本是false。
            templateType: 'popup'
          };
          ionicDatePicker.openDatePicker(ipObj1);
        };
    
        $scope.openDatePickerTwo = function (val) {
          var ipObj1 = {
            callback: function (val) {  //Mandatory
              console.log('Return value from the datepicker modal is : ' + val, new Date(val));
              $scope.selectedDate2 = new Date(val);
            },
            titleLabel: '选择日期',
            closeLabel: '返回',
            from: new Date(),
            to: new Date(2099, 11, 31),// 11对应十二月，差1
            dateFormat: 'yyyy-MM-dd', //可选
            closeOnSelect: true, //可选,设置选择日期后是否要关掉界面。呵呵，原本是false。
            inputDate: new Date(),
            templateType: 'modal'
          };
          ionicDatePicker.openDatePicker(ipObj1);
        }

        $scope.$on('$destroy', function() {
           
        });
        
        // 微信上传图片
        var wxConfig = {};
        //获取微信签名
        // $myHttpService.post("api/utils/getWechatJsSign", {currenturl: window.location.href.split('#')[0]}, function(data) {
        //     console.log(data);
        //     wxConfig = {
        //         debug: false,
        //         appId: data.appId,
        //         timestamp: data.timestamp,
        //         nonceStr: data.nonceStr,
        //         signature: data.signature,
        //         jsApiList:['chooseImage', 'previewImage', 'uploadImage','downloadImage']
        //     },
        //     wx.config(wxConfig);
        //     wx.ready(function(){
        //         /* wx.onMenuShareAppMessage({
        //          title: "畅巴线路报名分享测试", // 分享标题
        //          desc: '畅巴线路报名分享测试描述', // 分享描述
        //          link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5d18456bf1ece6b3&redirect_uri=http%3a%2f%2fwechat.happyev.com%2fgetUserInfoByCode%3freturn%3dapp%2fbuy&response_type=code&scope=snsapi_base&state=123#wechat_redirect', // 分享链接
        //          type: 'link', // 分享类型,music、video或link，不填默认为link
        //          success: function () {
        //          layer.alert("你已分享成功！")
        //          },
        //          cancel: function () {
        //          layer.msg("你取消了分享！")
        //          // 用户取消分享后执行的回调函数
        //          }
        //          });*/
        //     });
        // });
        $scope.thumb = {};      //用于存放图片的base64
        $scope.getGuid = function() {
            function S4() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        }
        $scope.chooseImg = function($event) {

            console.log($event);

            wx.chooseImage({
                count: 2, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    for(var i = 0; i < localIds.length; i++) {
                        var guid = $scope.getGuid();   //通过时间戳创建一个随机数，作为键名使用
                        $scope.$apply(function(){
                            $scope.thumb[guid] = {
                                guid : guid,  
                            }
                        });
                    }
                },
                fail : function(res) {
                    alterShowMessage("操作提示", JSON.stringify(res), "1", "确定","", "", "");
                }
            });

        }

        // $scope.searchEmptyShow=false;//是否显示清除输入的图标
        // $scope.showMiddle=false; //是否在屏幕中央显示选中的字母索引
        // $scope.hIndex=(window.screen.height-44-4)/26;//右边侧边栏每个字母的高度，是屏幕高度减去标题栏的44，减去页面样式中的margin-top:2px，margin-bottom:2px,再除以26，这样以保证在各个手机屏幕上的字母的距离的均等性
        // var chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        // $scope.indexs=[];
        // loadData();
        // for(var i=0;i<chars.length;i++){
        //     $scope.indexs.push(chars.charAt(i));//获取字母数组 
        // }
        // $scope.startDot=function(){//判断清除输入框的图标是否显示
        //     if($scope.cityName.length=0 || $scope.cityName==""){
        //         $scope.searchEmptyShow=false;
        //     }else{
        //         $scope.searchEmptyShow=true;
        //     }
        // };
        // $scope.searchEmpty=function(){//点击清除输入框的图标的点击事件
        //     $scope.searchEmptyShow=false;
        //     $scope.cityName="";
        // };
        
        // $scope.mTouch=function(event){ 
        //   var positionX=event.pageX || event.touches[0].pageX;
        //   var positioinY=event.pageY || event.touches[0].pageY;
        //   var ele = document.elementFromPoint(positionX,positioinY);  
        //   if(!ele){
        //     return;
        //   }
        //   var c=ele.innerText;
        //   if(!c || c==" " || c.length!=1){
        //     return;
        //   }
        //   $scope.hint=c; 
        //   $scope.showMiddle=true;    
        
        //   var scroll = document.getElementById("city_"+$scope.hint).offsetTop -    $ionicScrollDelegate.getScrollPosition().top; 
        //   $ionicScrollDelegate.scrollBy(0,scroll,true);
        //   var ele = document.getElementsByTagName("ion-content");  
        //   ele[0].style.overflow="auto";  //解决滑动右边的导航字母后，左边不能再滚动的bug，可以试着注释这两句来测试这个问题
        
        // };
        
        // $scope.mRelease=function(){
        //     $timeout(function(){
        //         $scope.showMiddle=false;
        //     },300); 
        // };

        // function loadData(){//从本地的一个包含全国各城市的json文件中加载数据
        //     $ionicLoading.show(); 
        //     $http.get("json/city.json").success(function(data) {
        //         $scope.cityDatas=data.dataList;
        //         $ionicLoading.hide();
        //     });
        // } 


        // @城市搜索变量，由于是input元素中的双向绑定，所以需要使用对象来传递！
        $scope.data = {
            search: ''
        }
        $scope.current = ''; // @当前城市

        // @接收一个拼音，返回首字母大写
        $scope.getFirstLetter = function (word, fn) {
            fn(word.charAt(0).toUpperCase());
        }

        $scope.cityList = City.all(); // @从服务中获取城市数据

        var map = {};

        // @读取城市信息后，进行格式化
        angular.forEach($scope.cityList, function (value, key) {
            title = value.pinyin;
            $scope.getFirstLetter(title, function (ret) {
                if (map[ret]) {
                    map[ret].push(value);
                } else {
                    map[ret] = [value]
                }
            });
        });

        // @由于html中循环不能按首字母排序所以重新定义一个新数组
        $scope.citys = [];
        angular.forEach(map, function (value, key) {
            $scope.citys.push({
                'letter': key,
                'list': value
            });
        });
        console.log($scope.citys);

        // @跳转到点击字母位置并显示点击的字母，如果点击#号则跳到顶部
        $scope.showLetter = false;
        $scope.jumper = function (key) {

            if (key == '#') {

                $ionicScrollDelegate.scrollTop(); // @返回顶部
                return;

            } else {

                $scope.letter = key;
                // @点击侧边字母后屏幕中间的字母也显示,500毫秒隐藏
                if ($scope.showLetter == false) {
                    $scope.showLetter = true;
                    setTimeout(function () {
                        $scope.showLetter = false;
                        $scope.$apply();
                    }, 500)
                } else {
                    $scope.showLetter = false;
                }

                var el = document.getElementById('city-' + key); // @这个代码最骚，获取元素

                if (el) {
                    var scrollPosition = el.offsetTop; // @返回当前元素的y坐标
                    // @滚动到点击字母的位置。由于上面多了一个搜索框，所以y坐标高度要稍微加一点
                    $ionicScrollDelegate.scrollTo(0, scrollPosition + 80, true); // @scrollTo(left, top, [shouldAnimate])
                }
                var ele = angular.element(document.getElementsByTagName("ion-content"));
                console.log(ele);            
                // ele[0].style.overflow = "auto !important"; 
                ele[0].style.cssText = "overflow: auto !important";
            }
        }

        $scope.mTouch = function (event) {

            console.log(event);
            var positionX = event.gesture.center.pageX;
            var positioinY = event.gesture.center.pageY;

            var ele = document.elementFromPoint(positionX, positioinY);
            if (!ele) {
                return;
            }
            var key = ele.innerText;
            console.log(key);

            if (!key || key == " " || key.length != 1 || key == "#") {
                return;
            }

            if (key == '#') {

                $ionicScrollDelegate.scrollTop(); // @返回顶部
                return;

            } else {

                $scope.letter = key;
                // @点击侧边字母后屏幕中间的字母也显示,500毫秒隐藏
                if ($scope.showLetter == false) {
                    $scope.showLetter = true;
                    setTimeout(function () {
                        $scope.showLetter = false;
                        $scope.$apply();
                    }, 500)
                } else {
                    $scope.showLetter = false;
                }

                var el = document.getElementById('city-' + key); // @这个代码最骚，获取元素

                if (el) {
                    var scrollPosition = el.offsetTop; // @返回当前元素的y坐标
                    // @滚动到点击字母的位置。由于上面多了一个搜索框，所以y坐标高度要稍微加一点
                    $ionicScrollDelegate.scrollTo(0, scrollPosition + 80, true); // @scrollTo(left, top, [shouldAnimate])
                }
            }

            // var scroll = document.getElementById("city-" + $scope.hint).offsetTop - $ionicScrollDelegate.getScrollPosition().top;
            // $ionicScrollDelegate.scrollBy(0, scroll, true);
            var ele = angular.element(document.getElementsByTagName("ion-content"));            
            console.log(ele);
            // ele[0].style.overflow = "auto !important";  //解决滑动右边的导航字母后，左边不能再滚动的bug，可以试着注释这两句来测试这个问题
            ele[0].style.cssText = "overflow: auto !important";
            
        };

        $scope.mRelease = function () {
            $timeout(function () {
                $scope.showLetter = false;
            }, 300);
        };

        // @城市搜索函数
        $scope.searchCity = function () {
            // @搜索框搜索之后又清空列表数据为初始数据
            if ($scope.data.search == null || $scope.data.search == '') {

                $scope.citys = [];

                angular.forEach(map, function (value, key) {
                    $scope.citys.push({
                        'letter': key,
                        'list': value
                    });
                });

            } else {

                $scope.citys = [];
                var newList = [];
                var count = 0;
                angular.forEach($scope.cityList, function (value, key) {
                    if (value.city.indexOf($scope.data.search) > -1 || value.pinyin.charAt(0).indexOf($scope.data.search) > -1) {
                        count++;
                        newList.push(value);
                        if (count == 1) {
                            $scope.citys.push({
                                'letter': value.pinyin.charAt(0).toUpperCase(),
                                'list': newList
                            });
                        }
                    }
                });

                console.log($scope.citys);

            }
        }
      
        // @选择城市
        $scope.chooseCity = function(city){
            console.log(city);
            $scope.current = city;
        }

    })

    /**
     * @车辆位置页 控制器
     */ 
    .controller('BusPositionController', function($scope, $myHttpService, $timeout, $state) {

        if(JSON.parse($state.params.data) == null) {
            
            var lineArr = [
                    116.397428, // 经度
                    39.90923 // 纬度
            ];
            var map = new AMap.Map("J_map_canvas", {
                resizeEnable: true,
                center: [lineArr[0], lineArr[1]],
                zoom: 17
            });
            marker = new AMap.Marker({
                map: map,
                position: [lineArr[0], lineArr[1]],
                icon: "http://webapi.amap.com/images/car.png",
                content: '<i class="icon ion-ios-location" style="color: #f71909;font-size:30px"></i>',
                offset: new AMap.Pixel(-26, -13),
                animation: "AMAP_ANIMATION_DROP"
            });
            $timeout(function() {
                layer.open({
                    content: '请求车辆位置出错，请重试',
                    btn: '确定',
                    shadeClose: false,
                    yes: function(index) {
                        $state.go('myplan', {}, {location: 'replace'});
                        layer.close(index);
                    }
                });
            }, 1500);

        } else {

            var paramsData = JSON.parse($state.params.data);

            console.log("车辆位置页：传到定位地图页面的参数");
            console.log(paramsData);

            $scope.positionArr = {};

            // @查询车辆位置 /wechat/product/queryCarLocation
            $myHttpService.post('api/product/queryCarLocation', {
                carid: paramsData.carid,
                lineid: paramsData.lineid
            }, function(data) {  
                
                console.log("车辆位置页：查询车辆位置API返回的数据");
                console.log(data);

                $scope.positionArr = data.car;
                $scope.busline = data.busline;
                $scope.stations = data.stations;
                // @当前车辆位置 和 地图中心点 经纬度
                var lineArr = [
                    $scope.positionArr.currlon, // 经度
                    $scope.positionArr.currlat // 纬度
                ];
                // @高德地图绘制
                var map = new AMap.Map("J_map_canvas", {
                    resizeEnable: true,
                    center: [lineArr[0], lineArr[1]],
                    zoom: 11
                });

                // @所有站点的经纬度数组
                var allLonLatArr = [];

                // @所有停靠点的经纬度数组
                var stationType1 = [];

                for(var index in $scope.stations) { // @站点、停靠点提取操作
                    var item = $scope.stations[index];
                    var tempArr = [item.stalongitude, item.stalatitude];
                    allLonLatArr.push(tempArr);
                    if(item.stationType == 1) {
                        var tempArr2 = [
                            [
                                item.stalongitude,
                                item.stalatitude
                            ],
                            item.stationname
                        ];
                        stationType1.push(tempArr2);
                    }
                }

                // @起点站点 经纬度
                var startPositionLonLat = [
                    $scope.busline.departlon,
                    $scope.busline.departlat
                ];
                // @终点站点 经纬度
                var endPositionLonLat = [
                    $scope.busline.arrivelon,
                    $scope.busline.arrivelat
                ];

                // @中间站点、途径点
                var allLonLatArr2 = allLonLatArr.slice(1, allLonLatArr.length-1); // @去掉首尾的经纬点

                AMapUI.load(['ui/overlay/SimpleMarker'], function(SimpleMarker) {

                    // @路径规划绘制 
                    AMap.plugin('AMap.Driving', function() {
                        var drving = new AMap.Driving({
                            map: map,
                            hideMarkers: true
                        })
                        drving.search(startPositionLonLat, endPositionLonLat, {waypoints: allLonLatArr2}, function(status, result) {

                            for(var index in stationType1) {
                                var item = stationType1[index];
                                if(index == 0) {
                                    new SimpleMarker({
                                        iconLabel: {
                                            innerHTML: '起',
                                            style: {
                                                color: '#fff',
                                                fontSize: '120%',
                                                marginTop: '2px'
                                            }
                                        },
                                        iconStyle: 'green',
                                        map: map,
                                        position: item[0],
                                        label: {
                                            content: item[1],
                                            offset: new AMap.Pixel(11, 43) // (left, top)
                                        }
                                    });
                                } else if( index == stationType1.length-1) {
                                    new SimpleMarker({
                                        iconLabel: {
                                            innerHTML: '终',
                                            style: {
                                                color: '#fff',
                                                fontSize: '120%',
                                                marginTop: '2px'
                                            }
                                        },
                                        iconStyle: 'red',
                                        map: map,
                                        position: item[0],
                                        label: {
                                            content: item[1],
                                            offset: new AMap.Pixel(11, 43) // (left, top)
                                        }
                                    });
                                } else {
                                    new SimpleMarker({
                                        iconLabel: {
                                            innerHTML: '经',
                                            style: {
                                                color: '#fff',
                                                fontSize: '120%',
                                                marginTop: '2px'
                                            }
                                        },
                                        iconStyle: 'orange',
                                        map: map,
                                        position: item[0],
                                        label: {
                                            content: item[1],
                                            offset: new AMap.Pixel(11, 43) // (left, top)
                                        }
                                    });
                                }
                            }
                        });
                    });
                })

            /* 
                AMapUI.load(['ui/misc/PathSimplifier', 'ui/overlay/SimpleMarker'], function(PathSimplifier, SimpleMarker) {
                    
                    if (!PathSimplifier.supportCanvas) {
                        alert('当前环境不支持 Canvas！');
                        // 起点站点 经纬度
                        var startPositionLonLat = [
                            $scope.busline.departlon,
                            $scope.busline.departlat
                        ];
                        // 终点站点 经纬度
                        var endPositionLonLat = [
                            $scope.busline.arrivelon,
                            $scope.busline.arrivelat
                        ];
                        // 路径规划绘制
                        AMap.plugin('AMap.Driving', function() {
                            var drving = new AMap.Driving({
                                map: map
                            })
                            drving.search(startPositionLonLat, endPositionLonLat);
                        });
                        return;
                    }
                    
                    var pathSimplifierIns = new PathSimplifier({
                        zIndex: 100,
                        //autoSetFitView:false,
                        map: map, //所属的地图实例
                        getPath: function(pathData, pathIndex) {
                            return pathData.path;
                        },
                        getHoverTitle: function(pathData, pathIndex, pointIndex) {
            
                            if (pointIndex >= 0) {
                                //point 
                                return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
                            }
                            return pathData.name + '，点数量' + pathData.path.length;
                        },
                        renderOptions: {
                            renderAllPointsIfNumberBelow: 100, //绘制路线节点，如不需要可设置为-1
                                //轨迹线的样式
                            pathLineStyle: {
                                strokeStyle: 'red',
                                lineWidth: 6,
                                dirArrowStyle: true
                            }
                        }
                    });
                    
                    window.pathSimplifierIns = pathSimplifierIns;

                    //设置数据
                    pathSimplifierIns.setData([{
                        name: '车辆运行路线',
                        path: allLonLatArr
                    }]);

                    for(var index in stationType1) {
                        var item = stationType1[index];

                        new AMap.Marker({
                            map: map,
                            position: item[0],
                            content: '<i class="icon ion-flag" style="font-size:22px"></i>',
                            label: {
                                content: item[1],
                                offset: new AMap.Pixel(11, 31) // (left, top)
                            }
                        });

                    }
                    
                    //对第一条线路（即索引 0）创建一个巡航器
                    var navg1 = pathSimplifierIns.createPathNavigator(0, {
                        loop: true, //循环播放
                        speed: 2500 //巡航速度，单位千米/小时
                    });
            
                    navg1.start();
                });
            */
                
                $timeout(function() {
                    var marker = new AMap.Marker({
                        map: map,
                        position: [lineArr[0], lineArr[1]],
                        content: '<i class="icon ion-ios-location" style="color: #f71909;font-size:30px"></i>',
                        animation: "AMAP_ANIMATION_DROP"
                    });
                    var circle = new AMap.Circle({
                        map: map,
                        center: [lineArr[0], lineArr[1]],
                        redius: 100,
                        fillOpacity: 0.1,
                        fillColor: '#09f',
                        strokeColor: '#09f',
                        strokeWeight: 1
                    });
                    // @逆地理编码
                    AMap.plugin('AMap.Geocoder', function() {
                        var str = "加载中>>>";
                        var geocoder = new AMap.Geocoder({});
                        geocoder.getAddress([lineArr[0], lineArr[1]], function(status, result) {
                            if(status == 'complete') {
                               str = result.regeocode.formattedAddress
                               var info = new AMap.InfoWindow({
                                    content: '<div class="title_bus_position">当前车辆位置</div><div class="content_bus_position">'+
                                                    str + '<br/></div>',
                                    offset: new AMap.Pixel(0,-28),
                                    size: new AMap.Size(200,0)
                                });
                                info.open(map,  [lineArr[0], lineArr[1]]);
                            }
                        });
                    });
                }, 1500);

            }, errorFn);
        }
    })

    /**
     * @车票详情页 控制器 2、4、5 三种状态
     */
    .controller('ticket_detail', function($rootScope, $scope, $filter, $interval, $timeout, $myHttpService, $state, $myLocationService, $ionicScrollDelegate) {

        $scope.timeShow = false;
        $scope.timeText = "距离发车时间还剩";

        $scope.lunXunTimer = null; // @轮询定时器
        
        $scope.isCheckedTicket = false; // @未验票

        // @倒计时间处理函数
        var stopCountDown = null;
        function ShowCountDown(endTime) { 
			var now = new Date(); 
			var leftTime = endTime - now.getTime();
			if(leftTime > 0) {
				var leftsecond = parseInt(leftTime / 1000);
				$scope.day = Math.floor(leftsecond / (60 * 60 * 24));
				$scope.hour = Math.floor((leftsecond - $scope.day * 24 * 60 * 60) / 3600); 
				$scope.minute = Math.floor((leftsecond - $scope.day * 24 * 60 * 60 - $scope.hour * 3600) / 60); 
				$scope.second = Math.floor(leftsecond - $scope.day * 24 * 60 * 60 - $scope.hour * 3600 - $scope.minute * 60);
			} else {
                clearInterval(stopCountDown);
                $scope.timeText = "";
                $scope.timeShow = false;
			}
		}

        if(JSON.parse($state.params.data) == null) { // @进入页面没有参数时

            var viewOrderid = sessionStorage.getItem('jqztc_cpxqy_viewOrderid'); // @订单ID

            // @查询订单详情 wechat/product/queryUserProductTicketDetails            
            $myHttpService.post('api/product/queryUserProductTicketDetails', {viewOrderid: viewOrderid}, function(data) {
                
                console.log("车票详情页：查询订单详情API返回的数据");
                console.log(data);

                $scope.ticketInfo = data.viewOrder; // @车票对象
                $scope.viewOrderid = $scope.ticketInfo.viewOrderid; // @车票订单

                // @是否轮询判断，只有当票为2状态时才会进行轮询
                if($scope.ticketInfo.viewOrderStatus == 2) {

                    lunXunTimer = $interval(function() { // @轮询函数

                        // @查询车票状态 wechat/product/queryTicketStatus
                        $myHttpService.post('api/product/queryTicketStatus', {viewOrderid: $scope.viewOrderid}, function(data) {

                            if(data.viewOrderStatus == 3) {
                                $scope.isCheckedTicket = true; // @已验票
                            }

                        });

                    }, 15000);

                }

                // @退款参数封装
                if(data.viewOrder.rechargeid != null) {
                    
                    $scope.refundData = {
                        rechargeid: data.viewOrder.rechargeid,
                        userid: $rootScope.session.user.userInfo.userid,
                        openid: $rootScope.session.user.userInfo.openid,
                        viewOrderid: data.viewOrder.viewOrderid,
                        applyResult: false
                    };

                } else {

                    $scope.refundData = {
                        userid: $rootScope.session.user.userInfo.userid,
                        openid: $rootScope.session.user.userInfo.openid,
                        viewOrderid: data.viewOrder.viewOrderid,
                        applyResult: false
                    };

                }

                // @倒计时处理
                $timeout(function() {
                    $scope.timeShow = true;
                }, 1500);

                var temp = $filter('date')($scope.ticketInfo.departDate, 'yyyy/MM/dd') + " " + $scope.ticketInfo.departTime;
                var endTime = (new Date(temp)).getTime();
                stopTime = $interval(function() {
                    ShowCountDown(endTime);
                }, 1000);

            }, errorFn);

        } else { // @进入页面有参数时

            var paramsData = JSON.parse($state.params.data);

            console.log("车票详情页：参数打印");
            console.log(paramsData);

            var requestData = {
                viewOrderid: paramsData.viewOrderid // @订单ID
            };

            sessionStorage.setItem('jqztc_cpxqy_viewOrderid', paramsData.viewOrderid); // @存储数据，以便后用

            // @查询订单详情 wechat/product/queryUserProductTicketDetails
            $myHttpService.post('api/product/queryUserProductTicketDetails', requestData, function(data) {
                
                console.log("车票详情页：查询订单详情API返回的数据");
                console.log(data);

                $scope.ticketInfo = data.viewOrder; // @车票对象
                $scope.viewOrderid = $scope.ticketInfo.viewOrderid; // @车票订单ID

                // @是否轮询判断，只有当票为2状态时才会进行轮询
                if($scope.ticketInfo.viewOrderStatus == 2) {

                    lunXunTimer = $interval(function() { // @轮询函数

                        // @查询车票状态 wechat/product/queryTicketStatus
                        $myHttpService.post('api/product/queryTicketStatus', {viewOrderid: $scope.viewOrderid}, function(data) {

                            if(data.viewOrderStatus == 3) {
                                $scope.isCheckedTicket = true; // @已验票
                            }

                        });

                    }, 15000);

                }

                // @退款参数封装
                if(data.viewOrder.rechargeid != null) {

                    $scope.refundData = {
                        rechargeid: data.viewOrder.rechargeid,
                        userid: $rootScope.session.user.userInfo.userid,
                        openid: $rootScope.session.user.userInfo.openid,
                        viewOrderid: data.viewOrder.viewOrderid,
                        applyResult: false
                    };

                } else {

                    $scope.refundData = {
                        userid: $rootScope.session.user.userInfo.userid,
                        openid: $rootScope.session.user.userInfo.openid,
                        viewOrderid: data.viewOrder.viewOrderid,
                        applyResult: false
                    };

                }
                
                // @倒计时处理
                $timeout(function() {
                    $scope.timeShow = true;
                }, 1500);

                var temp = $filter('date')($scope.ticketInfo.departDate, 'yyyy/MM/dd') + " " + $scope.ticketInfo.departTime;
                var endTime = (new Date(temp)).getTime();
                stopTime = $interval(function() {
                    ShowCountDown(endTime);
                }, 1000);

            }, errorFn);

        }

        $scope.$on("$destroy", function() { 
            $interval.cancel(stopTime); // @定时器销毁
            $interval.cancel(lunXunTimer); // @定时器销毁
        });

        $scope.refundBtnState = false; // @退款按钮控制状态，false为可用，true为不可用

        // @退款函数
        $scope.refund = function() {

                layer.open({
                    content: '您确定要退款吗？',
                    btn: ['退款', '取消'],
                    shadeClose: false,
                    yes: function(index) {

                        console.log("车票详情页: 退款参数");
                        console.log($scope.refundData);

                        // @申请退款 wechat/product/applyRefund
                        $myHttpService.post('api/product/applyRefund', $scope.refundData, function(data) {

                            console.log("车票详情页: 退款申请API返回的数据");
                            console.log(data);

                            if(data.counponUse == true) {  

                                if(data.couponRefund == true) {
                                    $scope.refundBtnState = true;
                                    layer.open({
                                        content: '退款成功',
                                        btn: '确定',
                                        shadeClose: false,
                                        yes: function(index) {
                                            $state.go('myplan', {}, {location: 'replace'});
                                            layer.close(index);
                                        }
                                    });
                                } else {
                                    $scope.refundBtnState = false;
                                    layer.open({
                                        content: '申请退款失败，请稍后重试',
                                        btn: '确定',
                                        shadeClose: false,
                                        yes: function(index) {
                                            // $state.go('myplan', {}, {location: 'replace'});
                                            // layer.close(index);
                                        }
                                    });
                                }

                            } else {

                                $scope.refundBtnState = true;
                                layer.open({
                                    content: '申请退款成功，退款将按原路返回到支付账户，预计到账时间为0-3个工作日',
                                    btn: '确定',
                                    shadeClose: false,
                                    yes: function(index) {
                                        $state.go('myplan', {}, {location: 'replace'});
                                        layer.close(index);
                                    }
                                })

                            }

                        }, errorFn);

                        layer.close(index);
                    }
                });
        }

        // @车辆位置函数
        $scope.getBusPosition = function() {
            var data = {
                carid: $scope.ticketInfo.carid,
                lineid: $scope.ticketInfo.lineid
            };
            $state.go('ticket_detail.bus_position', {data: JSON.stringify(data)}, {reload: true});
        }

    })

    /**
     * @车票评价页 控制器 3 一种状态 已使用（已评价、未评价）
     */ 
    .controller('order_check_comment', function($rootScope, $scope, $timeout, $state, $filter, $myHttpService) {

        $scope.submitBtnIsDiasbled = true; // 控制提交按钮的状态

        if(JSON.parse($state.params.data) == null) {
            $state.go('myplan');
        } else {

            // @接受参数
            $scope.isCommented = JSON.parse($state.params.isCommented); // @是否已评论
            $scope.isCommentedText = JSON.parse($state.params.isCommentedText); // @评论文字
            $scope.isCommentedScore = JSON.parse($state.params.isCommentedScore); // @评论分数

            var paramsData = JSON.parse($state.params.data);

            console.log("车票评价页：接收参数");            
            console.log(paramsData);

            $scope.ticketInfo = paramsData; // @车票对象
            $scope.productid = $scope.ticketInfo.productid; // @产品ID
            $scope.viewOrderid = $scope.ticketInfo.viewOrderid; // @订单ID
            
            // @由于ionic的原因，必须要是对象来接收数据
            $scope.dataContainer = {
                text: ""
            }

            // @星星 调用了Star的指令，这里是相关的配置信息
            $scope.max = 5; // @星星数量
            $scope.ratingVal = 5; // @默认点亮数量
            $scope.readonly = false; // @是否只读
            $scope.onHover = function(val) {$scope.ratingVal = val;};
            $scope.onLeave = function() {};

            // @评价提交按钮状态 监测函数
            $scope.submitBtnCheck = function() {
                if($scope.dataContainer.text) {
                    $scope.submitBtnIsDiasbled = false;
                } else {
                    $scope.submitBtnIsDiasbled = true;
                }
            };

            // @提交数据
            $scope.submitComment = function() {

                // @封装数据
                var data = {
                    productid: $scope.productid, // @产品ID
                    userid: $rootScope.session.user.userInfo.userid,// @用户ID
                    orderScore: $scope.ratingVal, // @订单评分
                    orderhie: $scope.dataContainer.text, // @订单评价
                    orderid: $scope.viewOrderid // @订单ID
                };

                console.log("车票评价页：评论提交参数");                
                console.log(data);

                // @插入评论wechat/product/insertViewOrderHierarchy
                $myHttpService.post('api/product/insertViewOrderHierarchy', data, function(data) {

                    $scope.readonly = true; // @true 评论星星 只读
                    $scope.isCommented = true; // @true 产品已评价
                    $scope.isCommentedText = $scope.dataContainer.text; // @评价
                    $scope.isCommentedScore = $scope.ratingVal; // @评分

                    layer.open({
                        content: '评价提交成功',
                        btn: '确定',
                        shadeClose: false,
                        yes: function(index){
                            layer.close(index);
                        }
                    });
                    
                }, errorFn);
            };

        }
    })

    /**
     * @门票详情页 控制器 2、3、4、5 四种状态
     */
    .controller('admission_ticket_detail', function($rootScope, $scope, $filter, $interval, $myHttpService, $state, $myLocationService, $ionicScrollDelegate) {

        $scope.refundBtnState = false; // @退款按钮的状态控制

        $scope.isCheckedTicket = false; // @未验票
        $scope.lunXunTimer = null; // @轮询定时器

        var paramsData = JSON.parse($state.params.data); // @参数解析

        console.log("门票详情页：参数打印");
        console.log(paramsData);

        // @查询用户已购买景区门票详情 wechat/ticketorder/queryUserDoorTicketDetails
        $myHttpService.post('api/ticketorder/queryUserDoorTicketDetails', {orderid: paramsData.orderid}, function(data) {
            
            console.log("门票详情页：查询订单详情API返回的数据");
            console.log(data);

            $scope.ticketViewInfo = data.ticketOrder; // @门票对象

            $scope.orderid = $scope.ticketViewInfo.orderid; // @门票订单ID

                // @是否轮询判断，只有当票为2状态时才会进行轮询
                if($scope.ticketViewInfo.viewOrderStatus == 2) {

                    lunXunTimer = $interval(function() { // @轮询函数 15s

                        // @查询门票状态 wechat/ticketorder/queryDoorTicketStatus
                        $myHttpService.post('api/ticketorder/queryDoorTicketStatus', {orderid: $scope.orderid}, function(data) {

                            if(data.ticketStatus == 3) {
                                $scope.isCheckedTicket = true; // @已验票
                            }

                        });

                    }, 15000);

                }

            // @门票退款参数封装
            if(data.ticketOrder.rechargeid != null) {

                $scope.refundData = {
                    rechargeid: data.ticketOrder.rechargeid,
                    userid: $rootScope.session.user.userInfo.userid,
                    openid: $rootScope.session.user.userInfo.openid,
                    orderid: data.ticketOrder.orderid,
                    applyResult: false
                };

            } else {

                $scope.refundData = {
                    userid: $rootScope.session.user.userInfo.userid,
                    openid: $rootScope.session.user.userInfo.openid,
                    orderid: data.ticketOrder.orderid,
                    applyResult: false
                };

            }

        }, errorFn);
        
        // @退款函数
        $scope.refund = function() {

                layer.open({
                    content: '您确定要退款吗？',
                    btn: ['退款', '取消'],
                    shadeClose: false,
                    yes: function(index) {

                        console.log("门票详情页: 退款参数");
                        console.log($scope.refundData);

                        // @申请门票退款 wechat/ticketorder/applyDoorTicketRefund
                        $myHttpService.post('api/ticketorder/applyDoorTicketRefund', $scope.refundData, function(data) {

                            console.log("门票详情页: 退款申请API返回的数据");
                            console.log(data);

                            if(data.counponUse == true) {  

                                if(data.couponRefund == true) {
                                    $scope.refundBtnState = true;
                                    layer.open({
                                        content: '退款成功',
                                        btn: '确定',
                                        shadeClose: false,
                                        yes: function(index) {
                                            $state.go('myplan', {}, {location: 'replace'});
                                            layer.close(index);
                                        }
                                    });
                                } else {
                                    $scope.refundBtnState = false;
                                    layer.open({
                                        content: '申请退款失败，请稍后重试',
                                        btn: '确定',
                                        shadeClose: false,
                                        yes: function(index) {
                                            // $state.go('myplan', {}, {location: 'replace'});
                                            // layer.close(index);
                                        }
                                    });
                                }

                            } else {

                                $scope.refundBtnState = true;
                                layer.open({
                                    content: '申请退款成功，退款将按原路返回到支付账户，预计到账时间为0-3个工作日',
                                    btn: '确定',
                                    shadeClose: false,
                                    yes: function(index) {
                                        $state.go('myplan', {}, {location: 'replace'});
                                        layer.close(index);
                                    }
                                })

                            }

                        }, errorFn);

                        layer.close(index);
                    }
                });
        }

        $scope.$on("$destroy", function() { 
            $interval.cancel(lunXunTimer); // @定时器销毁
        });

    })

    /**
     * @我的个人页 信息保存 编辑 控制器
     */
    .controller('IUserController', function($rootScope, $scope, $location, $state, $myHttpService) {
        
        $scope.tempUser = {};
        var tempUser2 = {};

        $myHttpService.post("api/user/queryUserinfo", {
            userid: $rootScope.session.user.userInfo.userid
        }, function(data) {
            if(data.flag) {
                $scope.user = data.user;
                if($scope.user.userid.length > 4) {
                    $scope.userOther = $scope.user.userid.substring(0, 6) + "*****" + $scope.user.userid.substring($scope.user.userid.length-4);
                } else {
                    $scope.userOther = $scope.user.userid.substring(0, 6) + "*****";                    
                }
                tempUser2 = angular.copy($scope.user);
            } else {
                $state.go('auth.login');
            }
        });

        $scope.editMode = false;
        $scope.editCance = false;
        $scope.editButtonText = "设置";

        $scope.edit = function() {
            if($scope.editMode == false) {
                $scope.editCance = true;
                $scope.editMode = !$scope.editMode;
                $scope.tempUser = angular.copy($scope.user);
                $scope.editButtonText = "保存";
            } else {
                // 加个判断，当用户输入长度有误时进行提醒
                if( $scope.tempUser.username.length < 2 || $scope.tempUser.username.length > 4 || !(/^[\u4e00-\u9fa5]{2,4}$/.test($scope.tempUser.username)) || $scope.tempUser.phone.length != 11 || !(/^1(3|4|5|7|8)\d{9}$/.test($scope.tempUser.phone)) ) {
                    if($scope.tempUser.username.length > 4 || $scope.tempUser.username.length < 2 || !(/^[\u4e00-\u9fa5]{2,4}$/.test($scope.tempUser.username))) {
                        layer.open({
                            content: '输入的姓名格式有误，长度为2-4个中文',
                            btn: '确定'
                        });
                    } else if($scope.tempUser.phone.length != 11) {
                        layer.open({
                            content: '输入的手机号有误，长度为11个数字',
                            btn: '确定'
                        });
                    } else if(!(/^1(3|4|5|7|8)\d{9}$/.test($scope.tempUser.phone))) {
                        layer.open({
                            content: '输入的手机号格式有误',
                            btn: '确定'
                        });
                    }
                } else {
                    $scope.editMode = !$scope.editMode;
                    $scope.editButtonText = "设置";
                    $scope.editCance = false;                
                    //保存用户信息
                    $myHttpService.post("api/user/modifyUserInfo", $scope.tempUser, function(data) {
                        $scope.user = angular.copy($scope.tempUser);
                    });
                }
            }
        }

        $scope.cancel = function() {
            $scope.editMode = false;
            $scope.editButtonText = "设置";
            $scope.editCance = false;
            $scope.user = angular.copy(tempUser2);
        }
    })

/**
 *                              _ooOoo_
 *                            o8888888o
 *                            88"   .   "88
 *                             (|   -_-   |)
 *                             o\   =   /o
 *                         ____/`---'\____
 *                      .'  \\|              |//  `.
 *                    /  \\|||       :        |||//  \
 *                   /  _|||||       _:_        |||||-  \
 *                   |   | \\\     - -      /// |   |
 *                    | \_|  ''\   ----   /''  |   |
 *                     \  .-\__  `-`  ___/-. /
 *                   ___`. .'   /--.--\    `. . __
 *                ."" '<  `.___\_<|> _/___.'    >'"".
 *               | | :  `- \`.;`\    _     /`;.`/ - ` : | |
 *               \  \ `-.   \_ __\ /__ _/   .-` /  /
 *   ======`-.____`-.___\_____/___.-`____.-'======
 *                               `=---='
 *   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                     佛祖保佑        永无BUG
 *                     佛祖保佑        永无BUG
 */
    