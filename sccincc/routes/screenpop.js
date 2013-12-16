var util = require('util');
var CustomInfo = require('../modules/crm/CustomInfo');
var syslog = require('../common/syslog');

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

	try {

		CustomInfo.findOne({
			where: {
				phone: phone
			}
		}, function(err, inst) {
			if (err) {
				throw err;
			}
			if (inst == null) {
				//inst=new CustomInfo();
				//inst.phone=caller;
				//inst.csex=0;
			}

			res.render('screenpop/index.html', {
				inst: inst,
				phone: phone,
				error: null,
				callmsg: callmsg
			});
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