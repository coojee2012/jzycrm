var DbMode=require('../modules/crm/ComplaintRecords');

var util=require('util');
var crypto=require('crypto');
var md5 = crypto.createHash('md5');
var inld=new Array();
for(var key in DbMode.relations){
	inld.push(key);
}
console.log(inld);
/**
GET获取列表
**/
exports.get = function(req, res){
var where={};
var CustomID=req.query['CustomID']||req.body['CustomID'];
var workManID=req.query['workManID']||req.body['workManID'];
if(CustomID!=='')
where.CustomID=CustomID;
else
where.CustomID=-1;
if(workManID!=='')
where.workManID=workManID;
else
where.workManID=-1;
where['CodeID']=-1;
where['Content']='';
where['Content']='';
where['answerContent']='';
where['answerContent']='';
var DeptInfo=require('../modules/crm/DepInfo.js');
DeptInfo.all({},function(err,dbs){
if(err){
	res.render('ComplaintRecords/index.html', { title: '投诉记录列表',where:where,dbs:null});	
}else{
	res.render('ComplaintRecords/index.html', { title: '投诉记录列表',where:where,dbs:dbs});	
}	
});

};
/**
POST 获取列表
**/
exports.post=function(req,res){
var where={};
var query=req.body;
for(var key in query){
where[key]=query[key]||'';	
}
res.render('ComplaintRecords/index.html', { title: '投诉记录列表',where:where});	
};
/**
GET新建
**/
exports.createget=function(req,res){
	var unid=req.query['unid']||req.body['unid'];	
	var customid=req.query['customid']||req.body['customid'];

	var inst=new DbMode();
	inst.CodeID=1;
	inst.CustomID=customid;
	inst.Content='';
	inst.answerContent='';
	inst.workManID=0;
	inst.answerStatus=0;
res.render('ComplaintRecords/create.html', { title: '新增投诉记录',inst:inst,msg:null,util:util});
};
/**
POST新建
**/
exports.createpost=function(req,res){
	var ComplaintRecords_mod=new DbMode();
	//console.log(req.body);
	for(var key in req.body){
		//console.log(key);
		if(DbMode['cloums'][key]!=null && DbMode['cloums'][key]['input']['type']==='password')
		{
		ComplaintRecords_mod[key]=md5.update(req.body[key]).digest('hex').toUpperCase(); 
		continue;
		}
		ComplaintRecords_mod[key]=req.body[key];
	}
	ComplaintRecords_mod.isValid(function (valid) {
	    if (!valid) {
	    	console.log(ComplaintRecords_mod.errors); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
	    	res.render('ComplaintRecords/create.html', { title: '新增投诉记录',inst:ComplaintRecords_mod,msg:ComplaintRecords_mod.errors});
	    }else{
	    	
	    	ComplaintRecords_mod.save(function(err,inst){
	    		if(err){
	    			console.log(err);
	    			res.render('ComplaintRecords/create.html', { title: '新增投诉记录',inst:inst,msg:err,util:util});
	    		}else{
	    		res.redirect('/ComplaintRecords'); 
	    		}
	    	});	
	    }
	});

}

/**
GET编辑
**/
exports.editget=function(req,res){
console.log(req.query);
var id=req.query.id;
DbMode.findOne({where:{id:id}}, function(err,inst){
if(err){
res.render('ComplaintRecords/edit.html', { title: '编辑投诉记录',inst:null,msg:err,util:util});
	}
else{
res.render('ComplaintRecords/edit.html', { title: '编辑投诉记录',inst:inst,msg:null,util:util});
}
}
);

};
/**
POST编辑
**/
exports.editpost=function(req,res){
var id=req.body["id"];
DbMode.findOne({where:{id:id}}, function(err,inst){
if(err){
res.render('ComplaintRecords/edit.html', { title: '编辑投诉记录',inst:null,msg:err,util:util});
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
res.render('ComplaintRecords/edit.html', { title: '编辑投诉记录',inst:inst,msg:err,util:util});
}
else{
console.log("修改成功："+o);
res.render('ComplaintRecords/edit.html', { title: '编辑投诉记录',inst:inst,msg:null,util:util});
}
});

}
}
);

};

/**
GET详细
**/
exports.detail=function(req,res){
var id=req.query.id;
DbMode.findOne({where:{id:id}}, function(err,inst){
if(err){
res.render('ComplaintRecords/detail.html', { title: '投诉记录详细',inst:null,msg:err,util:util});
	}
else{
res.render('ComplaintRecords/detail.html', { title: '投诉记录详细',inst:inst,msg:null,util:util});
}
}
);

};

exports.getTouShu=function(req,res){
var id=req.body['id'] || '';
if(id==null || id=='')
{
	res.send({success:false,msg:'记录编号不正确'});
	return;
}
DbMode.findOne({include:inld,where:{id:id}}, function(err,inst){
	if(err){
		res.send({success:false,msg:util.inspect(err,false,null)});
		return;	
	}
	if(inst==null){
		res.send({success:false,msg:'未找到投诉记录信息！'});
		return;	
	}
	
	var custominfo={};
	custominfo=inst.__cachedRelations.CustomInfo;
	//console.log(custominfo);	
	res.send({success:true,msg:'获取成功！',inst:inst,custominfo:custominfo});
	
});
	
}

exports.addChuLi=function(req,res){
var id=req.body['id'] || '';
var answerContent=req.body['answerContent'] || '';
DbMode.findOne({where:{id:id}}, function(err,inst){
	if(err){
		res.send({success:false,msg:util.inspect(err,false,null)});
		return;	
	}
	if(inst==null){
		res.send({success:false,msg:'未找到投诉记录信息！'});
		return;	
	}
	var moment = require('moment');
	var nowtime=moment().format("YYYY-MM-DD HH:mm:ss");
	//console.log(nowtime);
	inst.answerTime=nowtime;
	inst.answerStatus=1;
	if(inst.answerContent==null)
		inst.answerContent='';
	inst.answerContent+='\n处理部门:'+req.session.deptname+'.\n内容:'+answerContent+'.\n时间:'+nowtime;
	
	DbMode.updateOrCreate(inst,function(e,o){
		if(e){
			res.send({success:false,msg:util.inspect(e,false,null)});
			return;	
		}
		res.send({success:true,msg:'处理成功！'});
		
	});
	
});
}

exports.addPiShi=function(req,res){
	var id=req.body['id'] || '';
	var comments=req.body['comments'] || '';
	DbMode.findOne({where:{id:id}}, function(err,inst){
		if(err){
			res.send({success:false,msg:util.inspect(err,false,null)});
			return;	
		}
		if(inst==null){
			res.send({success:false,msg:'未找到投诉记录信息！'});
			return;	
		}
		var moment = require('moment');
		var nowtime=moment().format("YYYY-MM-DD HH:mm:ss");
		//console.log(nowtime);
		//inst.answerTime=nowtime;
		//inst.answerStatus=1;
		if(inst.comments==null)
			inst.comments='';
		//console.log(req.session);
		inst.comments+='\n批示领导:'+req.session.username+'.\n内容:'+comments+'.\n时间:'+nowtime;
		
		DbMode.updateOrCreate(inst,function(e,o){
			if(e){
				res.send({success:false,msg:util.inspect(e,false,null)});
				return;	
			}
			res.send({success:true,msg:'批示成功！'});
			
		});
		
	});
	}


exports.addHuiFang=function(req,res){
	var id=req.body['id'] || '';
	var backContent=req.body['backContent'] || '';
	DbMode.findOne({where:{id:id}}, function(err,inst){
		if(err){
			res.send({success:false,msg:util.inspect(err,false,null)});
			return;	
		}
		if(inst==null){
			res.send({success:false,msg:'未找到投诉记录信息！'});
			return;	
		}
		var moment = require('moment');
		var nowtime=moment().format("YYYY-MM-DD HH:mm:ss");
		//console.log(nowtime);
		inst.backTime=nowtime;
		inst.answerStatus=2;
		inst.backManID=req.session.userid;
		if(inst.backContent==null)
			inst.backContent='';
		inst.backContent+=backContent;
		
		DbMode.updateOrCreate(inst,function(e,o){
			if(e){
				res.send({success:false,msg:util.inspect(e,false,null)});
				return;	
			}
			res.send({success:true,msg:'回访成功！'});
			
		});
		
	});	
}

/**
POST删除
**/
exports.del=function(req,res){
var id=req.body["ids"];
DbMode.findOne({where:{id:id}}, function(err,inst){
	if(err){
		console.log(err);
		
	}else{
		console.log(res);
		inst.destroy(function(err){
		if(err){console.log(err);}
		else{
			res.send({success:true,msg:"删除投诉记录成功！"});	
		}
			
		});
	
	}
	
});
	
}