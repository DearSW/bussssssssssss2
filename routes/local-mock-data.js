
var express = require('express');
var router = express.Router();
// @本地化API

router.post('/product/queryProductKeywords', function(req, res, next) {
    res.send({
        "code":0,
        "data":{
            "products":[{
                    "viewaddress":"息烽温泉"
            }],
            "msg":"查询产品搜索关键字成功"
        }
    });
    res.end();
});

router.post('/product/queryRecommendProductList', function(req, res, next) {
    res.send({
        "code":0,
        "data":{
            "products":[
                {
                    "productid":"2017122614251275636623",
                    "productType":"门票",
                    "region":"贵阳",
                    "viewaddress":"息烽温泉&息烽温泉，全国著名八大温泉之一",
                    "isPush":"true","productPrice":100.0,
                    "productinfo":"<p><br/><br/><!--StartFragment--></p><p style=\"font-size: 14px;text-align: center;\">用户须知</p><p style=\"font-size: 14px;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 12pt;\">1.</span></span><span style=\"font-size:14px;\"><span style=\"font-size: 12pt;\">泡温泉之前，应取下佩戴的金属饰品，否则会与温泉里的矿物质产生化学反应，造成佩饰变色<br/>2.空腹或太饱时请勿入浴， 以免出现头晕、呕吐、消化不良、疲倦等症状。<br/>3.高血压和心脑血管疾病患者，在规则服药或经医生允许的前提下，可以泡温泉，但以每次不超过20分钟为宜。并注意：入水前，先用温泉缓慢的擦拭身体，待适应后再进入，以免影响血管正常收缩；出水时，缓慢起身，以防因血管扩张、血压下降导致头昏眼花而跌倒，诱发脑中风或心肌梗塞。<br/>4.泡温泉时，应多喝水，随时补充流失的水份。<br/>5.泡温泉时，如果感觉身体不适，应马上离开，不可勉强继续。<br/>6.泡温泉后，人体水分大量蒸发，应多喝水补充。n &gt;费用不含：温泉内其他消费（按摩 搓背等其他自费）</span></span><br/><br/></p><!--EndFragment--><p><br/></p><p><br/></p><p></p>","titleName":"息烽温泉直通车，一站直达","photoPath":"http://111.230.129.41:80/guizhoubus/12233_2017123110251444449900.jpg",
                    "viewInfo":{
                        "viewid":"2017120516324186464944",
                        "viewName":"息烽温泉",
                        "viewaddr":"贵阳市息烽温泉游客集散中心",
                        "viewType":"自然景观","viewPhoto":"23344_2017120516324170615263.jpg",
                        "viewintru":"息烽温泉是全国著名八大温泉之一，地处黔中，位于息烽城东北40公里的天台山脚下，海拔高度700米，四面环山。温泉水经国家鉴定为“含偏硅酸和锶的重碳酸钙型氡泉”，是世界少有，国内著名的优质天然医疗和饮用矿泉水之一，含有多种对人体有益的微量元素，并含有放射性元素氡，水温稳定在53-56οc，被誉为“与法兰西维琪温泉相伯仲”的优质热矿泉",
                        "viewPrices":[{
                            "viewPriceId":"2017120621145021818849",
                            "viewCoupon":1.0,
                            "viewPrice":100.0,
                            "viewPriceType":"成人温泉门票",
                            "viewid":"2017120516324186464944",
                            "couponPrice":100.0,
                            "tickID":"",
                            "tickbID":""
                        }],
                        "viewUrl":"http://111.230.129.41:80/guizhoubus/23344_2017120516324170615263.jpg",
                        "saleType":0
                    },
                    "leftTickets": 1,
                    "totalTickets":1
                },
                {
                    "productid": "2017123110213167379964",
                    "productType": "往返+门票",
                    "region": "贵阳",
                    "viewaddress": "息烽温泉&息烽温泉，全国著名八大温泉之一",
                    "isPush": "true",
                    "productPrice": 198,
                    "productinfo": "<p><br/></p><p><br/></p><!--StartFragment--><p style=\"font-size: 14px;text-align: center;\">用户须知</p><p style=\"font-size: 14px;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 12pt;\">1.</span></span><span style=\"font-size: 14px;\"><span style=\"font-size:12pt;\">泡温泉之前，应取下佩戴的金属饰品，否则会与温泉里的矿物质产生化学反应，造成佩饰变色<br/>2.空腹或太饱时请勿入浴，以免出现头晕、呕吐、消化不良、疲倦等症状。<br/>3.高血压和心脑血管疾病患者，在规则服药或经医生允许的前提下，可以泡温泉，但以每次不超过20分钟为宜。并注意：入水前，先用温泉缓慢的擦拭身体，待适应后再进入，以免影响血管正常收缩；出水时，缓慢起身，以防因血管扩张、血压下降导致头昏眼花而跌倒，诱发脑中风或心肌梗塞。<br/>4.泡温泉时，应多喝水，随时补充流失的水份。<br/>5.泡温泉时，如果感觉身体不适，应马上离开，不可勉强继续。<br/>6.泡温泉后，人体水分大量蒸发，应多喝水补充。n &gt;费用不含：温泉内其他消费（按摩 搓背等其他自费）</span></span><br/></p><!--EndFragment--><p><br/></p><p><br/></p>",
                    "titleName": "息烽温泉直通车，一站直达",
                    "photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110213277881480.jpg",
                    "plans": [
                        {
                            "bpid": "2017123110233260609516",
                            "lineid": "2017120516140110687149",
                            "linename": "贵州饭店-息烽温泉",
                            "productid": "2017123110213167379964",
                            "viewaddress": "息烽温泉&息烽温泉，全国著名八大温泉之一",
                            "sequence": 0,
                            "relecode": "7838204520",
                            "bdidType": 1,
                            "drivetime": 120,
                            "departaddr": "贵州饭店景区直通车",
                            "departName": "贵州饭店",
                            "arriveName": "息烽温泉",
                            "departtime": "10:00",
                            "bdid": "2017123110233250493160"
                        },
                        {
                            "bpid": "2017123110233283580177",
                            "lineid": "2017120516151142333854",
                            "linename": "息烽温泉-贵州饭店",
                            "productid": "2017123110213167379964",
                            "viewaddress": "息烽温泉&息烽温泉，全国著名八大温泉之一",
                            "sequence": 1,
                            "relecode": "7838204520",
                            "bdidType": 1,
                            "drivetime": 120,
                            "departaddr": "息烽温泉",
                            "departName": "息烽温泉",
                            "arriveName": "贵州饭店",
                            "departtime": "17:00",
                            "bdid": "2017123110233259065940"
                        }
                    ],
                    "viewInfo": {
                        "viewid": "2017120516324186464944",
                        "viewName": "息烽温泉",
                        "viewaddr": "贵阳市息烽温泉游客集散中心",
                        "viewType": "自然景观",
                        "viewPhoto": "23344_2017120516324170615263.jpg",
                        "viewintru": "息烽温泉是全国著名八大温泉之一，地处黔中，位于息烽城东北40公里的天台山脚下，海拔高度700米，四面环山。温泉水经国家鉴定为“含偏硅酸和锶的重碳酸钙型氡泉”，是世界少有，国内著名的优质天然医疗和饮用矿泉水之一，含有多种对人体有益的微量元素，并含有放射性元素氡，水温稳定在53-56οc，被誉为“与法兰西维琪温泉相伯仲”的优质热矿泉",
                        "viewPrices": [
                            {
                                "viewPriceId": "2017120621  145021818849",
                                "viewCoupon": 1,
                                "viewPrice": 100,
                                "viewPriceType": "成人温泉门票",
                                "viewid": "2017120516324186464944",
                                "couponPrice": 100,
                                "tickID": "",
                                "tickbID": ""
                            }
                        ],
                        "viewUrl": "http://111.230.129.41:80/guizhoubus/23344_2017120516324170615263.jpg",
                        "saleType": 0
                    },
                    "leftTickets": 0,
                    "totalTickets": 0
                },
                {
                    "productid": "2017123110263804508394",
                    "productType": "单程+门票",
                    "region": "贵阳",
                    "viewaddress": "息烽温泉&息烽温泉，全国著名八大温泉之一",
                    "isPush": "true",
                    "productPrice": 149,
                    "productinfo": "<p><br/></p><!--StartFragment--><p style=\"font-size: 14px;text-align: center;\">用户须知</p><p style=\"font-size: 14px;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 12pt;\">1.</span></span><span style=\"font-size: 14px;\"><span style=\"font-size: 12pt;\">泡温泉之前，应取下佩戴的金属饰品，否则会与温泉里的矿物质产生化学反应，造成佩饰变色<br/>2.空腹或太饱时请勿入浴， 以免出现头晕、呕吐、消化不良、疲倦等症状。<br/>3.高血压和心脑血管疾病患者，在规则服药或经医生允许的前提下，可以泡温泉，但以每次不超过20分钟为宜。并注意：入水前，先用温泉缓慢的擦拭身体，待适应后再进入，以免影响血管正常收缩；出水时，缓慢起身，以防因血管扩张、血压下降导致头昏眼花而跌倒，诱发脑中风或心肌梗塞。<br/>4.泡温泉时，应多喝水，随时补充流失的水份。<br/>5.泡温泉时，如果感觉身体不适，应马上离开，不可勉强继续。<br/>6.泡温泉后，人体水分大量蒸发，应多喝水补充。</span></span></p><p style=\"font-size: 14px;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 12pt;\">费用不含：温泉内其他消费（按摩 搓背等其他自费）</span></span><br/><br/></p><!--EndFragment--><p><br/></p><p><br/></p>",
                    "titleName": "息烽温泉直通车，一站直达",
                    "photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110263826949605.jpg",
                    "plans": [
                        {
                            "bpid": "2017123110263831840115",
                            "lineid": "2017120516140110687149",
                            "linename": "贵州饭店-息烽温泉",
                            "productid": "2017123110263804508394",
                            "viewaddress": "息烽温泉&息烽温泉，全国著名八大温泉之一",
                            "sequence": 0,
                            "relecode": "6824123245",
                            "bdidType": 0,
                            "drivetime": 120,
                            "departaddr": "贵州饭店景区直通车",
                            "departName": "贵州饭店",
                            "arriveName": "息烽温泉",
                            "departtime": "10:00",
                            "bdid": "2017123110233250493160"
                        }
                    ],
                    "viewInfo": {
                        "viewid": "2017120516324186464944",
                        "viewName": "息烽温泉",
                        "viewaddr": "贵阳市息烽温泉游客集散中心",
                        "viewType": "自然景观",
                        "viewPhoto": "23344_2017120516324170615263.jpg",
                        "viewintru": "息烽温泉是全国著名八大温泉之一，地处黔中，位于息烽城东北40公里的天台山脚下，海拔高度700米，四面环山。温泉水经国家鉴定为“含偏硅酸和锶的重碳酸钙型氡泉”，是世界少有，国内著名的优质天然医疗和饮用矿泉水之一，含有多种对人体有益的微量元素，并含有放射性元素氡，水温稳定在53-56οc，被誉为“与法兰西维琪温泉相伯仲”的优质热矿泉",
                        "viewPrices": [
                            {
                                "viewPriceId": "2017120621145021818849",
                                "viewCou  pon": 1,
                                "viewPrice": 100,
                                "viewPriceType": "成人温泉门票",
                                "viewid": "2017120516324186464944",
                                "couponPrice": 100,
                                "tickID": "",
                                "tickbID": ""
                            }
                        ],
                        "viewUrl": "http://111.230.129.41:80/guizhoubus/23344_2017120516324170615263.jpg",
                        "saleType": 0
                    },
                    "leftTic kets": 0,
                    "totalTickets": 0
                }
            ]
        }
    });
    res.end();
});

// router.get('/product/queryProductKeywords ', function(req, res, next) {
//     res.send();
// });


module.exports = router;