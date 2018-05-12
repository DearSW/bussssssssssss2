app

// @地理定位服务
.service('$myLocationService', function($ionicLoading) {

    var el = document.createElement('div');
    el.id = "map" + new Date().getTime();
    el.style = "width:0;height:0";
    document.body.appendChild(el)
    var map, geolocation, geocoder;

    //加载地图，调用浏览器定位服务
    if(  typeof AMap  != "undefined" && AMap.Map instanceof Function ) {

        map = new AMap.Map(el.id, {
            resizeEnable: true
        });
        geocoder = new AMap.Geocoder({
            radius: 1000,
            city:'027',
            extensions: "all"
        });

        this.getCurrentPosition = function(callback) {
            //$ionicLoading.show();
            /**
             * 获取用户的当前位置
             */
            map.plugin('AMap.Geolocation', function() {
                geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    convert:true
                });
                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', function(data) {
                    geocoder.getAddress(data.position, function(status, result) {
                        //$ionicLoading.hide();
                        // document.body.removeChild(el);
                        if (status === 'complete' && result.info === 'OK') {
                            if(result.regeocode.pois && result.regeocode.pois.length > 0) {
                                callback(result.regeocode.pois);
                            } else {
                                callback([]);
                            }
                        }
                    });
                });//返回定位信息
                AMap.event.addListener(geolocation, 'error', function(data) {
                    alert("您禁止了授权定位信息,若想继续操作请输入地址信息");
                });
            });
        };
        /**
         *根据经纬度获取附近的兴趣点列表
        */
        this.getPoisByLngLat = function(lngLat, callback) {
            geocoder.getAddress(lngLat, function(status, result) {
                // document.body.removeChild(el);
                if (status === 'complete' && result.info === 'OK') {
                    if(result.regeocode.pois && result.regeocode.pois.length > 0) {
                        callback(result.regeocode.pois);
                    } else {
                        callback([]);
                    }
                }
            });
        }
        /**
         * 根据关键词返回兴趣点列表
         * @param address 关键词
         * @param callback
         */
        this.AddressByKeyword = function(keyword, callback) {
            geocoder.getLocation(keyword, function(status, result) {
                console.log(status);
                if (status === 'complete' && result.info === 'OK') {
                    console.log(result);
                    if(result.geocodes.pois && result.regeocode.pois.length > 0) {
                        //callback(result.regeocode.pois);
                    } else {
                        //callback([]);
                    }
                }
            });
        }
        //{city:"武汉",datatype:"poi"}
        this.getPoisByKeyword = function(keyword, callback) {
            AMap.service(['AMap.Autocomplete'], function() {
                var auto = new AMap.Autocomplete({city:"武汉",datatype:"all"});
                if(keyword.length > 0) {
                    auto.search(keyword,function(status,result) {
                        if(status == "complete") {
                            callback(result.tips);
                        } else if(status == "no_data") {
                            callback([]);
                        }
                    });
                }
            })
        }

    } else {
        console.log("AMap未定义");
    }
    
})

// @封装HTTP请求服务
.service('$myHttpService', function($http, $ionicLoading) {

    // @带遮罩层的POST请求
    this.post = function(url, data, success, error) {

        // $ionicLoading，用一个覆盖层表示当前处于活动状态，来阻止用户的交互动作。
        $ionicLoading.show({
            template: '<ion-spinner icon="ios-small"></ion-spinner><div style="font-weight: bold;font-size: 14px;">加载中</div>',
            noBackdrop: true
        });

        $http.post(url, data).success(function(data) {
            window.setTimeout(function() {
                $ionicLoading.hide();
            }, 250);
            if(data.code == 0) {
                success(data.data);
            } else {
                var errorMsg = "";
                if(data.data.msg) {
                    errorMsg = data.data.msg;
                } else {
                    errorMsg = data.data;
                }
                if(layer) {
                    layer.alert(errorMsg);
                } else {
                    alert(errorMsg);
                }
                if(error) {
                    error(data.data);
                }
            }
            //$scope.dt = $scope.driver.birthday;
        }).error(function(e) {
            $ionicLoading.hide();
            if(layer) {
                layer.alert(e.message);
            } else {
                alert(e.message);
            }
            if(error) {
                error(e);
            }
        });

    };

    // @不带遮罩层的POST请求
    this.postNoLoad = function(url, data, success, error) {

        $http.post(url, data).success(function(data) {
            if(data.code == 0) {
                success(data.data);
            } else {
                var errorMsg = "";
                if(data.data.msg) {
                    errorMsg = data.data.msg;
                } else {
                    errorMsg = data.data;
                }
                if(layer) {
                    layer.alert(errorMsg);
                } else {
                    alert(errorMsg);
                }
                if(error) {
                    error(data.data);
                }
            }
            //$scope.dt = $scope.driver.birthday;
        }).error(function(e) {
            if(layer) {
                layer.alert(e.message);
            } else {
                alert(e.message);
            }
            if(error) {
                error(e);
            }
        });

    };

    // @带遮罩层的GET请求
    this.get = function(url, data, success, error) {

        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-assertive"></ion-spinner>',
            noBackdrop: true
        });

        $http.get(url, data).success(function(data) {
            $ionicLoading.hide();
            if(data.code == 0) {
                success(data.data);
            } else {
                var errorMsg = "";
                if(data.data.msg) {
                    errorMsg = data.data.msg;
                } else {
                    errorMsg = data.data;
                }
                if(layer) {
                    layer.alert(errorMsg);
                } else {
                    alert(errorMsg);
                }
                if(error) {
                    error(data.data);
                }
            }
            //$scope.dt = $scope.driver.birthday;
        }).error(function(e) {
            $ionicLoading.hide();
            if(layer) {
                layer.alert(e.message);
            } else {
                alert(e.message);
            }
            if(error) {
                error(e);
            }
        });

    }

})

// @城市服务
.service('$selectCity', function() {

    this.getCity = function(callback) {
        var citysearch = new AMap.CitySearch();
        citysearch.getLocalCity(function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                if (result && result.city ) {
                    callback(result.city);
                } else {
                    callback([]);
                }
            }
        })
    }
    
})

// @城市JSON
.service('$jsonCity', function(){
    var citys = [
         {
             "id": "1", 
             "city": "北京市", 
             "pinyin": "beijingshi"
         }, 
         {
             "id": "2", 
             "city": "天津市", 
             "pinyin": "tianjinshi"
         }, 
         {
             "id": "3", 
             "city": "保定市", 
             "pinyin": "baodingshi"
         }, 
         {
             "id": "4", 
             "city": "秦皇岛市", 
             "pinyin": "qinhuangdaoshi"
         }, 
         {
             "id": "5", 
             "city": "唐山市", 
             "pinyin": "tangshanshi"
         }, 
         {
             "id": "6", 
             "city": "石家庄市", 
             "pinyin": "shijiazhuangshi"
         }, 
         {
             "id": "7", 
             "city": "邯郸市", 
             "pinyin": "handanshi"
         }, 
         {
             "id": "8", 
             "city": "廊坊市", 
             "pinyin": "langfangshi"
         }, 
         {
             "id": "9", 
             "city": "三河市", 
             "pinyin": "sanheshi"
         }, 
         {
             "id": "10", 
             "city": "张家口市", 
             "pinyin": "zhangjiakoushi"
         }, 
         {
             "id": "11", 
             "city": "承德市", 
             "pinyin": "chengdeshi"
         }, 
         {
             "id": "12", 
             "city": "沧州市", 
             "pinyin": "cangzhoushi"
         }, 
         {
             "id": "13", 
             "city": "邢台市", 
             "pinyin": "xingtaishi"
         }, 
         {
             "id": "14", 
             "city": "衡水市", 
             "pinyin": "hengshuishi"
         }, 
         {
             "id": "15", 
             "city": "太原市", 
             "pinyin": "taiyuanshi"
         }, 
         {
             "id": "16", 
             "city": "太谷县", 
             "pinyin": "taiguxian"
         }, 
         {
             "id": "17", 
             "city": "临汾市", 
             "pinyin": "linfenshi"
         }, 
         {
             "id": "18", 
             "city": "大同市", 
             "pinyin": "datongshi"
         }, 
         {
             "id": "19", 
             "city": "长治市", 
             "pinyin": "changzhishi"
         }, 
         {
             "id": "20", 
             "city": "吕梁市", 
             "pinyin": "luliangshi"
         }, 
         {
             "id": "21", 
             "city": "忻州市", 
             "pinyin": "xinzhoushi"
         }, 
         {
             "id": "22", 
             "city": "运城市", 
             "pinyin": "yunchengshi"
         }, 
         {
             "id": "23", 
             "city": "晋中市", 
             "pinyin": "jinzhongshi"
         }, 
         {
             "id": "24", 
             "city": "阳泉市", 
             "pinyin": "yangquanshi"
         }, 
         {
             "id": "25", 
             "city": "晋城市", 
             "pinyin": "jinchengshi"
         }, 
         {
             "id": "26", 
             "city": "朔州市", 
             "pinyin": "shuozhoushi"
         }, 
         {
             "id": "27", 
             "city": "呼和浩特市", 
             "pinyin": "huhehaoteshi"
         }, 
         {
             "id": "28", 
             "city": "包头市", 
             "pinyin": "baotoushi"
         }, 
         {
             "id": "29", 
             "city": "通辽市", 
             "pinyin": "tongliaoshi"
         }, 
         {
             "id": "30", 
             "city": "临河市", 
             "pinyin": "linheshi"
         }, 
         {
             "id": "31", 
             "city": "赤峰市", 
             "pinyin": "chifengshi"
         }, 
         {
             "id": "32", 
             "city": "集宁市", 
             "pinyin": "jiningshi"
         }, 
         {
             "id": "33", 
             "city": "海拉尔", 
             "pinyin": "hailaer"
         }, 
         {
             "id": "34", 
             "city": "乌兰察布市", 
             "pinyin": "wulanchabushi"
         }, 
         {
             "id": "35", 
             "city": "满洲里市", 
             "pinyin": "manzhoulishi"
         }, 
         {
             "id": "36", 
             "city": "乌海市", 
             "pinyin": "wuhaishi"
         }, 
         {
             "id": "37", 
             "city": "阿拉善", 
             "pinyin": "alashan"
         }, 
         {
             "id": "38", 
             "city": "巴彦淖尔市", 
             "pinyin": "bayannaoershi"
         }, 
         {
             "id": "39", 
             "city": "科尔沁市", 
             "pinyin": "keerqinshi"
         }, 
         {
             "id": "40", 
             "city": "锡林郭勒盟", 
             "pinyin": "xilinguolemeng"
         }, 
         {
             "id": "41", 
             "city": "乌兰浩特市", 
             "pinyin": "wulanhaoteshi"
         }, 
         {
             "id": "42", 
             "city": "鄂尔多斯市", 
             "pinyin": "eerduosishi"
         }, 
         {
             "id": "43", 
             "city": "呼伦贝尔市", 
             "pinyin": "hulunbeiershi"
         }, 
         {
             "id": "44", 
             "city": "大连市", 
             "pinyin": "dalianshi"
         }, 
         {
             "id": "45", 
             "city": "沈阳市", 
             "pinyin": "shenyangshi"
         }, 
         {
             "id": "46", 
             "city": "阜新市", 
             "pinyin": "fuxinshi"
         }, 
         {
             "id": "47", 
             "city": "抚顺市", 
             "pinyin": "fushunshi"
         }, 
         {
             "id": "48", 
             "city": "鞍山市", 
             "pinyin": "anshanshi"
         }, 
         {
             "id": "49", 
             "city": "锦州市", 
             "pinyin": "jinzhoushi"
         }, 
         {
             "id": "50", 
             "city": "本溪市", 
             "pinyin": "benxishi"
         }, 
         {
             "id": "51", 
             "city": "葫芦岛市", 
             "pinyin": "huludaoshi"
         }, 
         {
             "id": "52", 
             "city": "丹东市", 
             "pinyin": "dandongshi"
         }, 
         {
             "id": "53", 
             "city": "朝阳市", 
             "pinyin": "chaoyangshi"
         }, 
         {
             "id": "54", 
             "city": "铁岭市", 
             "pinyin": "tielingshi"
         }, 
         {
             "id": "55", 
             "city": "辽阳市", 
             "pinyin": "liaoyangshi"
         }, 
         {
             "id": "56", 
             "city": "盘锦市", 
             "pinyin": "panjinshi"
         }, 
         {
             "id": "57", 
             "city": "营口市", 
             "pinyin": "yingkoushi"
         }, 
         {
             "id": "58", 
             "city": "长春市", 
             "pinyin": "changchunshi"
         }, 
         {
             "id": "59", 
             "city": "延吉市", 
             "pinyin": "yanjishi"
         }, 
         {
             "id": "60", 
             "city": "吉林市", 
             "pinyin": "jilinshi"
         }, 
         {
             "id": "61", 
             "city": "四平市", 
             "pinyin": "sipingshi"
         }, 
         {
             "id": "62", 
             "city": "通化市", 
             "pinyin": "tonghuashi"
         }, 
         {
             "id": "63", 
             "city": "白城市", 
             "pinyin": "baichengshi"
         }, 
         {
             "id": "64", 
             "city": "辽源市", 
             "pinyin": "liaoyuanshi"
         }, 
         {
             "id": "65", 
             "city": "白山市", 
             "pinyin": "baishanshi"
         }, 
         {
             "id": "66", 
             "city": "松原市", 
             "pinyin": "songyuanshi"
         }, 
         {
             "id": "67", 
             "city": "公主岭市", 
             "pinyin": "gongzhulingshi"
         }, 
         {
             "id": "68", 
             "city": "哈尔滨市", 
             "pinyin": "haerbinshi"
         }, 
         {
             "id": "69", 
             "city": "佳木斯", 
             "pinyin": "jiamusi"
         }, 
         {
             "id": "70", 
             "city": "齐齐哈尔市", 
             "pinyin": "qiqihaershi"
         }, 
         {
             "id": "71", 
             "city": "大庆市", 
             "pinyin": "daqingshi"
         }, 
         {
             "id": "72", 
             "city": "牡丹江市", 
             "pinyin": "mudanjiangshi"
         }, 
         {
             "id": "73", 
             "city": "绥化市", 
             "pinyin": "suihuashi"
         }, 
         {
             "id": "74", 
             "city": "黑河市", 
             "pinyin": "heiheshi"
         }, 
         {
             "id": "75", 
             "city": "鹤岗市", 
             "pinyin": "hegangshi"
         }, 
         {
             "id": "76", 
             "city": "鸡西市", 
             "pinyin": "jixishi"
         }, 
         {
             "id": "77", 
             "city": "伊春市", 
             "pinyin": "yichunshi"
         }, 
         {
             "id": "78", 
             "city": "大兴安岭地区", 
             "pinyin": "daxinganlingdiqu"
         }, 
         {
             "id": "79", 
             "city": "双鸭山市", 
             "pinyin": "shuangyashanshi"
         }, 
         {
             "id": "80", 
             "city": "七台河市", 
             "pinyin": "qitaiheshi"
         }, 
         {
             "id": "81", 
             "city": "佳木斯市", 
             "pinyin": "jiamusishi"
         }, 
         {
             "id": "82", 
             "city": "上海市", 
             "pinyin": "shanghaishi"
         }, 
         {
             "id": "83", 
             "city": "南京市", 
             "pinyin": "nanjingshi"
         }, 
         {
             "id": "84", 
             "city": "徐州市", 
             "pinyin": "xuzhoushi"
         }, 
         {
             "id": "85", 
             "city": "无锡市", 
             "pinyin": "wuxishi"
         }, 
         {
             "id": "86", 
             "city": "苏州市", 
             "pinyin": "suzhoushi"
         }, 
         {
             "id": "87", 
             "city": "扬州市", 
             "pinyin": "yangzhoushi"
         }, 
         {
             "id": "88", 
             "city": "镇江市", 
             "pinyin": "zhenjiangshi"
         }, 
         {
             "id": "89", 
             "city": "常州市", 
             "pinyin": "changzhoushi"
         }, 
         {
             "id": "90", 
             "city": "南通市", 
             "pinyin": "nantongshi"
         }, 
         {
             "id": "91", 
             "city": "盐城市", 
             "pinyin": "yanchengshi"
         }, 
         {
             "id": "92", 
             "city": "淮安市", 
             "pinyin": "huaianshi"
         }, 
         {
             "id": "93", 
             "city": "连云港市", 
             "pinyin": "lianyungangshi"
         }, 
         {
             "id": "94", 
             "city": "淮阴市", 
             "pinyin": "huaiyinshi"
         }, 
         {
             "id": "95", 
             "city": "泰州市", 
             "pinyin": "taizhoushi"
         }, 
         {
             "id": "96", 
             "city": "张家港市", 
             "pinyin": "zhangjiagangshi"
         }, 
         {
             "id": "97", 
             "city": "宿迁市", 
             "pinyin": "suqianshi"
         }, 
         {
             "id": "98", 
             "city": "昆山市", 
             "pinyin": "kunshanshi"
         }, 
         {
             "id": "99", 
             "city": "杭州市", 
             "pinyin": "hangzhoushi"
         }, 
         {
             "id": "100", 
             "city": "宁波市", 
             "pinyin": "ningboshi"
         }, 
         {
             "id": "101", 
             "city": "金华市", 
             "pinyin": "jinhuashi"
         }, 
         {
             "id": "102", 
             "city": "温州市", 
             "pinyin": "wenzhoushi"
         }, 
         {
             "id": "103", 
             "city": "绍兴市", 
             "pinyin": "shaoxingshi"
         }, 
         {
             "id": "104", 
             "city": "嘉兴市", 
             "pinyin": "jiaxingshi"
         }, 
         {
             "id": "105", 
             "city": "舟山市", 
             "pinyin": "zhoushanshi"
         }, 
         {
             "id": "106", 
             "city": "台州市", 
             "pinyin": "taizhoushi"
         }, 
         {
             "id": "107", 
             "city": "湖州市", 
             "pinyin": "huzhoushi"
         }, 
         {
             "id": "108", 
             "city": "丽水市", 
             "pinyin": "lishuishi"
         }, 
         {
             "id": "109", 
             "city": "衢州市", 
             "pinyin": "quzhoushi"
         }, 
         {
             "id": "110", 
             "city": "合肥市", 
             "pinyin": "hefeishi"
         }, 
         {
             "id": "111", 
             "city": "淮南市", 
             "pinyin": "huainanshi"
         }, 
         {
             "id": "112", 
             "city": "马鞍山", 
             "pinyin": "maanshan"
         }, 
         {
             "id": "113", 
             "city": "芜湖市", 
             "pinyin": "wuhushi"
         }, 
         {
             "id": "114", 
             "city": "淮北市", 
             "pinyin": "huaibeishi"
         }, 
         {
             "id": "115", 
             "city": "蚌埠市", 
             "pinyin": "bengbushi"
         }, 
         {
             "id": "116", 
             "city": "滁州市", 
             "pinyin": "chuzhoushi"
         }, 
         {
             "id": "117", 
             "city": "阜阳市", 
             "pinyin": "fuyangshi"
         }, 
         {
             "id": "118", 
             "city": "安庆市", 
             "pinyin": "anqingshi"
         }, 
         {
             "id": "119", 
             "city": "池州市", 
             "pinyin": "chizhoushi"
         }, 
         {
             "id": "120", 
             "city": "六安市", 
             "pinyin": "luanshi"
         }, 
         {
             "id": "121", 
             "city": "宿州市", 
             "pinyin": "suzhoushi"
         }, 
         {
             "id": "122", 
             "city": "黄山市", 
             "pinyin": "huangshanshi"
         }, 
         {
             "id": "123", 
             "city": "巢湖市", 
             "pinyin": "chaohushi"
         }, 
         {
             "id": "124", 
             "city": "铜陵市", 
             "pinyin": "tonglingshi"
         }, 
         {
             "id": "125", 
             "city": "亳州市", 
             "pinyin": "bozhoushi"
         }, 
         {
             "id": "126", 
             "city": "马鞍山市", 
             "pinyin": "maanshanshi"
         }, 
         {
             "id": "127", 
             "city": "宣城市", 
             "pinyin": "xuanchengshi"
         }, 
         {
             "id": "128", 
             "city": "厦门市", 
             "pinyin": "xiamenshi"
         }, 
         {
             "id": "129", 
             "city": "泉州市", 
             "pinyin": "quanzhoushi"
         }, 
         {
             "id": "130", 
             "city": "福州市", 
             "pinyin": "fuzhoushi"
         }, 
         {
             "id": "131", 
             "city": "宁德市", 
             "pinyin": "ningdeshi"
         }, 
         {
             "id": "132", 
             "city": "漳州市", 
             "pinyin": "zhangzhoushi"
         }, 
         {
             "id": "133", 
             "city": "三明市", 
             "pinyin": "sanmingshi"
         }, 
         {
             "id": "134", 
             "city": "龙岩市", 
             "pinyin": "longyanshi"
         }, 
         {
             "id": "135", 
             "city": "莆田市", 
             "pinyin": "putianshi"
         }, 
         {
             "id": "136", 
             "city": "南平市", 
             "pinyin": "nanpingshi"
         }, 
         {
             "id": "137", 
             "city": "南昌市", 
             "pinyin": "nanchangshi"
         }, 
         {
             "id": "138", 
             "city": "赣州市", 
             "pinyin": "ganzhoushi"
         }, 
         {
             "id": "139", 
             "city": "抚州市", 
             "pinyin": "fuzhoushi"
         }, 
         {
             "id": "140", 
             "city": "吉安市", 
             "pinyin": "jianshi"
         }, 
         {
             "id": "141", 
             "city": "景德镇", 
             "pinyin": "jingdezhen"
         }, 
         {
             "id": "142", 
             "city": "上饶市", 
             "pinyin": "shangraoshi"
         }, 
         {
             "id": "143", 
             "city": "九江市", 
             "pinyin": "jiujiangshi"
         }, 
         {
             "id": "144", 
             "city": "新余市", 
             "pinyin": "xinyushi"
         }, 
         {
             "id": "145", 
             "city": "宜春市", 
             "pinyin": "yichunshi"
         }, 
         {
             "id": "146", 
             "city": "萍乡市", 
             "pinyin": "pingxiangshi"
         }, 
         {
             "id": "147", 
             "city": "樟树市", 
             "pinyin": "zhangshushi"
         }, 
         {
             "id": "148", 
             "city": "景德镇市", 
             "pinyin": "jingdezhenshi"
         }, 
         {
             "id": "149", 
             "city": "鹰潭市", 
             "pinyin": "yingtanshi"
         }, 
         {
             "id": "150", 
             "city": "共青城", 
             "pinyin": "gongqingcheng"
         }, 
         {
             "id": "151", 
             "city": "济南市", 
             "pinyin": "jinanshi"
         }, 
         {
             "id": "152", 
             "city": "青岛市", 
             "pinyin": "qingdaoshi"
         }, 
         {
             "id": "153", 
             "city": "淄博市", 
             "pinyin": "ziboshi"
         }, 
         {
             "id": "154", 
             "city": "烟台市", 
             "pinyin": "yantaishi"
         }, 
         {
             "id": "155", 
             "city": "聊城市", 
             "pinyin": "liaochengshi"
         }, 
         {
             "id": "156", 
             "city": "泰安市", 
             "pinyin": "taianshi"
         }, 
         {
             "id": "157", 
             "city": "济宁市", 
             "pinyin": "jiningshi"
         }, 
         {
             "id": "158", 
             "city": "临沂市", 
             "pinyin": "linyishi"
         }, 
         {
             "id": "159", 
             "city": "潍坊市", 
             "pinyin": "weifangshi"
         }, 
         {
             "id": "160", 
             "city": "滨州市", 
             "pinyin": "binzhoushi"
         }, 
         {
             "id": "161", 
             "city": "德州市", 
             "pinyin": "dezhoushi"
         }, 
         {
             "id": "162", 
             "city": "枣庄市", 
             "pinyin": "zaozhuangshi"
         }, 
         {
             "id": "163", 
             "city": "菏泽市", 
             "pinyin": "hezeshi"
         }, 
         {
             "id": "164", 
             "city": "日照市", 
             "pinyin": "rizhaoshi"
         }, 
         {
             "id": "165", 
             "city": "莱芜市", 
             "pinyin": "laiwushi"
         }, 
         {
             "id": "166", 
             "city": "威海市", 
             "pinyin": "weihaishi"
         }, 
         {
             "id": "167", 
             "city": "东营市", 
             "pinyin": "dongyingshi"
         }, 
         {
             "id": "168", 
             "city": "郑州市", 
             "pinyin": "zhengzhoushi"
         }, 
         {
             "id": "169", 
             "city": "开封市", 
             "pinyin": "kaifengshi"
         }, 
         {
             "id": "170", 
             "city": "洛阳市", 
             "pinyin": "luoyangshi"
         }, 
         {
             "id": "171", 
             "city": "焦作市", 
             "pinyin": "jiaozuoshi"
         }, 
         {
             "id": "172", 
             "city": "新乡市", 
             "pinyin": "xinxiangshi"
         }, 
         {
             "id": "173", 
             "city": "平顶山市", 
             "pinyin": "pingdingshanshi"
         }, 
         {
             "id": "174", 
             "city": "安阳市", 
             "pinyin": "anyangshi"
         }, 
         {
             "id": "175", 
             "city": "南阳市", 
             "pinyin": "nanyangshi"
         }, 
         {
             "id": "176", 
             "city": "商丘市", 
             "pinyin": "shangqiushi"
         }, 
         {
             "id": "177", 
             "city": "信阳市", 
             "pinyin": "xinyangshi"
         }, 
         {
             "id": "178", 
             "city": "周口市", 
             "pinyin": "zhoukoushi"
         }, 
         {
             "id": "179", 
             "city": "巩义市", 
             "pinyin": "gongyishi"
         }, 
         {
             "id": "180", 
             "city": "驻马店市", 
             "pinyin": "zhumadianshi"
         }, 
         {
             "id": "181", 
             "city": "许昌市", 
             "pinyin": "xuchangshi"
         }, 
         {
             "id": "182", 
             "city": "漯河市", 
             "pinyin": "luoheshi"
         }, 
         {
             "id": "183", 
             "city": "三门峡市", 
             "pinyin": "sanmenxiashi"
         }, 
         {
             "id": "184", 
             "city": "鹤壁市", 
             "pinyin": "hebishi"
         }, 
         {
             "id": "185", 
             "city": "濮阳市", 
             "pinyin": "puyangshi"
         }, 
         {
             "id": "186", 
             "city": "登封市", 
             "pinyin": "dengfengshi"
         }, 
         {
             "id": "187", 
             "city": "永城市", 
             "pinyin": "yongchengshi"
         }, 
         {
             "id": "188", 
             "city": "济源市", 
             "pinyin": "jiyuanshi"
         }, 
         {
             "id": "189", 
             "city": "武汉市", 
             "pinyin": "wuhanshi"
         }, 
         {
             "id": "190", 
             "city": "荆州市", 
             "pinyin": "jingzhoushi"
         }, 
         {
             "id": "191", 
             "city": "宜昌市", 
             "pinyin": "yichangshi"
         }, 
         {
             "id": "192", 
             "city": "荆门市", 
             "pinyin": "jingmenshi"
         }, 
         {
             "id": "193", 
             "city": "十堰市", 
             "pinyin": "shiyanshi"
         }, 
         {
             "id": "194", 
             "city": "黄石市", 
             "pinyin": "huangshishi"
         }, 
         {
             "id": "195", 
             "city": "黄冈市", 
             "pinyin": "huanggangshi"
         }, 
         {
             "id": "196", 
             "city": "孝感市", 
             "pinyin": "xiaoganshi"
         }, 
         {
             "id": "197", 
             "city": "恩施市", 
             "pinyin": "enshishi"
         }, 
         {
             "id": "198", 
             "city": "咸宁市", 
             "pinyin": "xianningshi"
         }, 
         {
             "id": "199", 
             "city": "襄樊市", 
             "pinyin": "xiangfanshi"
         }, 
         {
             "id": "200", 
             "city": "鄂州市", 
             "pinyin": "ezhoushi"
         }, 
         {
             "id": "201", 
             "city": "潞江市", 
             "pinyin": "lujiangshi"
         }, 
         {
             "id": "202", 
             "city": "天门市", 
             "pinyin": "tianmenshi"
         }, 
         {
             "id": "203", 
             "city": "随州市", 
             "pinyin": "suizhoushi"
         }, 
         {
             "id": "204", 
             "city": "襄阳市", 
             "pinyin": "xiangyangshi"
         }, 
         {
             "id": "205", 
             "city": "仙桃市", 
             "pinyin": "xiantaoshi"
         }, 
         {
             "id": "206", 
             "city": "长沙市", 
             "pinyin": "changshashi"
         }, 
         {
             "id": "207", 
             "city": "湘潭市", 
             "pinyin": "xiangtanshi"
         }, 
         {
             "id": "208", 
             "city": "吉首市", 
             "pinyin": "jishoushi"
         }, 
         {
             "id": "209", 
             "city": "衡阳市", 
             "pinyin": "hengyangshi"
         }, 
         {
             "id": "210", 
             "city": "株洲市", 
             "pinyin": "zhuzhoushi"
         }, 
         {
             "id": "211", 
             "city": "岳阳市", 
             "pinyin": "yueyangshi"
         }, 
         {
             "id": "212", 
             "city": "益阳市", 
             "pinyin": "yiyangshi"
         }, 
         {
             "id": "213", 
             "city": "郴州市", 
             "pinyin": "chenzhoushi"
         }, 
         {
             "id": "214", 
             "city": "永州市", 
             "pinyin": "yongzhoushi"
         }, 
         {
             "id": "215", 
             "city": "娄底市", 
             "pinyin": "loudishi"
         }, 
         {
             "id": "216", 
             "city": "常德市", 
             "pinyin": "changdeshi"
         }, 
         {
             "id": "217", 
             "city": "邵阳市", 
             "pinyin": "shaoyangshi"
         }, 
         {
             "id": "218", 
             "city": "怀化市", 
             "pinyin": "huaihuashi"
         }, 
         {
             "id": "219", 
             "city": "湘西自治州", 
             "pinyin": "xiangxizizhizhou"
         }, 
         {
             "id": "220", 
             "city": "张家界市", 
             "pinyin": "zhangjiajieshi"
         }, 
         {
             "id": "221", 
             "city": "广州市", 
             "pinyin": "guangzhoushi"
         }, 
         {
             "id": "222", 
             "city": "汕头市", 
             "pinyin": "shantoushi"
         }, 
         {
             "id": "223", 
             "city": "深圳市", 
             "pinyin": "shenzhenshi"
         }, 
         {
             "id": "224", 
             "city": "江门市", 
             "pinyin": "jiangmenshi"
         }, 
         {
             "id": "225", 
             "city": "湛江市", 
             "pinyin": "zhanjiangshi"
         }, 
         {
             "id": "226", 
             "city": "茂名市", 
             "pinyin": "maomingshi"
         }, 
         {
             "id": "227", 
             "city": "肇庆市", 
             "pinyin": "zhaoqingshi"
         }, 
         {
             "id": "228", 
             "city": "东莞市", 
             "pinyin": "dongguanshi"
         }, 
         {
             "id": "229", 
             "city": "韶关市", 
             "pinyin": "shaoguanshi"
         }, 
         {
             "id": "230", 
             "city": "梅州市", 
             "pinyin": "meizhoushi"
         }, 
         {
             "id": "231", 
             "city": "潮州市", 
             "pinyin": "chaozhoushi"
         }, 
         {
             "id": "232", 
             "city": "惠州市", 
             "pinyin": "huizhoushi"
         }, 
         {
             "id": "233", 
             "city": "佛山市", 
             "pinyin": "foshanshi"
         }, 
         {
             "id": "234", 
             "city": "揭阳市", 
             "pinyin": "jieyangshi"
         }, 
         {
             "id": "235", 
             "city": "清远市", 
             "pinyin": "qingyuanshi"
         }, 
         {
             "id": "236", 
             "city": "中山市", 
             "pinyin": "zhongshanshi"
         }, 
         {
             "id": "237", 
             "city": "珠海市", 
             "pinyin": "zhuhaishi"
         }, 
         {
             "id": "238", 
             "city": "南海市", 
             "pinyin": "nanhaishi"
         }, 
         {
             "id": "239", 
             "city": "汕尾市", 
             "pinyin": "shanweishi"
         }, 
         {
             "id": "240", 
             "city": "罗定市", 
             "pinyin": "luodingshi"
         }, 
         {
             "id": "241", 
             "city": "河源市", 
             "pinyin": "heyuanshi"
         }, 
         {
             "id": "242", 
             "city": "阳江市", 
             "pinyin": "yangjiangshi"
         }, 
         {
             "id": "243", 
             "city": "南宁市", 
             "pinyin": "nanningshi"
         }, 
         {
             "id": "244", 
             "city": "桂林市", 
             "pinyin": "guilinshi"
         }, 
         {
             "id": "245", 
             "city": "柳州市", 
             "pinyin": "liuzhoushi"
         }, 
         {
             "id": "246", 
             "city": "百色市", 
             "pinyin": "baiseshi"
         }, 
         {
             "id": "247", 
             "city": "崇左市", 
             "pinyin": "chongzuoshi"
         }, 
         {
             "id": "248", 
             "city": "宜州市", 
             "pinyin": "yizhoushi"
         }, 
         {
             "id": "249", 
             "city": "玉林市", 
             "pinyin": "yulinshi"
         }, 
         {
             "id": "250", 
             "city": "贺州市", 
             "pinyin": "hezhoushi"
         }, 
         {
             "id": "251", 
             "city": "钦州市", 
             "pinyin": "qinzhoushi"
         }, 
         {
             "id": "252", 
             "city": "梧州市", 
             "pinyin": "wuzhoushi"
         }, 
         {
             "id": "253", 
             "city": "扶绥县", 
             "pinyin": "fusuixian"
         }, 
         {
             "id": "254", 
             "city": "北海市", 
             "pinyin": "beihaishi"
         }, 
         {
             "id": "255", 
             "city": "河池市", 
             "pinyin": "hechishi"
         }, 
         {
             "id": "256", 
             "city": "贵港市", 
             "pinyin": "guigangshi"
         }, 
         {
             "id": "257", 
             "city": "海口市", 
             "pinyin": "haikoushi"
         }, 
         {
             "id": "258", 
             "city": "五指山市", 
             "pinyin": "wuzhishanshi"
         }, 
         {
             "id": "259", 
             "city": "三亚市", 
             "pinyin": "sanyashi"
         }, 
         {
             "id": "260", 
             "city": "琼海市", 
             "pinyin": "qionghaishi"
         }, 
         {
             "id": "261", 
             "city": "文昌市", 
             "pinyin": "wenchangshi"
         }, 
         {
             "id": "262", 
             "city": "重庆市", 
             "pinyin": "chongqingshi"
         }, 
         {
             "id": "263", 
             "city": "成都市", 
             "pinyin": "chengdushi"
         }, 
         {
             "id": "264", 
             "city": "绵阳市", 
             "pinyin": "mianyangshi"
         }, 
         {
             "id": "265", 
             "city": "雅安市", 
             "pinyin": "yaanshi"
         }, 
         {
             "id": "266", 
             "city": "南充市", 
             "pinyin": "nanchongshi"
         }, 
         {
             "id": "267", 
             "city": "广汉市", 
             "pinyin": "guanghanshi"
         }, 
         {
             "id": "268", 
             "city": "自贡市", 
             "pinyin": "zigongshi"
         }, 
         {
             "id": "269", 
             "city": "泸州市", 
             "pinyin": "luzhoushi"
         }, 
         {
             "id": "270", 
             "city": "乐山市", 
             "pinyin": "leshanshi"
         }, 
         {
             "id": "271", 
             "city": "内江市", 
             "pinyin": "neijiangshi"
         }, 
         {
             "id": "272", 
             "city": "达川市", 
             "pinyin": "dachuanshi"
         }, 
         {
             "id": "273", 
             "city": "甘孜州", 
             "pinyin": "ganzizhou"
         }, 
         {
             "id": "274", 
             "city": "攀枝花市", 
             "pinyin": "panzhihuashi"
         }, 
         {
             "id": "275", 
             "city": "宜宾市", 
             "pinyin": "yibinshi"
         }, 
         {
             "id": "276", 
             "city": "西昌市", 
             "pinyin": "xichangshi"
         }, 
         {
             "id": "277", 
             "city": "汶川县", 
             "pinyin": "wenchuanxian"
         }, 
         {
             "id": "278", 
             "city": "广元市", 
             "pinyin": "guangyuanshi"
         }, 
         {
             "id": "279", 
             "city": "德阳市", 
             "pinyin": "deyangshi"
         }, 
         {
             "id": "280", 
             "city": "广安市", 
             "pinyin": "guanganshi"
         }, 
         {
             "id": "281", 
             "city": "眉山市", 
             "pinyin": "meishanshi"
         }, 
         {
             "id": "282", 
             "city": "遂宁市", 
             "pinyin": "suiningshi"
         }, 
         {
             "id": "283", 
             "city": "达州市", 
             "pinyin": "dazhoushi"
         }, 
         {
             "id": "284", 
             "city": "贵阳市", 
             "pinyin": "guiyangshi"
         }, 
         {
             "id": "285", 
             "city": "遵义市", 
             "pinyin": "zunyishi"
         }, 
         {
             "id": "286", 
             "city": "毕节市", 
             "pinyin": "bijieshi"
         }, 
         {
             "id": "287", 
             "city": "都匀市", 
             "pinyin": "duyunshi"
         }, 
         {
             "id": "288", 
             "city": "六盘水市", 
             "pinyin": "liupanshuishi"
         }, 
         {
             "id": "289", 
             "city": "兴义市", 
             "pinyin": "xingyishi"
         }, 
         {
             "id": "290", 
             "city": "安顺市", 
             "pinyin": "anshunshi"
         }, 
         {
             "id": "291", 
             "city": "凯里市", 
             "pinyin": "kailishi"
         }, 
         {
             "id": "292", 
             "city": "铜仁市", 
             "pinyin": "tongrenshi"
         }, 
         {
             "id": "293", 
             "city": "黔南州", 
             "pinyin": "qiannanzhou"
         }, 
         {
             "id": "294", 
             "city": "昆明市", 
             "pinyin": "kunmingshi"
         }, 
         {
             "id": "295", 
             "city": "昭通市", 
             "pinyin": "zhaotongshi"
         }, 
         {
             "id": "296", 
             "city": "曲靖市", 
             "pinyin": "qujingshi"
         }, 
         {
             "id": "297", 
             "city": "玉溪市", 
             "pinyin": "yuxishi"
         }, 
         {
             "id": "298", 
             "city": "楚雄市", 
             "pinyin": "chuxiongshi"
         }, 
         {
             "id": "299", 
             "city": "普洱市", 
             "pinyin": "puershi"
         }, 
         {
             "id": "300", 
             "city": "红河州", 
             "pinyin": "honghezhou"
         }, 
         {
             "id": "301", 
             "city": "大理州", 
             "pinyin": "dalizhou"
         }, 
         {
             "id": "302", 
             "city": "保山市", 
             "pinyin": "baoshanshi"
         }, 
         {
             "id": "303", 
             "city": "文山州", 
             "pinyin": "wenshanzhou"
         }, 
         {
             "id": "304", 
             "city": "楚雄州", 
             "pinyin": "chuxiongzhou"
         }, 
         {
             "id": "305", 
             "city": "丽江市", 
             "pinyin": "lijiangshi"
         }, 
         {
             "id": "306", 
             "city": "德宏州", 
             "pinyin": "dehongzhou"
         }, 
         {
             "id": "307", 
             "city": "临沧市", 
             "pinyin": "lincangshi"
         }, 
         {
             "id": "308", 
             "city": "红河市", 
             "pinyin": "hongheshi"
         }, 
         {
             "id": "309", 
             "city": "西双版纳州", 
             "pinyin": "xishuangbannazhou"
         }, 
         {
             "id": "310", 
             "city": "拉萨市", 
             "pinyin": "lasashi"
         }, 
         {
             "id": "311", 
             "city": "咸阳市", 
             "pinyin": "xianyangshi"
         }, 
         {
             "id": "312", 
             "city": "西安市", 
             "pinyin": "xianshi"
         }, 
         {
             "id": "313", 
             "city": "杨凌市", 
             "pinyin": "yanglingshi"
         }, 
         {
             "id": "314", 
             "city": "延安市", 
             "pinyin": "yananshi"
         }, 
         {
             "id": "315", 
             "city": "宝鸡市", 
             "pinyin": "baojishi"
         }, 
         {
             "id": "316", 
             "city": "渭南市", 
             "pinyin": "weinanshi"
         }, 
         {
             "id": "317", 
             "city": "榆林市", 
             "pinyin": "yulinshi"
         }, 
         {
             "id": "318", 
             "city": "汉中市", 
             "pinyin": "hanzhongshi"
         }, 
         {
             "id": "319", 
             "city": "商州市", 
             "pinyin": "shangzhoushi"
         }, 
         {
             "id": "320", 
             "city": "安康市", 
             "pinyin": "ankangshi"
         }, 
         {
             "id": "321", 
             "city": "高州市", 
             "pinyin": "gaozhoushi"
         }, 
         {
             "id": "322", 
             "city": "铜川市", 
             "pinyin": "tongchuanshi"
         }, 
         {
             "id": "323", 
             "city": "兰州市", 
             "pinyin": "lanzhoushi"
         }, 
         {
             "id": "324", 
             "city": "西峰市", 
             "pinyin": "xifengshi"
         }, 
         {
             "id": "325", 
             "city": "甘南州", 
             "pinyin": "gannanzhou"
         }, 
         {
             "id": "326", 
             "city": "天水市", 
             "pinyin": "tianshuishi"
         }, 
         {
             "id": "327", 
             "city": "张掖市", 
             "pinyin": "zhangyeshi"
         }, 
         {
             "id": "328", 
             "city": "平凉市", 
             "pinyin": "pingliangshi"
         }, 
         {
             "id": "329", 
             "city": "成县", 
             "pinyin": "chengxian"
         }, 
         {
             "id": "330", 
             "city": "定西市", 
             "pinyin": "dingxishi"
         }, 
         {
             "id": "331", 
             "city": "武威市", 
             "pinyin": "wuweishi"
         }, 
         {
             "id": "332", 
             "city": "金昌市", 
             "pinyin": "jinchangshi"
         }, 
         {
             "id": "333", 
             "city": "白银市", 
             "pinyin": "baiyinshi"
         }, 
         {
             "id": "334", 
             "city": "嘉峪关市", 
             "pinyin": "jiayuguanshi"
         }, 
         {
             "id": "335", 
             "city": "酒泉市", 
             "pinyin": "jiuquanshi"
         }, 
         {
             "id": "336", 
             "city": "西宁市", 
             "pinyin": "xiningshi"
         }, 
         {
             "id": "337", 
             "city": "银川市", 
             "pinyin": "yinchuanshi"
         }, 
         {
             "id": "338", 
             "city": "石嘴山", 
             "pinyin": "shizuishan"
         }, 
         {
             "id": "339", 
             "city": "固原市", 
             "pinyin": "guyuanshi"
         }, 
         {
             "id": "340", 
             "city": "吴忠市", 
             "pinyin": "wuzhongshi"
         }, 
         {
             "id": "341", 
             "city": "乌鲁木齐市", 
             "pinyin": "wulumuqishi"
         }, 
         {
             "id": "342", 
             "city": "石河子市", 
             "pinyin": "shihezishi"
         }, 
         {
             "id": "343", 
             "city": "阿拉尔市", 
             "pinyin": "alaershi"
         }, 
         {
             "id": "344", 
             "city": "伊宁市", 
             "pinyin": "yiningshi"
         }, 
         {
             "id": "345", 
             "city": "喀什市", 
             "pinyin": "kashishi"
         }, 
         {
             "id": "346", 
             "city": "乌鲁木齐", 
             "pinyin": "wulumuqi"
         }, 
         {
             "id": "347", 
             "city": "昌吉市", 
             "pinyin": "changjishi"
         }, 
         {
             "id": "348", 
             "city": "和田市", 
             "pinyin": "hetianshi"
         }, 
         {
             "id": "349", 
             "city": "克拉玛依市", 
             "pinyin": "kelamayishi"
         }, 
         {
             "id": "350", 
             "city": "巴州", 
             "pinyin": "bazhou"
         }, 
         {
             "id": "351", 
             "city": "阿克苏市", 
             "pinyin": "akesushi"
         }, 
         {
             "id": "352", 
             "city": "奎屯市", 
             "pinyin": "kuitunshi"
         }
    ];
    return {
        all: function() {
            return citys;
        }
    };

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
 * 
 *                     操你妈的狗逼设计和策划
 *                     操你妈的狗逼设计和策划
 *                     操你妈的狗逼设计和策划
 *                     操你妈的狗逼设计和策划
 */
