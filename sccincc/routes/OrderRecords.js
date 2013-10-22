var DbMode=require('../modules/crm/OrderRecords');

var util=require('util');
var crypto=require('crypto');
var md5 = crypto.createHash('md5');
var moment = require('moment');

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
where.callUnitID='';
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
inst.callUnitID=unid;
inst.cID=customid;
inst.orderContent='';
inst.orderReslut='';
inst.memo='';
inst.serMan=0;
res.render('OrderRecords/create.html', { title: '新增工单记录',inst:inst,msg:null,util:util});
};

exports.createpost=function(req,res){
	DbMode.findOne({where:{callUnitID:req.body["callUnitID"]}}, function(err,inst0){
	if(err0){res.render('OrderRecords/create.html', { title: '新增工单记录',inst:null,msg:err0,util:util});}
	if(inst0.length>0){
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
	OrderRecords_mod.isValid(function (valid) {
	    if (!valid) {
	    	console.log(OrderRecords_mod.errors); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
	    	res.render('OrderRecords/create.html', { title: '新增工单记录',inst:OrderRecords_mod,msg:OrderRecords_mod.errors});
	    }else{
	    	
	    	OrderRecords_mod.save(function(err,inst){
	    		if(err){
	    			console.log(err);
	    			//return;
	    			res.render('OrderRecords/create.html', { title: '新增工单记录',inst:inst,msg:err,util:util});
	    		}else{
	    		var userinfo=require('../modules/crm/UserInfo');
	    		userinfo.all({where:{uDepId:inst.DepID}},function(err,users){
	    		if(err){
	    			console.log(err);	
	    			res.redirect('/OrderRecords?cID='+inst.cID); 
	    		}else{
	    			for(var i5=0;i5<users.length;i5++){
	    				if(users[i5].uRolyId==8){
	    				var sms2=require('../modules/crm/Sms');
	    				var Sms_mod=new sms2();
	    				Sms_mod.mobile=users[i5].uPhone;
	    				Sms_mod.content="您有新的工单:"+inst.callUnitID+"，请及时处理！";
	    				Sms_mod.shuoming="1111";
	    				Sms_mod.save(function(err,instsms){
	    		    		if(err){
	    		    			console.log(err);	
	    		    		}else{
	    		    			
	    		    		}
	    		    	});	
	    		    		}
	    			}
	    			
	    			res.redirect('/OrderRecords?cID='+inst.cID); 
	    		}	
	    		});
	    		
	    		}
	    	});	
	    }
	});
	    		    		}
	    		    		}

}

//编辑GET
exports.editget=function(req,res){
console.log(req.query);
var id=req.query.id;
DbMode.findOne({where:{id:id}}, function(err,inst){
if(err){
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
console.log("修改错误："+o);
res.render('OrderRecords/edit.html', { title: '编辑工单记录',inst:inst,msg:err,util:util});
}
else{
console.log("修改成功："+o);
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
		console.log(err);
		
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
				data.callUnitID=inst.callUnitID;
				data.orderContent=inst.orderContent;
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
	DbMode.findOne({include:inld,where:{callUnitID:orderid}}, function(err,inst){
		if(err){
			res.send({success:false,msg:"查询工单发生错误！"});	
			
		}else{
			if(inst!=null){
			inst.dactorName=paid;
			inst.OrderOptions=1;
			inst.paidanTime=moment().format("YYYY-MM-DD HH:mm:ss");
			DbMode.updateOrCreate(inst,function(err,o){
				if(err){
					res.send({success:false,msg:"更新发生错误！"});						
				}else{
					DbMode.findOne({include:inld,where:{callUnitID:orderid}}, function(err,inst12){	
				console.log(inst12.__cachedRelations);	
				var sms2=require('../modules/crm/Sms');
				var Sms_mod=new sms2();
				Sms_mod.mobile=inst12.__cachedRelations.UserInfo2.uPhone;
				Sms_mod.content=sms;
				Sms_mod.shuoming=shuoming;
				Sms_mod.save(function(err,instsms){
		    		if(err){
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
			res.send({success:false,msg:"查询工单发生错误！"});	
			
		}else{
			if(inst!=null){
			inst.backMan=manid;
			inst.OrderOptions=options;
			inst.orderReslut=content;
			inst.recordTime=moment().format("YYYY-MM-DD HH:mm:ss");
			DbMode.updateOrCreate(inst,function(err,o){
				if(err){
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




