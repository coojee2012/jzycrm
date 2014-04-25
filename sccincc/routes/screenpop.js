var util = require('util');
var CustomInfo = require('../modules/crm/CustomInfo');
var syslog = require('../common/syslog');
var conf = require('node-conf').load("common");
var soap = require("soap");
var async = require("async");

exports.get = function(req, res) {
	var callid = req.body['callid'] || req.query['callid'];
	var unid = req.body['unid'] || req.query['unid'];
	var caller = req.body['caller'] || req.query['caller'];
	var called = req.body['called'] || req.query['called'];
	var poptype = req.body['poptype'] || req.query['poptype'];
	var phone = caller || called || '';
	var callmsg = {};
	callmsg.callid = callid;
	callmsg.unid = unid || -1;
	callmsg.caller = caller;
	callmsg.called = called;
	callmsg.poptype = poptype;
	var re = /(^01\d+)|(^1\d+)|(^91\d+)|(^901\d+)/;
	var where = {};
	var Phone = "";
	var Tel = "";
	if (re.test(phone)) {
		where = {
			phone: phone
		};
		Phone = phone;
	} else {
		where = {
			tel: phone
		};
		Tel = phone;
	}


	try {
		async.auto({
			findlocal: function(cb) {
				CustomInfo.findOne({
					where: where
				}, function(err, inst) {
					cb(err, inst);
				});
			},
			findsoap: function(cb) {
				var in0 = ""; //户号
				var in1 = ""; //户名
				var in2 = ""; //表号
				var in3 = ""; //联系地址	
				var in4 = phone || "1270093324"; //联系方式

				soap.createClient(conf.wcfurl, function(err, client) {
					console.log("准备从SOAP获取用户信息！");
					if (err || !client) {
						console.log(err);
						cb(err, null);
					} else {
						console.log("已经建立了连接！");
						client.getRxws({
							in0: in0,
							in1: in1,
							in2: in2,
							in3: in3,
							in4: "1270093324"
						}, function(err, result, body) {
							if (err)
								console.log(err);
							if (result && result.out !== null && result.out.Rxwx && result.out.Rxwx.length > 0) {
								cb(null, result.out.Rxwx[0]);
							} else {
								cb(null, null);
							}

						}, {
							timeout: 10 * 1000
						});
					}

				});
			},
			getwaterinfo: ["findlocal", "findsoap",
				function(cb, resluts) {
					var huhao = "";
					if (resluts.findsoap != null) {
						huhao = resluts.findsoap.hId;
					} else if (resluts.findlocal != null) {
						huhao = resluts.findlocal.idcard;
					}
					if (huhao !== "") {
						soap.createClient(conf.wcfurl, function(err, client) {
							console.log("准备从SOAP获取用户用水信息！");
							if (err || !client) {
								console.log(err);
								cb(err, null);
							} else {
								console.log("已经建立了连接！");
								client.getAll({
									in0: huhao,
									in1: "",
									in2: "",
									in3: ""
								}, function(err, result, body) {
									if (err)
										console.log(err);
									if (result && result.out !== null && result.out.Rxwx && result.out.Rxwx.length > 0) {
										cb(null, result.out.Rxwx);
									} else {
										cb(null, []);
									}

								}, {
									timeout: 10 * 1000
								});
							}

						});
					} else {
						cb(null, []);
					}
				}
			]


		}, function(err, results) {

			var local = results.findlocal;
			var remote = results.findsoap;
			var warterinfo = results.getwaterinfo;
			console.log("remote", remote);
			console.log("warterinfo", warterinfo);
			console.log("local", local);
			if (remote == null && local == null) {
				res.render('screenpop/index.html', {
					inst: null,
					phone: Phone,
					tel: Tel,
					error: null,
					callmsg: callmsg
				});
			} else if (remote == null && local != null) {
				local.waterinfo = warterinfo;
				res.render('screenpop/index.html', {
					inst: local,
					phone: Phone,
					tel: Tel,
					error: null,
					callmsg: callmsg
				});
			} else if (remote != null) {
				var inst = {};
				inst.id = local == null ? "" : local.id;
				inst.cname = remote.uName; //户名
				inst.idcard = remote.hId; //户号
				inst.workunit = ""; //水表口径
				inst.lifeAddr = remote.uAddress; //用水地址
				inst.cage = remote.uCotogy; //用水性质
				var state = "1";
				if (remote.sfTs == "是")
					state = "0";
				if (remote.sfTs == "是")
					state = "-1";
				inst.csex = state; //用水情况【欠费停水，正常用水，消户】
				inst.work = remote.bh; //水表号
				inst.waterinfo = warterinfo;
				res.render('screenpop/index.html', {
					inst: inst,
					phone: Phone,
					tel: Tel,
					error: null,
					callmsg: callmsg
				});

			} else {
				res.render('500', {});
			}

		});


	} catch (e) {
		res.render('404', {});
	}


}

exports.post = function(req, res) {
	var phone = req.body['phone'] || req.query['phone'];

	CustomInfo.all({
		where: {
			phone: phone
		}
	}, function(err, customs) {

		var custom = null;

		if (customs != null && customs.length > 0) {

			custom = customs[0];
			console.log(custom);
			for (var key in req.body) {
				if (key == 'id')
					continue;
				custom[key] = req.body[key];
			}
			console.log(custom);
			CustomInfo.upsert(custom, function(err, inst) {
				if (err) {
					console.log(err);
					syslog.add(req, res, 'sql', err);
					console.log('更新用户信息发生异常：', err);
					//res.render('screenpop/index.html', { title: '新增系统外线',inst:inst,error:err});
					res.send({
						success: false,
						error: err
					});
				} else {
					//res.render('screenpop/index.html',{inst:inst,error:null});
					//console.log(inst);
					res.send({
						success: true,
						id: inst.id,
						error: null
					});
				}

			});

		} else {
			custom = new CustomInfo();

			for (var key in req.body) {
				custom[key] = req.body[key];
			}
			if (!custom.areaCode) {
				custom.areaCode = 1;
			}

			custom.isValid(function(valid) {

				if (!valid) {
					//console.log(custom); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
					//res.render('screenpop/index.html',{inst:custom,error:custom.errors});
					console.log(custom.errors);
					res.send({
						success: false,
						error: custom.errors
					});
				} else {
					CustomInfo.updateOrCreate(custom, function(err, inst) {
						if (err) {
							syslog.add(req, res, 'sql', err);
							console.log('新建用户信息发生异常：', err);
							//res.render('screenpop/index.html', { title: '新增系统外线',inst:inst,error:err});
							res.send({
								success: false,
								error: err
							});
						} else {
							//res.render('screenpop/index.html',{inst:inst,error:null});
							//console.log(inst);
							res.send({
								success: true,
								id: inst.id,
								error: null
							});
						}

					});

				}
			}); //结束验证
		}
	}); //查询有无
}