var express = require('express');
var router = express.Router();
// @本地化API

// @1
router.post('/product/queryProductKeywords', function (req, res, next) {
	res.send({
		"code": 0,
		"data": {
			"products": [
				{ "viewaddress": "地落水库" },
				{"viewaddress": "民和乡"},
				{"viewaddress": "大山林"},
				{"viewaddress": "荒田湾"},
				{"viewaddress": "革腊寨"},
				{"viewaddress": "龙宿村"},
				{"viewaddress": "泥沙村"},
				{"viewaddress": "清水塘"}
			],
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
			"products": [
				{
					"productid": "2017122614251275636623",
					"productType": "门票",
					"region": "贵阳",
					"viewaddress": "低落水库，天然秀明",
					"isPush": "true",
					"productPrice": 100.0,
					"productinfo": "用户须知：请注意安全！",
					"titleName": "低落水库，天然秀明",
					"photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110251444449900.jpg",
					"viewInfo": {
						"viewid": "2017120516324186464944",
						"viewName": "低落水库",
						"viewaddr": "民和乡",
						"viewType": "自然景观",
						"viewPhoto": "23344_2017120516324170615263.jpg",
						"viewintru": "自然景色",
						"viewPrices": [{
							"viewPriceId": "2017120621145021818849",
							"viewCoupon": 1.0,
							"viewPrice": 100.0,
							"viewPriceType": "成人门票",
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
					"region": "民和",
					"viewaddress": "黄柏大山",
					"isPush": "true",
					"productPrice": 198,
					"productinfo": "用户须知：请注意安全！",
					"titleName": "原始森林，黄柏大山",
					"photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110213277881480.jpg",
					"plans": [{
							"bpid": "2017123110233260609516",
							"lineid": "2017120516140110687149",
							"linename": "民和乡-黄柏大山",
							"productid": "2017123110213167379964",
							"viewaddress": "民和乡",
							"sequence": 0,
							"relecode": "7838204520",
							"bdidType": 1,
							"drivetime": 120,
							"departaddr": "民和乡",
							"departName": "上街",
							"arriveName": "黄柏大山",
							"departtime": "10:00",
							"bdid": "2017123110233250493160"
						},
						{
							"bpid": "2017123110233283580177",
							"lineid": "2017120516151142333854",
							"linename": "黄柏大山-民和乡",
							"productid": "2017123110213167379964",
							"viewaddress": "原始森林，黄柏大山",
							"sequence": 1,
							"relecode": "7838204520",
							"bdidType": 1,
							"drivetime": 120,
							"departaddr": "黄柏大山",
							"departName": "黄柏大山",
							"arriveName": "民和乡",
							"departtime": "17:00",
							"bdid": "2017123110233259065940"
						}
					],
					"viewInfo": {
						"viewid": "2017120516324186464944",
						"viewName": "",
						"viewaddr": "黄柏大山游客集散中心",
						"viewType": "自然景观",
						"viewPhoto": "23344_2017120516324170615263.jpg",
						"viewintru": "黄柏大山",
						"viewPrices": [{
							"viewPriceId": "2017120621  145021818849",
							"viewCoupon": 1,
							"viewPrice": 100,
							"viewPriceType": "成人门票",
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
					"region": "民和",
					"viewaddress": "龙宿大洞",
					"isPush": "true",
					"productPrice": 149,
					"productinfo": "用户须知：请注意安全！",
					"titleName": "龙宿大洞，有龙则灵",
					"photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110263826949605.jpg",
					"plans": [{
						"bpid": "2017123110263831840115",
						"lineid": "2017120516140110687149",
						"linename": "民和乡-龙宿",
						"productid": "2017123110263804508394",
						"viewaddress": "龙宿村",
						"sequence": 0,
						"relecode": "6824123245",
						"bdidType": 0,
						"drivetime": 120,
						"departaddr": "民和乡",
						"departName": "上街",
						"arriveName": "龙宿村",
						"departtime": "10:00",
						"bdid": "2017123110233250493160"
					}],
					"viewInfo": {
						"viewid": "2017120516324186464944",
						"viewName": "龙宿大洞",
						"viewaddr": "龙宿大洞游客集散中心",
						"viewType": "自然景观",
						"viewPhoto": "23344_2017120516324170615263.jpg",
						"viewintru": "龙宿大洞，有龙则灵",
						"viewPrices": [{
							"viewPriceId": "2017120621145021818849",
							"viewCou  pon": 1,
							"viewPrice": 100,
							"viewPriceType": "成人门票",
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
				"productid": "2017123110213167379964",
				"productType": "往返+门票",
				"region": "贵州",
				"viewaddress": "民和镇-清水塘",
				"isPush": "true",
				"productPrice": 198,
				"productinfo": "蜿蜒曲折的乡间道路，穿梭如画",
				"titleName": "民和镇-清水塘",
				"photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110213277881480.jpg",
				"plans": [{
						"bpid": "2017123110233260609516",
						"lineid": "2017120516140110687149",
						"linename": "民和镇-清水塘",
						"productid": "2017123110213167379964",
						"viewaddress": "蜿蜒曲折的乡间道路，穿梭如画",
						"sequence": 0,
						"relecode": "7838204520",
						"bdidType": 1,
						"drivetime": 120,
						"departaddr": "民和镇",
						"departName": "民和镇",
						"arriveName": "清水塘",
						"departtime": "10:00",
						"bdid": "2017123110233250493160"
					},
					{
						"bpid": "2017123110233283580177",
						"lineid": "2017120516151142333854",
						"linename": "清水塘-民和镇",
						"productid": "2017123110213167379964",
						"viewaddress": "蜿蜒曲折的乡间道路，穿梭如画",
						"sequence": 1,
						"relecode": "7838204520",
						"bdidType": 1,
						"drivetime": 120,
						"departaddr": "清水塘",
						"departName": "清水塘",
						"arriveName": "民和镇",
						"departtime": "17:00",
						"bdid": "2017123110233259065940"
					}
				],
				"viewInfo": {
					"viewid": "2017120516324186464944",
					"viewName": "清水大塘",
					"viewaddr": "清水大塘游客集散中心",
					"viewType": "自然景观",
					"viewPhoto": "23344_2017120516324170615263.jpg",
					"viewintru": "清水大塘，山水则灵",
					"viewPrices": [{
						"viewPriceId": "2017120621145021818849",
						"viewCoupon": 1,
						"viewPrice": 100,
						"viewPriceType": "成人门票",
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
			"products": [
				{
					"productid": "2017122614251275636623",
					"productType": "门票",
					"region": "贵阳",
					"viewaddress": "黄柏大山",
					"isPush": "true",
					"productPrice": 100,
					"productinfo": "钟灵毓秀，原始森林",
					"titleName": "钟灵毓秀，原始森林",
					"photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110251444449900.jpg",
					"viewInfo": {
						"viewid": "2017120516324186464944",
						"viewName": "黄柏大山",
						"viewaddr": "黄柏大山游客集散中心",
						"viewType": "自然景观",
						"viewPhoto": "23344_2017120516324170615263.jpg",
						"viewintru": "钟灵毓秀，原始森林",
						"viewPrices": [{
							"viewPriceId": "2017120621145021818849",
							"viewCoupon": 1,
							"viewPrice": 100,
							"viewPriceType": "成人门票",
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
					"region": "贵州",
					"viewaddress": "民和镇-清水塘",
					"isPush": "true",
					"productPrice": 198,
					"productinfo": "蜿蜒曲折的乡间道路，穿梭如画",
					"titleName": "民和镇-清水塘",
					"photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110213277881480.jpg",
					"plans": [{
							"bpid": "2017123110233260609516",
							"lineid": "2017120516140110687149",
							"linename": "民和镇-清水塘",
							"productid": "2017123110213167379964",
							"viewaddress": "蜿蜒曲折的乡间道路，穿梭如画",
							"sequence": 0,
							"relecode": "7838204520",
							"bdidType": 1,
							"drivetime": 120,
							"departaddr": "民和镇",
							"departName": "民和镇",
							"arriveName": "清水塘",
							"departtime": "10:00",
							"bdid": "2017123110233250493160"
						},
						{
							"bpid": "2017123110233283580177",
							"lineid": "2017120516151142333854",
							"linename": "清水塘-民和镇",
							"productid": "2017123110213167379964",
							"viewaddress": "蜿蜒曲折的乡间道路，穿梭如画",
							"sequence": 1,
							"relecode": "7838204520",
							"bdidType": 1,
							"drivetime": 120,
							"departaddr": "清水塘",
							"departName": "清水塘",
							"arriveName": "民和镇",
							"departtime": "17:00",
							"bdid": "2017123110233259065940"
						}
					],
					"viewInfo": {
						"viewid": "2017120516324186464944",
						"viewName": "清水大塘",
						"viewaddr": "清水大塘游客集散中心",
						"viewType": "自然景观",
						"viewPhoto": "23344_2017120516324170615263.jpg",
						"viewintru": "清水大塘，山水则灵",
						"viewPrices": [{
							"viewPriceId": "2017120621145021818849",
							"viewCoupon": 1,
							"viewPrice": 100,
							"viewPriceType": "成人门票",
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
					"region": "贵州",
					"viewaddress": "民和镇-清水塘",
					"isPush": "true",
					"productPrice": 149,
					"productinfo": "",
					"titleName": "蜿蜒曲折的乡间道路，穿梭如画",
					"photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110263826949605.jpg",
					"plans": [{
						"bpid": "2017123110263831840115",
						"lineid": "2017120516140110687149",
						"linename": "民和镇-清水塘",
						"productid": "2017123110263804508394",
						"viewaddress": "蜿蜒曲折的乡间道路，穿梭如画",
						"sequence": 0,
						"relecode": "6824123245",
						"bdidType": 0,
						"drivetime": 120,
						"departaddr": "民和镇",
						"departName": "民和镇",
						"arriveName": "清水塘",
						"departtime": "10:00",
						"bdid": "2017123110233250493160"
					}],
					"viewInfo": {
						"viewid": "2017120516324186464944",
						"viewName": "清水大塘",
						"viewaddr": "清水大塘游客集散中心",
						"viewType": "自然景观",
						"viewPhoto": "23344_2017120516324170615263.jpg",
						"viewintru": "清水大塘，山水则灵",
						"viewPrices": [{
							"viewPriceId": "2017120621145021818849",
							"viewCoupon": 1,
							"viewPrice": 100,
							"viewPriceType": "成人门票",
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
					"productid": "2017123110213167379964",
					"productType": "往返",
					"region": "贵州",
					"viewaddress": "民和镇-清水塘",
					"isPush": "true",
					"productPrice": 198,
					"productinfo": "蜿蜒曲折的乡间道路，穿梭如画",
					"titleName": "民和镇-清水塘",
					"photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110213277881480.jpg",
					"plans": [{
							"bpid": "2017123110233260609516",
							"lineid": "2017120516140110687149",
							"linename": "民和镇-清水塘",
							"productid": "2017123110213167379964",
							"viewaddress": "蜿蜒曲折的乡间道路，穿梭如画",
							"sequence": 0,
							"relecode": "7838204520",
							"bdidType": 1,
							"drivetime": 120,
							"departaddr": "民和镇",
							"departName": "民和镇",
							"arriveName": "清水塘",
							"departtime": "10:00",
							"bdid": "2017123110233250493160"
						},
						{
							"bpid": "2017123110233283580177",
							"lineid": "2017120516151142333854",
							"linename": "清水塘-民和镇",
							"productid": "2017123110213167379964",
							"viewaddress": "蜿蜒曲折的乡间道路，穿梭如画",
							"sequence": 1,
							"relecode": "7838204520",
							"bdidType": 1,
							"drivetime": 120,
							"departaddr": "清水塘",
							"departName": "清水塘",
							"arriveName": "民和镇",
							"departtime": "17:00",
							"bdid": "2017123110233259065940"
						}
					],
					"leftTickets": 10,
					"totalTickets": 20
				},
				{
					"productid": "2017122614251275636623",
					"productType": "门票",
					"region": "贵阳",
					"viewaddress": "地落水库",
					"isPush": "true",
					"productPrice": 100,
					"productinfo": "灵山之下，须弥之间",
					"titleName": "灵山之下，须弥之间",
					"photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110251444449900.jpg",
					"viewInfo": {
						"viewid": "2017120516324186464944",
						"viewName": "黄柏大山",
						"viewaddr": "低落水库游客集散中心",
						"viewType": "自然景观",
						"viewPhoto": "23344_2017120516324170615263.jpg",
						"viewintru": "灵山之下，须弥之间",
						"viewPrices": [{
							"viewPriceId": "2017120621145021818849",
							"viewCoupon": 1,
							"viewPrice": 100,
							"viewPriceType": "成人门票",
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
					"productid": "2017122614251275636623",
					"productType": "门票",
					"region": "贵阳",
					"viewaddress": "清水大塘",
					"isPush": "true",
					"productPrice": 100,
					"productinfo": "清水大塘，有龙则灵",
					"titleName": "清水大塘，有龙则灵",
					"photoPath": "http://111.230.129.41:80/guizhoubus/12233_2017123110251444449900.jpg",
					"viewInfo": {
						"viewid": "2017120516324186464944",
						"viewName": "清水大塘",
						"viewaddr": "清水大塘游客集散中心",
						"viewType": "自然景观",
						"viewPhoto": "23344_2017120516324170615263.jpg",
						"viewintru": "清水大塘，有龙则灵",
						"viewPrices": [{
							"viewPriceId": "2017120621145021818849",
							"viewCoupon": 1,
							"viewPrice": 100,
							"viewPriceType": "成人门票",
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
router.post('/product/queryUserProductTicketList', function (req, res, next) {
	res.send({

		"code": 0,
		"data": {

			"userViewList": {
				"viewOrders": [{
						"departName": "龙宿乡",
						"arriveName": "泥沙村",
						"platenum": "贵A12345",
						"drivetime": "80",
						"departaddr": "地落水库站",
						"departDate": "2020-5-1",
						"departTime": "9:00",
						"barcode": "28979746754739",
						"viewOrderStatus": 2
					},
					{
						"departName": "泥沙村",
						"arriveName": "龙宿乡",
						"platenum": "贵A12345",
						"drivetime": "80",
						"departaddr": "地落水库站",
						"departDate": "2020-5-1",
						"departTime": "9:00",
						"barcode": "28979746754739",
						"viewOrderStatus": 2
					},
					{
						"departName": "革腊寨",
						"arriveName": "民和镇",
						"platenum": "贵A12395",
						"drivetime": "80",
						"departaddr": "毛平站",
						"departDate": "2020-5-1",
						"departTime": "9:00",
						"barcode": "28979746754739",
						"viewOrderStatus": 2
					},
					{
						"departName": "民和镇",
						"arriveName": "清水塘",
						"platenum": "贵A12365",
						"drivetime": "80",
						"departaddr": "民和站",
						"departDate": "2020-5-1",
						"departTime": "9:00",
						"barcode": "28979746754739",
						"viewOrderStatus": 2
					},
					{
						"departName": "民和镇",
						"arriveName": "清水塘",
						"platenum": "贵A12365",
						"drivetime": "80",
						"departaddr": "民和站",
						"departDate": "2020-5-1",
						"departTime": "9:00",
						"barcode": "28979746754739",
						"viewOrderStatus": 3
					},
					{
						"departName": "民和镇",
						"arriveName": "清水塘",
						"platenum": "贵A12365",
						"drivetime": "80",
						"departaddr": "民和站",
						"departDate": "2020-5-1",
						"departTime": "9:00",
						"barcode": "28979746754739",
						"viewOrderStatus": 4
					},
					{
						"departName": "民和镇",
						"arriveName": "清水塘",
						"platenum": "贵A12365",
						"drivetime": "80",
						"departaddr": "民和站",
						"departDate": "2020-5-1",
						"departTime": "9:00",
						"barcode": "28979746754739",
						"viewOrderStatus": 5
					},
				],
				"backViewOrders": [{
						"departName": "民和镇",
						"arriveName": "清水塘",
						"platenum": "贵A12345",
						"drivetime": "80",
						"departaddr": "民和站",
						"departDate": "2020-5-1",
						"departTime": "19:00",
						"barcode": "28979746754739",
						"carid": "1234",
						"lineid": "4321",
						"viewOrderStatus": 4

					},
					{
						"departName": "张屯乡",
						"arriveName": "大山林",
						"platenum": "贵A24345",
						"drivetime": "80",
						"departaddr": "荒田湾",
						"departDate": "2020-5-1",
						"departTime": "19:00",
						"barcode": "28979746754739",
						"carid": "1234",
						"lineid": "4321",
						"viewOrderStatus": 3

					},
				],
			},
			"ticketOrders": [
				{
					"viewName": "地落水库",
					"useDate": "2020-5-1",
					"viewaddr": "安顺市",
					"viewPriceType": "成人票",
					"ticketCode": "12897947974",
					"isPay": 1,
					"qrcodeid": "1234567889",
					"ticketStatus": 2
				},
				{
					"viewName": "地落水库",
					"useDate": "2020-5-1",
					"viewaddr": "安顺市",
					"viewPriceType": "成人票",
					"ticketCode": "12897947974",
					"isPay": 1,
					"qrcodeid": "1234567889",
					"ticketStatus": 3
				},
				{
					"viewName": "地落水库",
					"useDate": "2020-5-1",
					"viewaddr": "安顺市",
					"viewPriceType": "成人票",
					"ticketCode": "12897947974",
					"isPay": 1,
					"qrcodeid": "1234567889",
					"ticketStatus": 4
				},
				{
					"viewName": "地落水库",
					"useDate": "2020-5-1",
					"viewaddr": "安顺市",
					"viewPriceType": "成人票",
					"ticketCode": "12897947974",
					"isPay": 1,
					"qrcodeid": "1234567889",
					"ticketStatus": 5
				},
				{
					"viewName": "黄柏大山",
					"useDate": "2020-5-1",
					"viewaddr": "安顺市",
					"viewPriceType": "成人票",
					"ticketCode": "345632235",
					"isPay": 0,
					"qrcodeid": "65332123",
					"ticketStatus": 2
				},
				{
					"viewName": "黄柏大山",
					"useDate": "2020-5-1",
					"viewaddr": "安顺市",
					"viewPriceType": "成人票",
					"ticketCode": "345632235",
					"isPay": 0,
					"qrcodeid": "65332123",
					"ticketStatus": 3
				},
				{
					"viewName": "黄柏大山",
					"useDate": "2020-5-1",
					"viewaddr": "安顺市",
					"viewPriceType": "成人票",
					"ticketCode": "345632235",
					"isPay": 0,
					"qrcodeid": "65332123",
					"ticketStatus": 4
				},
				{
					"viewName": "黄柏大山",
					"useDate": "2020-5-1",
					"viewaddr": "安顺市",
					"viewPriceType": "成人票",
					"ticketCode": "345632235",
					"isPay": 0,
					"qrcodeid": "65332123",
					"ticketStatus": 5
				},

			]
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
