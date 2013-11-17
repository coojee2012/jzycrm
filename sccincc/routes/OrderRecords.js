var DbMode=require('../modules/crm/OrderRecords');
var syslog=require('../common/syslog');

var util=require('util');
var crypto=require('crypto');
var md5 = crypto.createHash('md5');
var moment = require('moment');

var nami=require('../asterisk/asmanager').nami
, AsAction=require("nami").Actions;

var serverfn={};
var inld=new Array();
for(var key in DbMode.relations){
	inld.push(key);
}

exports.get = function(req, res){
var where={};
var cID=req.query['cID']||req.body['cID'];
var serMan=req.query['serMan']||req.body['serMan'];
if(cID!=='')
where.cID=cID;
else
where.cID=-1;
if(serMan!=='')
where.serMan=serMan;
else
where.serMan=-1;
where.dactorName=-1;
where.orderReslut='';
where.orderContent='';
where.OrderTypeid=-1;
if(req.session.roleid == 8 )//派单部门只能看到自己部门的
where.DepID=req.session.deptid;
else
where.DepID=-1;	
where.id='';
var dbs=null;
res.render('OrderRecords/index.html', { title: '工单记录列表',roleid:req.session.roleid,items:dbs,serverfn:serverfn,where:where});
};

exports.post=function(req,res){
var where={};
var query=req.body || req.query;
for(var key in query){
where[key]=query[key]||'';	
}
if(req.session.roleid == 8 )//派单部门只能看到自己部门的
where.DepID=req.session.deptid;
res.render('OrderRecords/index.html', { title: '工单记录列表',roleid:req.session.roleid,items:null,serverfn:serverfn,where:where});			
};

exports.createget=function(req,res){
var unid=req.query['unid']||req.body['unid'];	
var customid=req.query['customid']||req.body['customid'];
//console.log(DbMode.cloums);
var inst=new DbMode();
inst.callUnitID=unid || -1;
inst.cID=customid || -1;
inst.orderContent='';
inst.orderReslut='';
inst.memo='';
inst.serMan=0;
res.render('OrderRecords/create.html', { title: '新增工单记录',inst:inst,msg:null,util:util});
};

exports.createpost=function(req,res){
	var iswork= req.body['iswork'];//工作时间段标识，由座席自己决定
	DbMode.all({where:{id:req.body["id"]}}, function(err0,inst0){
	if(err0){
		syslog.add(req,res,'sql',err0);
		res.render('OrderRecords/create.html', { title: '新增工单记录',inst:null,msg:err0,util:util});}
	
	if(inst0!=null && inst0.length>0){
		res.render('OrderRecords/create.html', { title: '新增工单记录',inst:inst0,msg:"已经添加过该工单！",util:util});	
		
	}
	
	else{
	var OrderRecords_mod=new DbMode();
	for(var key in req.body){
		//console.log(key);
		/*if(DbMode['cloums'][key]!=null && DbMode['cloums'][key]['input']['type']==='password')
		{
		OrderRecords_mod[key]=md5.update(req.body[key]).digest('hex').toUpperCase(); 
		continue;
		}*/
		OrderRecords_mod[key]=req.body[key];
	}
	if(iswork==0)
		{
    OrderRecords_mod['paidanTime']=OrderRecords_mod['orderTime'];
    OrderRecords_mod.OrderOptions=1;
		}
	//水质科直接修改转台为处理中
	if(OrderRecords_mod.DepID==11){
		OrderRecords_mod.OrderOptions=1;	
	}
	OrderRecords_mod.isValid(function (valid) {
	    if (!valid) {
	    	console.log(OrderRecords_mod.errors); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
	    	res.render('OrderRecords/create.html', { title: '新增工单记录',inst:OrderRecords_mod,msg:OrderRecords_mod.errors});
	    }else{
	    	
	    	OrderRecords_mod.save(function(err,inst){
	    		if(err){
	    			syslog.add(req,res,'sql',err);
	    			
	    			//return;
	    			res.render('OrderRecords/create.html', { title: '新增工单记录',inst:inst,msg:err,util:util});
	    		}else{
				var custominfo=require('../modules/crm/CustomInfo');
                custominfo.findOne({where:{id:inst.cID}},function(err,custom){
				if(err){syslog.add(req,res,'sql',err);}
				else{
				var smscontent='用户姓名:'+custom.cname+',电话:'+custom.phone+',用水地址:'+custom.lifeAddr;
				    smscontent+='。故障:'+inst.orderContent;
				    smscontent+='。用户号:'+custom.work;
				    smscontent+='。表号:'+custom.idcard;
				    smscontent+='。备注:'+inst.memo;

//工作时间段处理
				if(iswork==1)
					{
	    		var userinfo=require('../modules/crm/UserInfo');
	    		userinfo.all({where:{uDepId:inst.DepID}},function(err,users){
	    		if(err){
	    			syslog.add(req,res,'sql',err);
	    			res.redirect('/OrderRecords?cID='+inst.cID); 
	    		}else{
	    			for(var i5=0;i5<users.length;i5++){
	    				if(users[i5]!=null && users[i5].uRolyId==8){
	    				var sms2=require('../modules/crm/Sms');
	    				var Sms_mod=new sms2();
	    				Sms_mod.mobile=users[i5].uPhone;
	    				Sms_mod.content=smscontent;
	    				Sms_mod.shuoming="1111";
	    				Sms_mod.save(function(err,instsms){
	    		    		if(err){
	    		    			syslog.add(req,res,'sql',err);	
	    		    		}else{
	    		    			
	    		    		}
	    		    	});	
	    		    		}
	    			}
	    			
	    			res.redirect('/OrderRecords?cID='+inst.cID); 
	    		}	
	    		});
				}
				//非工作时间段处理
				else{
					    var userinfo=require('../modules/crm/UserInfo');
						userinfo.findOne({where:{id:inst.dactorName}},function(err,user){
						//发送短信
						var sms2=require('../modules/crm/Sms');
	    				var Sms_mod=new sms2();						
	    				Sms_mod.mobile=user.uPhone;
	    				Sms_mod.content=smscontent;
	    				Sms_mod.shuoming="1111";
	    				Sms_mod.save(function(err,instsms){
	    		    		if(err){
	    		    			syslog.add(req,res,'sql',err);	
	    		    		}else{
	    		    			res.redirect('/OrderRecords?cID='+inst.cID); 
	    		    		}
	    		    	});	
	    				//拨打电话,仅限维修组和售后部
	    		    	if(user.uDepID==1 || user.uDepID==3 ){
	    				var Variable="CHANNEL(language)=cn,FRI2_OUTGOING_MEMBERID=1,POPTYPE="+1;	
	    				var channel="LOCAL/"+user.uPhone+"@sub-outgoing";
	    				var Context='sub-outgoing-callback';
	    				var action=new AsAction.Originate();
	    				action.Channel=channel;
	    				action.Timeout=30;
	    				action.Async=true;
	    				action.Account = 's';
	    				action.Context = Context;
	    				action.Exten = 's';
	    				//console.log(nami);
	    				if(nami.connected){
	    				nami.send(action,function(response){
	    					//res.send(response);			
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
exports.editget=function(req,res){
console.log(req.query);
var id=req.query.id;
DbMode.findOne({where:{id:id}}, function(err,inst){
if(err){
	syslog.add(req,res,'sql',err);
res.render('OrderRecords/edit.html', { title: '编辑工单记录',inst:null,msg:err,util:util});
	}
else{
res.render('OrderRecords/edit.html', { title: '编辑工单记录',inst:inst,msg:null,util:util});
}
}
);

};
//编辑POST
exports.editpost=function(req,res){
var id=req.body["id"];
DbMode.findOne({where:{id:id}}, function(err,inst){
if(err){
	syslog.add(req,res,'sql',err);
res.render('OrderRecords/edit.html', { title: '编辑工单记录',inst:null,msg:err,util:util});
	}
else{
for(var key in req.body){
		//console.log(key);
		if(key=='id')
			continue;
		if(DbMode['cloums'][key]!=null && DbMode['cloums'][key]['input']['type']==='password')
		{
		inst[key]=md5.update(req.body[key]).digest('hex').toUpperCase(); 
		continue;
		}
		inst[key]=req.body[key];
	}

DbMode.updateOrCreate(inst,function(err,o){
if(err){
	syslog.add(req,res,'sql',err);
res.render('OrderRecords/edit.html', { title: '编辑工单记录',inst:inst,msg:err,util:util});
}
else{

res.render('OrderRecords/edit.html', { title: '编辑工单记录',inst:inst,msg:null,util:util});
}
});

}
}
);

};

//详细GET
exports.detail=function(req,res){
var id=req.query.id;
DbMode.findOne({where:{id:id}}, function(err,inst){
if(err){
	syslog.add(req,res,'sql',err);
res.render('OrderRecords/detail.html', { title: '工单记录详细',inst:null,msg:err,util:util});
	}
else{
res.render('OrderRecords/detail.html', { title: '工单记录详细',inst:inst,msg:null,util:util});
}
}
);

};


exports.del=function(req,res){
var id=req.body["ids"];
DbMode.findOne({where:{id:id}}, function(err,inst){
	if(err){
		syslog.add(req,res,'sql',err);
		
	}else{
		inst.destroy(function(err){
		if(err){console.log(err);}
		else{
			res.send({success:true,msg:"删除工单记录成功！"});	
		}
			
		});
	
	}
	
});
	
}

exports.getPhone=function(req,res){
	var id=req.body["id"];
	DbMode.findOne({include:inld,where:{id:id}}, function(err,inst){
		if(err){
			syslog.add(req,res,'sql',err);
			res.send({success:false,msg:"查询工单发生错误！"});	
			
		}else{
			if(inst!=null){
				var udata={};
				var phone='';
				if(inst.__cachedRelations.UserInfo2!=null){
					udata.name=inst.__cachedRelations.UserInfo2.uName;
					udata.phone=inst.__cachedRelations.UserInfo2.uPhone;
				}
				res.send({success:true,udata:udata,msg:"获取成功！"});		
			}else{
				res.send({success:false,msg:"没有找到该工单！"});		
			}
		
		
		}
		
	});
}

exports.getOrder=function(req,res){
	var id=req.body["id"];
	var huifang=req.body["huifang"];
	DbMode.findOne({include:inld,where:{id:id}}, function(err,inst){
		if(err){
			syslog.add(req,res,'sql',err);
			res.send({success:false,msg:"查询工单发生错误！"});	
			
		}else{
			if(inst!=null){
				//console.log(inst.__cachedRelations.CustomInfo);
				if(inst.OrderOptions!=0 && huifang==0){
					res.send({success:false,msg:"该工单已经派单，请及时回访！"});	
				}else if(inst.OrderOptions!=1 && huifang==1){
					res.send({success:false,msg:"工单还未派单或已经回访了！"});		
				}
				else{
				var data={};
				data.id=inst.id;
				data.orderContent=inst.orderContent;
				data.memo=inst.memo;
				data.CustomInfo=inst.__cachedRelations.CustomInfo;
				data.OrderType=inst.__cachedRelations.OrderType;
				//console.log(data);
				res.send({success:true,data:data,msg:"获取成功！"});	
				}
			}else{
				res.send({success:false,msg:"没有找到该工单！"});		
			}
		
		
		}
		
	});	
	
}

exports.paiDan=function(req,res){
	var orderid,manid,sms,paid;
	orderid=req.body["id"];
	manid=req.body["manid"];
	sms=req.body["sms"];
	paid=req.body["paid"];
	var shuoming=req.body["shuoming"];
	DbMode.findOne({include:inld,where:{id:orderid}}, function(err,inst){
		if(err){
			syslog.add(req,res,'sql',err);
			res.send({success:false,msg:"查询工单发生错误！"});	
			
		}else{
			if(inst!=null){
			inst.dactorName=paid;
			inst.OrderOptions=1;
			inst.paidanTime=moment().format("YYYY-MM-DD HH:mm:ss");
			DbMode.updateOrCreate(inst,function(err,o){
				if(err){
					syslog.add(req,res,'sql',err);
					res.send({success:false,msg:"更新发生错误！"});						
				}else{
					DbMode.findOne({include:inld,where:{id:orderid}}, function(err,inst12){	
				console.log(inst12.__cachedRelations);	
				var sms2=require('../modules/crm/Sms');
				var Sms_mod=new sms2();
				Sms_mod.mobile=inst12.__cachedRelations.UserInfo2.uPhone;
				Sms_mod.content=sms;
				Sms_mod.shuoming=shuoming;
				Sms_mod.save(function(err,instsms){
		    		if(err){
		    			syslog.add(req,res,'sql',err);
		    			res.send({success:false,msg:"发送失败！"});	
		    		}else{
		    			res.send({success:true,msg:"派单成功，短信发送成功！"});	
		    		}
		    	});	
					});
				}	
				
			});
			}else{
				res.send({success:false,msg:"没有找到该工单！"});		
			}
		
		
		}
		
	});	
	
	
}

exports.huiFang=function(req,res){
	var orderid,manid,content,options;
	orderid=req.body["id"];
	manid=req.body["manid"];
	content=req.body["content"];
	options=req.body["options"];	
	DbMode.findOne({include:inld,where:{callUnitID:orderid}}, function(err,inst){
		if(err){
			syslog.add(req,res,'sql',err);
			res.send({success:false,msg:"查询工单发生错误！"});	
			
		}else{
			if(inst!=null){
			inst.backMan=manid;
			inst.OrderOptions=options;
			inst.orderReslut=content;
			inst.recordTime=moment().format("YYYY-MM-DD HH:mm:ss");
			DbMode.updateOrCreate(inst,function(err,o){
				if(err){
					syslog.add(req,res,'sql',err);
					res.send({success:false,msg:"更新发生错误！"});						
				}else{
					
		    	res.send({success:true,msg:"保存成功！"});	
		    	
				}	
				
			});
			}else{
				res.send({success:false,msg:"没有找到该工单！"});		
			}
		
		
		}
		
	});	
	
}




