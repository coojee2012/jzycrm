var DbMode = require('../modules/crm/OrderRecords');
var syslog = require('../common/syslog');

var util = require('util');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var moment = require('moment');

var nami = require('../asterisk/asmanager').nami,
	AsAction = require("nami").Actions;

var serverfn = {};
var inld = new Array();
for (var key in DbMode.relations) {
	inld.push(key);
}

exports.get = function(req, res) {
	var where = {};
	var pageindex = req.query['pageindex'] || 0;
	var cID = req.query['cID'] || req.body['cID'];
	var serMan = req.query['serMan'] || req.body['serMan'];
	//if(where!=null){}
	if (cID !== '')
		where.cID = cID;
	else
		where.cID = -1;
	if (serMan !== '')
		where.serMan = serMan;
	else
		where.serMan = -1;
	where.dactorName = -1;
	where.orderReslut = '';
	where.uphone = '';
	where.uaddr = '';
	where.orderContent = '';
	where.orderTime_from = '';
	where.orderTime_to = '';
	where.OrderTypeid = -1;
	if (req.session.roleid == 8) //派单部门只能看到自己部门的
		where.DepID = req.session.deptid;
	else
		where.DepID = -1;
	where.id = '';
	var dbs = null;
	res.render('OrderRecords/index.html', {
		title: '工单记录列表',
		roleid: req.session.roleid,
		items: dbs,
		pageindex: pageindex,
		serverfn: serverfn,
		where: where
	});
};

exports.post = function(req, res) {
	var where = {};
	var pageindex = req.query['pageindex'] || 0;
	var query = req.body || req.query;
	for (var key in query) {
		where[key] = query[key] || '';
	}
	if (req.session.roleid == 8) //派单部门只能看到自己部门的
		where.DepID = req.session.deptid;
	res.render('OrderRecords/index.html', {
		title: '工单记录列表',
		roleid: req.session.roleid,
		items: null,
		pageindex: pageindex,
		serverfn: serverfn,
		where: where
	});
};

exports.createget = function(req, res) {
	var unid = req.query['unid'] || req.body['unid'];
	var customid = req.query['customid'] || req.body['customid'];
	var uphone = req.query['uphone'] || req.body['uphone'];
	var uaddr = req.query['uaddr'] || req.body['uaddr'];
	//console.log(DbMode.cloums);
	var inst = new DbMode();
	inst.callUnitID = unid || -1;
	inst.cID = customid || -1;
	inst.uphone = uphone || '';
	inst.uaddr = uaddr || '';
	inst.orderContent = '';
	inst.orderReslut = '';
	inst.memo = '';
	inst.serMan = 0;
	res.render('OrderRecords/create.html', {
		title: '新增工单记录',
		inst: inst,
		msg: null,
		util: util
	});
};

exports.createpost = function(req, res) {
	var iswork = req.body['iswork']; //工作时间段标识，由座席自己决定
	var agentname=req.body['agentname'];
	DbMode.all({
		where: {
			id: req.body["id"]
		}
	}, function(err0, inst0) {
		if (err0) {
			syslog.add(req, res, 'sql', err0);
			res.render('OrderRecords/create.html', {
				title: '新增工单记录',
				inst: null,
				msg: err0,
				util: util
			});
		}

		if (inst0 != null && inst0.length > 0) {
			res.render('OrderRecords/create.html', {
				title: '新增工单记录',
				inst: inst0,
				msg: "已经添加过该工单！",
				util: util
			});

		} else {
			var OrderRecords_mod = new DbMode();
			for (var key in req.body) {
				//console.log(key);
				/*if(DbMode['cloums'][key]!=null && DbMode['cloums'][key]['input']['type']==='password')
		{
		OrderRecords_mod[key]=md5.update(req.body[key]).digest('hex').toUpperCase(); 
		continue;
		}*/
				OrderRecords_mod[key] = req.body[key];
			}
			if (iswork == 0) {
				OrderRecords_mod['paidanTime'] = OrderRecords_mod['orderTime'];
				OrderRecords_mod.OrderOptions = 1;
			}
			//水质科直接修改转台为处理中
			if (OrderRecords_mod.DepID == 11) {
				OrderRecords_mod.OrderOptions = 1;
			}
			OrderRecords_mod.isValid(function(valid) {
				if (!valid) {
					console.log(OrderRecords_mod.errors); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
					res.render('OrderRecords/create.html', {
						title: '新增工单记录',
						inst: OrderRecords_mod,
						msg: OrderRecords_mod.errors
					});
				} else {

					OrderRecords_mod.save(function(err, inst) {
						if (err) {
							syslog.add(req, res, 'sql', err);

							//return;
							res.render('OrderRecords/create.html', {
								title: '新增工单记录',
								inst: inst,
								msg: err,
								util: util
							});
						} else {
							var custominfo = require('../modules/crm/CustomInfo');
							custominfo.findOne({
								where: {
									id: inst.cID
								}
							}, function(err, custom) {
								if (err) {
									syslog.add(req, res, 'sql', err);
								} else {
									var smscontent = '户号:' + custom.idcard + '.地址:' + custom.lifeAddr;
									smscontent += '.故障:' + inst.orderContent;
									smscontent += '.电话:' + custom.phone;
									//smscontent += '。表号:' + custom.work;
									//smscontent += '。备注:' + inst.memo;

									//工作时间段处理
									if (iswork == 1) {
										var userinfo = require('../modules/crm/UserInfo');
										userinfo.all({
											where: {
												uDepId: inst.DepID
											}
										}, function(err, users) {
											if (err) {
												syslog.add(req, res, 'sql', err);
												res.redirect('/OrderRecords?cID=' + inst.cID);
											} else {
												for (var i5 = 0; i5 < users.length; i5++) {
													if (users[i5] != null && users[i5].uRolyId == 8) {
														var sms2 = require('../modules/crm/Sms');
														var Sms_mod = new sms2();
														Sms_mod.mobile = users[i5].uPhone;
														Sms_mod.content = smscontent;
														Sms_mod.shuoming = "发送短信给派单员";
														Sms_mod.agentname =agentname || req.session.username || '工作时间段';
														Sms_mod.pdyname =  '--';
														Sms_mod.wxsname =  '--';
														Sms_mod.save(function(err, instsms) {
															if (err) {
																syslog.add(req, res, 'sql', err);
															} else {

															}
														});
													}
												}

												res.redirect('/OrderRecords?cID=' + inst.cID);
											}
										});
									}
									//非工作时间段处理
									else {
										var userinfo = require('../modules/crm/UserInfo');
										userinfo.findOne({
											where: {
												id: inst.dactorName
											}
										}, function(err, user) {
											//发送短信
											var sms2 = require('../modules/crm/Sms');
											var Sms_mod = new sms2();
											Sms_mod.mobile = user.uPhone;
											Sms_mod.content = smscontent;
											Sms_mod.shuoming = "非工作时间段派单短信";
											Sms_mod.agentname = agentname || req.session.username || '非工作时间';
											Sms_mod.pdyname = agentname || req.session.username || '非工作时间';
											Sms_mod.wxsname = user.uName || '--';
											Sms_mod.save(function(err, instsms) {
												if (err) {
													syslog.add(req, res, 'sql', err);
												} else {
													res.redirect('/OrderRecords?cID=' + inst.cID);
												}
											});
											console.log('拨打电话', user.uDepID);
											//拨打电话,仅限维修组和售后部
											//if(user.uDepID==1 || user.uDepID==3){
											if (true) {
												var Variable = "CHANNEL(language)=cn,FRI2_OUTGOING_MEMBERID=1,POPTYPE=" + 1;

												var channel = "LOCAL/" + user.uPhone + "@sub-outgoing";
												var Context = 'sub-outgoing-paidan';
												var action = new AsAction.Originate();
												action.Channel = channel;
												//action.Timeout=30;
												action.Async = true;
												action.Account = '8000';
												action.Context = Context;
												action.Exten = '8000';
												//console.log(nami);
												if (nami.connected) {
													nami.send(action, function(response) {
														console.log(response);
													});
												}
											}

										});



									}

								}
							});


						}
					});
				}
			});
		}
	});

}

//编辑GET
exports.editget = function(req, res) {
	console.log(req.query);
	var id = req.query.id;
	var where = req.query.where;
	var pageindex = req.query.distart;
	DbMode.findOne({
		where: {
			id: id
		}
	}, function(err, inst) {
		if (err) {
			syslog.add(req, res, 'sql', err);
			res.render('OrderRecords/edit.html', {
				title: '编辑工单记录',
				inst: null,
				msg: err,
				util: util
			});
		} else {
			res.render('OrderRecords/edit.html', {
				title: '编辑工单记录',
				inst: inst,
				where: where,
				pageindex: pageindex,
				msg: null,
				util: util
			});
		}
	});

};
//编辑POST
exports.editpost = function(req, res) {
	var id = req.body["id"];
	var pageindex = req.query["pageindex"] || req.body["pageindex"];
	var where = {};
	DbMode.findOne({
		where: {
			id: id
		}
	}, function(err, inst) {
		if (err) {
			syslog.add(req, res, 'sql', err);
			res.render('OrderRecords/edit.html', {
				title: '编辑工单记录',
				inst: null,
				msg: err,
				where: where,
				pageindex: pageindex,
				util: util
			});
		} else {
			for (var key in req.body) {
				//console.log(key);
				if (key == 'id' || key == "pageindex")
					continue;
				if (DbMode['cloums'][key] != null && DbMode['cloums'][key]['input']['type'] === 'password') {
					inst[key] = md5.update(req.body[key]).digest('hex').toUpperCase();
					continue;
				}
				inst[key] = req.body[key];
			}

			DbMode.updateOrCreate(inst, function(err, o) {
				if (err) {
					syslog.add(req, res, 'sql', err);
					res.render('OrderRecords/edit.html', {
						title: '编辑工单记录',
						inst: inst,
						msg: err,
						where: where,
						pageindex: pageindex,
						util: util
					});
				} else {

					res.render('OrderRecords/edit.html', {
						title: '编辑工单记录',
						inst: inst,
						msg: null,
						pageindex: pageindex,
						where: where,
						util: util
					});
				}
			});

		}
	});

};

//详细GET
exports.detail = function(req, res) {
	var id = req.query.id;
	var where = req.query.where;
	var pageindex = req.query.distart;
	DbMode.findOne({
		where: {
			id: id
		}
	}, function(err, inst) {
		if (err) {
			syslog.add(req, res, 'sql', err);
			res.render('OrderRecords/detail.html', {
				title: '工单记录详细',
				inst: null,
				msg: err,
				util: util
			});
		} else {
			res.render('OrderRecords/detail.html', {
				title: '工单记录详细',
				inst: inst,
				msg: null,
				where: where,
				pageindex: pageindex,
				util: util
			});
		}
	});

};


exports.del = function(req, res) {
	var id = req.body["ids"];
	DbMode.findOne({
		where: {
			id: id
		}
	}, function(err, inst) {
		if (err) {
			syslog.add(req, res, 'sql', err);

		} else {
			inst.destroy(function(err) {
				if (err) {
					console.log(err);
				} else {
					res.send({
						success: true,
						msg: "删除工单记录成功！"
					});
				}

			});

		}

	});

}

exports.getPhone = function(req, res) {
	var id = req.body["id"];
	DbMode.findOne({
		include: inld,
		where: {
			id: id
		}
	}, function(err, inst) {
		if (err) {
			syslog.add(req, res, 'sql', err);
			res.send({
				success: false,
				msg: "查询工单发生错误！"
			});

		} else {
			if (inst != null) {
				var udata = {};
				var phone = '';
				if (inst.__cachedRelations.UserInfo2 != null) {
					udata.name = inst.__cachedRelations.UserInfo2.uName;
					udata.phone = inst.__cachedRelations.UserInfo2.uPhone;
				}
				res.send({
					success: true,
					udata: udata,
					msg: "获取成功！"
				});
			} else {
				res.send({
					success: false,
					msg: "没有找到该工单！"
				});
			}


		}

	});
}

exports.getOrder = function(req, res) {
	var id = req.body["id"];
	var huifang = req.body["huifang"];
	DbMode.findOne({
		include: inld,
		where: {
			id: id
		}
	}, function(err, inst) {
		if (err) {
			syslog.add(req, res, 'sql', err);
			res.send({
				success: false,
				msg: "查询工单发生错误！"
			});

		} else {
			if (inst != null) {
				//console.log(inst.__cachedRelations.CustomInfo);
				if (inst.OrderOptions == 2) {
					res.send({
						success: false,
						msg: "该工单已经处理了！"
					});
				} else if (huifang == 1 && inst.OrderOptions == 0) {
					res.send({
						success: false,
						msg: "请先派单！"
					});
				} else {
					var data = {};
					data.id = inst.id;
					data.orderContent = inst.orderContent;
					data.memo = inst.memo;
					data.OrderOptions=inst.OrderOptions;
					data.CustomInfo = inst.__cachedRelations.CustomInfo;
					data.OrderType = inst.__cachedRelations.OrderType;
					data.orderReslut=inst.orderReslut;
					//console.log(data);
					res.send({
						success: true,
						data: data,
						msg: "获取成功！"
					});
				}
			} else {
				res.send({
					success: false,
					msg: "没有找到该工单！"
				});
			}


		}

	});

}

exports.paiDan = function(req, res) {
	var orderid, manid, sms, paid;
	orderid = req.body["id"];
	manid = req.body["manid"];
	sms = req.body["sms"];
	paid = req.body["paid"];
	var shuoming = req.body["shuoming"];
	var agentname=req.body['agentname'];
	DbMode.findOne({
		include: inld,
		where: {
			id: orderid
		}
	}, function(err, inst) {
		if (err) {
			syslog.add(req, res, 'sql', err);
			res.send({
				success: false,
				msg: "查询工单发生错误！"
			});

		} else {
			if (inst != null) {
				inst.dactorName = paid;
				inst.OrderOptions = 1;
				inst.paidanTime = moment().format("YYYY-MM-DD HH:mm:ss");
				DbMode.updateOrCreate(inst, function(err, o) {
					if (err) {
						syslog.add(req, res, 'sql', err);
						res.send({
							success: false,
							msg: "更新发生错误！"
						});
					} else {
						DbMode.findOne({
							include: inld,
							where: {
								id: orderid
							}
						}, function(err, inst12) {
							console.log(inst12.__cachedRelations);
							var sms2 = require('../modules/crm/Sms');
							var Sms_mod = new sms2();
							Sms_mod.mobile = inst12.__cachedRelations.UserInfo2.uPhone;
							Sms_mod.content = sms;
							Sms_mod.agentname = inst12.__cachedRelations.UserInfo3.uName || '无坐席';
							Sms_mod.pdyname = agentname || req.session.username || '无派单员';
							Sms_mod.wxsname = inst12.__cachedRelations.UserInfo2.uName || '无师傅';
							Sms_mod.depid=inst12.__cachedRelations.UserInfo2.uDepId || -1;
							if(Sms_mod.agentname == Sms_mod.pdyname)
							{
								Sms_mod.pdtype=1;
							}
							Sms_mod.shuoming = shuoming;
							console.log(Sms_mod);
							Sms_mod.save(function(err, instsms) {
								if (err) {
									syslog.add(req, res, 'sql', err);
									res.send({
										success: false,
										msg: "发送失败！"
									});
								} else {
									var myDate = new Date();
									var hours=myDate.getHours(); 

									if(hours<9 || hours>17){
							var Sms_mod2 = new sms2();
							Sms_mod2.mobile = '13550716066';
							Sms_mod2.content = sms;
							Sms_mod2.agentname = inst12.__cachedRelations.UserInfo3.uName || '无坐席';
							Sms_mod2.pdyname = agentname || req.session.username || '无派单员';
							Sms_mod2.wxsname ='--';
							Sms_mod2.pdtype=3;
							Sms_mod2.shuoming = "给彭叙军非工作时间派单短信！";
							Sms_mod2.save(function(){});

									}
									res.send({
										success: true,
										msg: "派单成功，短信发送成功！"
									});
								}
							});
						});
					}

				});
			} else {
				res.send({
					success: false,
					msg: "没有找到该工单！"
				});
			}


		}

	});


}

exports.huiFang = function(req, res) {
	var orderid, manid, content, options;
	orderid = req.body["id"];
	manid = req.body["manid"];
	content = req.body["content"];
	options = req.body["options"];
	DbMode.findOne({
		include: inld,
		where: {
			id: orderid
		}
	}, function(err, inst) {
		if (err) {
			syslog.add(req, res, 'sql', err);
			res.send({
				success: false,
				msg: "查询工单发生错误！"
			});

		} else {
			if (inst != null) {
				inst.backMan = manid;
				inst.OrderOptions = options;
				inst.orderReslut = content;
				inst.recordTime = moment().format("YYYY-MM-DD HH:mm:ss");
				DbMode.updateOrCreate(inst, function(err, o) {
					if (err) {
						syslog.add(req, res, 'sql', err);
						res.send({
							success: false,
							msg: "更新发生错误！"
						});
					} else {

						res.send({
							success: true,
							msg: "保存成功！"
						});

					}

				});
			} else {
				res.send({
					success: false,
					msg: "没有找到该工单！"
				});
			}


		}

	});

}