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
				var in0 = "";
				var in1 = phone || "";
				soap.createClient(conf.wcfurl, function(err, client) {
					if (err || !client) {
						cb(err, null);
					} else {
						client.getList({
							in0: in0,
							in1: in1
						}, function(err, result, body) {
							if (result && result.out !== null && result.out.Usefz && result.out.Usefz.length > 0) {
								cb(null, result.out.Usefz[0]);
							} else {
								cb(null, null);
							}

						});
					}

				});
			}


		}, function(err, results) {
			var local=results.findlocal;
			var remote=results.findsoap;
			if(remote==null && local==null){
				res.render('screenpop/index.html', {
					inst: null,
					phone: Phone,
					tel: Tel,
					error: null,
					callmsg: callmsg
				});
			}
			else if(remote==null && local!=null){
				local.waterinfo=[];
				res.render('screenpop/index.html', {
					inst: local,
					phone: Phone,
					tel: Tel,
					error: null,
					callmsg: callmsg
				});
			}
			else if(remote!=null && local!=null){
				var inst={};
				inst.id=local.id;
				inst.cname="";//户名
				inst.idcard="";//户号
				inst.workunit="";//水表口径
				inst.lifeAddr="";//用水地址
				inst.cage="";//用水性质
				inst.csex="";//用水情况【欠费停水，正常用水，消户】
				inst.work="";水表号
				inst.waterinfo=[];


			}else if(remote!=null && local==null){
				var inst={};


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