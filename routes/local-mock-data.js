var express = require('express');
var router = express.Router();
// @本地化API

// @1
router.post('/product/queryProductKeywords', function (req, res, next) {
	res.send({
		"code": 0,
		"data": {
			"products": [{
				"viewaddress": "息烽温泉"
			}],
			"msg": "查询产品搜索关键字成功"
		}
	});
	res.end();
});

// @2
router.post('/product/queryRecommendProductList', function (req, res, next) {
	res.send({
		"code": 0,
		"data": {
			"products": [{
					"productid": "2017122614251275636623",
					"productType": "门票",
					"region": "贵阳",
					"viewaddress": "息烽温泉&息烽温泉，全国著名八大温泉之一",
					"isPush": "true",
					"productPrice": 100.0,
					"productinfo": "<p><br/><br/><!--StartFragment--></p><p style=\"font-size: 14px;text-align: center;\">用户须知</p><p style=\"font-size: 14px;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 12pt;\">1.</span></span><span style=\"font-size:14px;\"><span style=\"font-size: 12pt;\">泡温泉之前，应取下佩戴的金属饰品，否则会与温泉里的矿物质产生化学反应，造成佩饰变色<br/>2.空腹或太饱时请勿入浴， 以免出现头晕、呕吐、消化不良、疲倦等症状。<br/>3.高血压和心脑血管疾病患者，在规则服药或经医生允许的前提下，可以泡温泉，但以每次不超过20分钟为宜。并注意：入水前，先用温泉缓慢的擦拭身体，待适应后再进入，以免影响血管正常收缩；出水时，缓慢起身，以防因血管扩张、血压下降导致头昏眼花而跌倒，诱发脑中风或心肌梗塞。<br/>4.泡温泉时，应多喝水，随时补充流失的水份。<br/>5.泡温泉时，如果感觉身体不适，应马上离开，不可勉强继续。<br/>6.泡温泉后，人体水分大量蒸发，应多喝水补充。n &gt;费用不含：温泉内其他消费（按摩 搓背等其他自费）</span></span><br/><br/></p><!--EndFragment--><p><br/></p><p><br/></p><p></p>",
					"titleName": "息烽温泉直通车，一站直达",
					"photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110251444449900.jpg",
					"viewInfo": {
						"viewid": "2017120516324186464944",
						"viewName": "息烽温泉",
						"viewaddr": "贵阳市息烽温泉游客集散中心",
						"viewType": "自然景观",
						"viewPhoto": "23344_2017120516324170615263.jpg",
						"viewintru": "息烽温泉是全国著名八大温泉之一，地处黔中，位于息烽城东北40公里的天台山脚下，海拔高度700米，四面环山。温泉水经国家鉴定为“含偏硅酸和锶的重碳酸钙型氡泉”，是世界少有，国内著名的优质天然医疗和饮用矿泉水之一，含有多种对人体有益的微量元素，并含有放射性元素氡，水温稳定在53-56οc，被誉为“与法兰西维琪温泉相伯仲”的优质热矿泉",
						"viewPrices": [{
							"viewPriceId": "2017120621145021818849",
							"viewCoupon": 1.0,
							"viewPrice": 100.0,
							"viewPriceType": "成人温泉门票",
							"viewid": "2017120516324186464944",
							"couponPrice": 100.0,
							"tickID": "",
							"tickbID": ""
						}],
						"viewUrl": "http://111.230.129.41:80/guizhoubus/23344_2017120516324170615263.jpg",
						"saleType": 0
					},
					"leftTickets": 1,
					"totalTickets": 1
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
					"plans": [{
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
						"viewPrices": [{
							"viewPriceId": "2017120621  145021818849",
							"viewCoupon": 1,
							"viewPrice": 100,
							"viewPriceType": "成人温泉门票",
							"viewid": "2017120516324186464944",
							"couponPrice": 100,
							"tickID": "",
							"tickbID": ""
						}],
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
					"plans": [{
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
					}],
					"viewInfo": {
						"viewid": "2017120516324186464944",
						"viewName": "息烽温泉",
						"viewaddr": "贵阳市息烽温泉游客集散中心",
						"viewType": "自然景观",
						"viewPhoto": "23344_2017120516324170615263.jpg",
						"viewintru": "息烽温泉是全国著名八大温泉之一，地处黔中，位于息烽城东北40公里的天台山脚下，海拔高度700米，四面环山。温泉水经国家鉴定为“含偏硅酸和锶的重碳酸钙型氡泉”，是世界少有，国内著名的优质天然医疗和饮用矿泉水之一，含有多种对人体有益的微量元素，并含有放射性元素氡，水温稳定在53-56οc，被誉为“与法兰西维琪温泉相伯仲”的优质热矿泉",
						"viewPrices": [{
							"viewPriceId": "2017120621145021818849",
							"viewCou  pon": 1,
							"viewPrice": 100,
							"viewPriceType": "成人温泉门票",
							"viewid": "2017120516324186464944",
							"couponPrice": 100,
							"tickID": "",
							"tickbID": ""
						}],
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

// @3
router.post('/product/queryProduct', function (req, res, next) {
	res.send({
		"code": 0,
		"data": {
			"product": {
				"productid": "2017122614251275636623",
				"productType": "门票",
				"region": "贵阳",
				"viewaddress": "息烽温泉&息烽温泉，全国著名八大温泉之一",
				"isPush": "true",
				"productPrice": 100,
				"productinfo": "用户须知：1.泡温泉之前，应取下佩戴的金属饰品，否则会与温泉里的矿物质产生化学反应，造成佩饰变色。2.空腹或太饱时请勿入浴， 以免出现头晕、呕吐、消化不良、疲倦等症状。3.高血压和心脑血管疾病患者，在规则服药或经医生允许的前提下，可以泡温泉，但以每次不超过20分钟为宜。并注意：入水前，先用温泉缓慢的擦拭身体，待适应后再进入，以免影响血管正常收缩；出水时，缓慢起身，以防因血管扩张、血压下降导致头昏眼花而跌倒，诱发脑中风或心肌梗塞。4.泡温泉时，应多喝水，随时补充流失的水份。5.泡温泉时，如果感觉身体不适，应马上离开，不可勉强继续。6.泡温泉后，人体水分大量蒸发，应多喝水补充。费用不含：温泉内其他消费（按摩 搓背等其他自费）",
				"titleName": "息烽温泉直通车，一站直达",
				"photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110251444449900.jpg",
				"viewInfo": {
					"viewid": "2017120516324186464944",
					"viewName": "息烽温泉",
					"viewaddr": "贵阳市息烽温泉游客集散中心",
					"viewType": "自然景观",
					"viewPhoto": "23344_2017120516324170615263.jpg",
					"viewintru": "息烽温泉是全国著名八大温泉之一，地处黔中，位于息烽城东北40公里的天台山脚下，海拔高度700米，四面环山。温泉水经国家鉴定为“含偏硅酸和锶的重碳酸钙型氡泉”，是世界少有，国内著名的优质天然医疗和饮用矿泉水之一，含有多种对人体有益的微量元素，并含有放射性元素氡，水温稳定在53-56οc，被誉为“与法兰西维琪温泉相伯仲”的优质热矿泉",
					"viewPrices": [{
						"viewPriceId": "2017120621145021818849",
						"viewCoupon": 1,
						"viewPrice": 100,
						"viewPriceType": "成人温泉门票",
						"viewid": "2017120516324186464944",
						"couponPrice": 100,
						"tickID": "",
						"tickbID": ""
					}],
					"viewUrl": "http://111.230.129.41:80/guizhoubus/23344_2017120516324170615263.jpg",
					"saleType": 0
				},
				"leftTickets": 1,
				"totalTickets": 1
			},
			"msg": "查询产品信息成功"
		}
	});
	res.end();
});

// @4
router.post('/product/queryProductList', function (req, res, next) {
	res.send({
		"code": 0,
		"data": {
			"products": [{
					"productid": "2017122614251275636623",
					"productType": "门票",
					"region": "贵阳",
					"viewaddress": "息烽温泉&息烽温泉，全国著名八大温泉之一",
					"isPush": "true",
					"productPrice": 100,
					"productinfo": "<p><br/><br/><!--StartFragment--></p><p style=\"font-size: 14px;text-align: center;\">用户须知</p><p style=\"font-size: 14px;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 12pt;\">1.</span></span><span style=\"font-size: 14px;\"><span style=\"font-size: 12pt;\">泡温泉之前，应取下佩戴的金属饰品，否则会与温泉里的矿物质产生化学反应，造成佩饰变色<br/>2.空腹或太饱时请勿入浴， 以免出现头晕、呕吐、消化不良、疲倦等症状。<br/>3.高血压和心脑血管疾病患者，在规则服药或经医生允许的前提下，可以泡温泉，但以每次不超过20分钟为宜。并注意：入水前，先用温泉缓慢的擦拭身体，待适应后再进入，以免影响血管正常收缩；出水时，缓慢起身，以防因血管扩张、血压下降导致头昏眼花而跌倒，诱发脑中风或心肌梗塞。<br/>4.泡温泉时，应多喝水，随时补充流失的水份。<br/>5.泡温泉时，如果感觉身体不适，应马上离开，不可勉强继续。<br/>6.泡温泉后，人体水分大量蒸发，应多喝水补充。n &gt;费用不含：温泉内其他消费（按摩 搓背等其他自费）</span></span><br/><br/></p><!--EndFragment--><p><br/></p><p><br/></p><p></p>",
					"titleName": "息烽温泉直通车，一站直达",
					"photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110251444449900.jpg",
					"viewInfo": {
						"viewid": "2017120516324186464944",
						"viewName": "息烽温泉",
						"viewaddr": "贵阳市息烽温泉游客集散中心",
						"viewType": "自然景观",
						"viewPhoto": "23344_2017120516324170615263.jpg",
						"viewintru": "息烽温泉是全国著名八大温泉之一，地处黔中，位于息烽城东北40公里的天台山脚下，海拔高度700米，四面环山。温泉水经国家鉴定为“含偏硅酸和锶的重碳酸钙型氡泉”，是世界少有，国内著名的优质天然医疗和饮用矿泉水之一，含有多种对人体有益的微量元素，并含有放射性元素氡，水温稳定在53-56οc，被誉为“与法兰西维琪温泉相伯仲”的优质热矿泉",
						"viewPrices": [{
							"viewPriceId": "2017120621145021818849",
							"viewCoupon": 1,
							"viewPrice": 100,
							"viewPriceType": "成人温泉门票",
							"viewid": "2017120516324186464944",
							"couponPrice": 100,
							"tickID": "",
							"tickbID": ""
						}],
						"viewUrl": "http://111.230.129.41:80/guizhoubus/23344_2017120516324170615263.jpg",
						"saleType": 0
					},
					"leftTickets": 1,
					"totalTickets": 1
				},
				{
					"productid": "2017123110213167379964",
					"productType": "往返+门票",
					"region": "贵阳",
					"viewaddress": "息烽温泉&息烽温泉，全国著名八大温泉之一",
					"isPush": "true",
					"productPrice": 198,
					"productinfo": "<p><br/></p><p><br/></p><!--StartFragment--><p style=\"font-size: 14px;text-align: center;\">用户须知</p><p style=\"font-size: 14px;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 12pt;\">1.</span></span><span style=\"font-size: 14px;\"><span style=\"font-size: 12pt;\">泡温泉之前，应取下佩戴的金属饰品，否则会与温泉里的矿物质产生化学反应，造成佩饰变色<br/>2.空腹或太饱时请勿入浴， 以免出现头晕、呕吐、消化不良、疲倦等症状。<br/>3.高血压和心脑血管疾病患者，在规则服药或经医生允许的前提下，可以泡温泉，但以每次不超过20分钟为宜。并注意：入水前，先用温泉缓慢的擦拭身体，待适应后再进入，以免影响血管正常收缩；出水时，缓慢起身，以防因血管扩张、血压下降导致头昏眼花而跌倒，诱发脑中风或心肌梗塞。<br/>4.泡温泉时，应多喝水，随时补充流失的水份。<br/>5.泡温泉时，如果感觉身体不适，应马上离开，不可勉强继续。<br/>6.泡温泉后，人体水分大量蒸发，应多喝水补充。n &gt;费用不含：温泉内其他消费（按摩 搓背等其他自费）</span></span><br/></p><!--EndFragment--><p><br/></p><p><br/></p>",
					"titleName": "息烽温泉直通车，一站直达",
					"photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110213277881480.jpg",
					"plans": [{
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
						"viewPrices": [{
							"viewPriceId": "2017120621145021818849",
							"viewCoupon": 1,
							"viewPrice": 100,
							"viewPriceType": "成人温泉门票",
							"viewid": "2017120516324186464944",
							"couponPrice": 100,
							"tickID": "",
							"tickbID": ""
						}],
						"viewUrl": "http://111.230.129.41:80/guizhoubus/23344_2017120516324170615263.jpg",
						"saleType": 0
					},
					"leftTickets": 10,
					"totalTickets": 20
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
					"plans": [{
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
					}],
					"viewInfo": {
						"viewid": "2017120516324186464944",
						"viewName": "息烽温泉",
						"viewaddr": "贵阳市息烽温泉游客集散中心",
						"viewType": "自然景观",
						"viewPhoto": "23344_2017120516324170615263.jpg",
						"viewintru": "息烽温泉是全国著名八大温泉之一，地处黔中，位于息烽城东北40公里的天台山脚下，海拔高度700米，四面环山。温泉水经国家鉴定为“含偏硅酸和锶的重碳酸钙型氡泉”，是世界少有，国内著名的优质天然医疗和饮用矿泉水之一，含有多种对人体有益的微量元素，并含有放射性元素氡，水温稳定在53-56οc，被誉为“与法兰西维琪温泉相伯仲”的优质热矿泉",
						"viewPrices": [{
							"viewPriceId": "2017120621145021818849",
							"viewCoupon": 1,
							"viewPrice": 100,
							"viewPriceType": "成人温泉门票",
							"viewid": "2017120516324186464944",
							"couponPrice": 100,
							"tickID": "",
							"tickbID": ""
						}],
						"viewUrl": "http://111.230.129.41:80/guizhoubus/23344_2017120516324170615263.jpg",
						"saleType": 0
					},
					"leftTickets": 19,
					"totalTickets": 30
				},
				{
					"productid": "2017123110281246562417",
					"productType": "往返",
					"region": "贵阳",
					"viewaddress": "息烽温泉&息烽温泉，全国著名八大温泉之一",
					"isPush": "false",
					"productPrice": 98,
					"productinfo": "<p><br/></p><!--StartFragment--><p style=\"font-size: 14px;text-align: center;\">用户须知</p><p style=\"font-size: 14px;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 12pt;\">1.</span></span><span style=\"font-size: 14px;\"><span style=\"font-size: 12pt;\">泡温泉之前，应取下佩戴的金属饰品，否则会与温泉里的矿物质产生化学反应，造成佩饰变色<br/>2.空腹或太饱时请勿入浴， 以免出现头晕、呕吐、消化不良、疲倦等症状。<br/>3.高血压和心脑血管疾病患者，在规则服药或经医生允许的前提下，可以泡温泉，但以每次不超过20分钟为宜。并注意：入水前，先用温泉缓慢的擦拭身体，待适应后再进入，以免影响血管正常收缩；出水时，缓慢起身，以防因血管扩张、血压下降导致头昏眼花而跌倒，诱发脑中风或心肌梗塞。<br/>4.泡温泉时，应多喝水，随时补充流失的水份。<br/>5.泡温泉时，如果感觉身体不适，应马上离开，不可勉强继续。<br/>6.泡温泉后，人体水分大量蒸发，应多喝水补充。</span></span></p><p style=\"font-size: 14px;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 12pt;\">费用不含：温泉内其他消费（按摩 搓背等其他自费）</span></span><br/><br/></p><!--EndFragment--><p><br/></p><p><br/></p>",
					"plans": [{
							"bpid": "2017123110281264665703",
							"lineid": "2017120516140110687149",
							"linename": "贵州饭店-息烽温泉",
							"productid": "2017123110281246562417",
							"viewaddress": "息烽温泉&息烽温泉，全国著名八大温泉之一",
							"sequence": 0,
							"relecode": "8242076616",
							"bdidType": 1,
							"drivetime": 120,
							"departaddr": "贵州饭店景区直通车",
							"departName": "贵州饭店",
							"arriveName": "息烽温泉",
							"departtime": "10:00",
							"bdid": "2017123110233250493160"
						},
						{
							"bpid": "2017123110281269557155",
							"lineid": "2017120516151142333854",
							"linename": "息烽温泉-贵州饭店",
							"productid": "2017123110281246562417",
							"viewaddress": "息烽温泉&息烽温泉，全国著名八大温泉之一",
							"sequence": 1,
							"relecode": "8242076616",
							"bdidType": 1,
							"drivetime": 120,
							"departaddr": "息烽温泉",
							"departName": "息烽温泉",
							"arriveName": "贵州饭店",
							"departtime": "17:00",
							"bdid": "2017123110233259065940"
						}
					],
					"leftTickets": 20,
					"totalTickets": 50
				}
			],
			"msg": "搜索产品成功"
		}
	});
	res.end();
});

// @5
router.post('/product/queryProductHieList', function (req, res, next) {
	res.send({
		"code": 0,
		"data": {
			"totalnum": 5,
			"msg": "查询产品评价成功",
			"buslineHierarchys": [{
					"username": "1862**61572",
					"orderScore": 5,
					"orderhie": "木头",
					"images": [
						"http://111.230.129.41:80/guizhoubus/2017120811553035226852.jpg",
						null,
						null
					],
					"orderid": "2017120609263224413629"
				},
				{
					"username": "1858**30057",
					"orderScore": 5,
					"orderhie": "你好，我是康文博",
					"images": [
						null,
						null,
						null
					],
					"orderid": "2017120609262542444877"
				},
				{
					"username": "1858**30057",
					"orderScore": 5,
					"orderhie": "你好，我是郭浩",
					"images": [
						null,
						null,
						null
					],
					"orderid": "2017120521323440109454"
				},
				{
					"username": "1858**30057",
					"orderScore": 5,
					"orderhie": "有钱了，肯定要来玩啊，不来玩钱没地方用 。景区不好玩？不好玩是不可能的，这辈子不好玩都是不存在的 。其他地方去又不方便，就是这种景区直通，才能满足的了生活这样子，这里感觉像回家一样，超喜欢这里的",
					"images": [
						null,
						null,
						null
					],
					"orderid": "2017120521323439344886"
				},
				{
					"username": "1858**30057",
					"orderScore": 5,
					"orderhie": "你好，我是滕召维",
					"images": [
						null,
						null,
						null
					],
					"orderid": "2017120521213644091684"
				}
			]
		}
	});
	res.end();
});

// @6
router.post('/product/queryUserBuslineCoupon', function (req, res, next) {
	res.send({
		"code": 0,
		"data": {
			"msg": "优惠券查询成功",
			"isHaveCoupon": true,
			"buslineCoupons": [{
					"couponMoney": 66,
					"overDate": "2020-5-17",
					"brcid": "1234567890"
				},
				{
					"couponMoney": 100,
					"overDate": "2020-5-17",
					"brcid": "1234567890"
				},
				{
					"couponMoney": 200,
					"overDate": "2020-5-17",
					"brcid": "1234567890"
				},
			]
		}

	});
	res.end();
});

// @7
router.post('/product/buyProductTicket', function (req, res, next) {
	res.send({
		"code": 0,
		"data": {
			"counponUse": true,
			"updateCoupon": true,
		}
	});
	res.end();
});

// @8
router.post('/product/queryProductOrderByBdid', function (req, res, next) {
	res.send({

		"code": 0,
		"data": {
			"viewOrders": [{
					"departName": "国际中心",
					"arriveName": "黄果树瀑布",
					"platenum": "贵A12345",
					"drivetime": "80",
					"departaddr": "贵州国际中心A站处",
					"departDate": "2020-5-1",
					"departTime": "9:00",
					"barcode": "28979746754739",
				},
				{
					"departName": "国际中心",
					"arriveName": "黄果树瀑布",
					"platenum": "贵A12345",
					"drivetime": "80",
					"departaddr": "贵州国际中心A站处",
					"departDate": "2020-5-1",
					"departTime": "9:00",
					"barcode": "28979746754739",
				},
			],
			"backViewOrders": [{
					"departName": "黄果树瀑布",
					"arriveName": "国际中心",
					"platenum": "贵A12345",
					"drivetime": "80",
					"departaddr": "黄果树瀑布B站处",
					"departDate": "2020-5-1",
					"departTime": "19:00",
					"barcode": "28979746754739",
					"carid": "1234",
					"lineid": "4321",
				},
				{
					"departName": "黄果树瀑布",
					"arriveName": "国际中心",
					"platenum": "贵A12345",
					"drivetime": "80",
					"departaddr": "黄果树瀑布B站处",
					"departDate": "2020-5-1",
					"departTime": "19:00",
					"barcode": "28979746754739",
					"carid": "1234",
					"lineid": "4321",
				},
			],
			"ticketOrders": [{
					"viewName": "黄果树瀑布",
					"useDate": "2020-5-1",
					"viewaddr": "安顺市",
					"viewPriceType": "成人票",
					"ticketCode": "12897947974",
					"isPay": 1,
					"qrcodeid": "1234567889"
				},
				{
					"viewName": "黄果树瀑布",
					"useDate": "2020-5-1",
					"viewaddr": "安顺市",
					"viewPriceType": "成人票",
					"ticketCode": "345632235",
					"isPay": 0,
					"qrcodeid": "65332123"
				}

			]
		}
	});
	res.end();
});

// @9
router.post('/product/queryCarLocation', function (req, res, next) {
	res.send({

		"code": 0,
		"data": {
			"car": {
				"currlon": 106.71,
				"currlat": 26.57,
			},
			"busline": {
				"departlon": 106.72,
				"departlat": 26.62,
				"arrivelon": 105.40,
				"arrivelat": 25.57,
			},
			"stations": [{
					"stalongitude": 106.65,
					"stalatitude": 26.68,
					"stationname": "白云区",
					"stationType": 1,
				},
				{
					"stalongitude": 106.58,
					"stalatitude": 26.83,
					"stationType": 1,
					"stationname": "修文",
				},
				{
					"stalongitude": 106.73,
					"stalatitude": 27.10,
					"stationType": 1,
					"stationname": "息烽",
				},
				{
					"stalongitude": 105.95,
					"stationType": 1,
					"stalatitude": 26.25,
					"stationname": "安顺市区"
				},
			]
		}
	});
	res.end();
});

// @10
router.post('/product/queryUserinfo', function (req, res, next) {
	res.send({
		"code": 0,
		"data": {
			"flag": true,
			"user": {
				"userid": "908437873463",
				"username": "师法大梦川",
				"phone": "18585830057",
				"sex": 0
			}

		}
	});
	res.end();
});

// @11
router.post('/product/modifyUserInfo', function (req, res, next) {
	res.send({
		"code": 0,
		"data": {
			"flag": true
		}
	});
	res.end();
});

// @12
router.post('/product/login', function (req, res, next) {
	res.send({
		"code": 0,
		"data": {
			"userInfo": {
				"userid": "2017120514584241037118",
				"phone": "18585830057",
				"sex": "0",
				"userStatus": 1,
				"balance": 0.0,
				"openid": "o5mL51Jzzud0npqbG9u-nrK8M9cc",
				"talSpendind": 0.0,
				"tripCount": 0,
				"type": 0
			}
		}
	});
	res.end();
});

// @13
// router.post('/product/login ', function (req, res, next) {
// 	res.send({
// 		"code": 0,
// 		"data": {

// 		}
// 	});
// });

// @14
// router.post('/product/login ', function (req, res, next) {
// 	res.send({
// 		"code": 0,
// 		"data": {

// 		}
// 	});
// });

// router.get('/product/queryProductKeywords ', function(req, res, next) {
//     res.send();
// });
// router.get('/product/queryProductKeywords ', function(req, res, next) {
//     res.send();
// });
// router.get('/product/queryProductKeywords ', function(req, res, next) {
//     res.send();
// });


module.exports = router;
