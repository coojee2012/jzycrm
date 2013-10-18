var DbMode=require('../modules/crm/UserInfo');

var util=require('util');


var inld=new Array();
for(var key in DbMode.relations){
	inld.push(key);
}
/**
GET获取列表
**/
exports.get = function(req, res){
var where={};
where['uName']='';
where['uCard']='';
where['uSex']=-1;
where['uPhone']='';
where['uExten']='';
where['uDepId']=-1;
where['uRolyId']=-1;
res.render('UserInfo/index.html', { title: '用户列表',where:where});
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
res.render('UserInfo/index.html', { title: '用户列表',where:where});	
};
/**
GET新建
**/
exports.createget=function(req,res){
//console.log(DbMode.cloums);
var inst=null;
res.render('UserInfo/create.html', { title: '新增用户',inst:inst,msg:null,util:util});
};
/**
POST新建
**/

function jiaMi(key){
	var crypto=require('crypto');
	var md5 = crypto.createHash('md5');
	var reskey='';
	try{
		reskey=md5.update(key).digest('hex').toUpperCase();	
	}
	catch(e){
		console.log(e);
	}
	finally{
		return reskey;
	}
}

exports.EngineerList=function(req,res){

var where={};
where['uName']=req.body['uName'] || '';
where['uPhone']=req.body['uPhone'] || '';
where['uDepId']=req.session.deptid || -1;
where['uRolyId']=req.session.roleid || -1;
res.render('UserInfo/engineerList.html', { title: '工程师列表',where:where});		
}

exports.createEngineerGet=function(req,res){
	var inst=null;
	res.render('UserInfo/createEngineer.html', { title: '新增工程师',inst:inst,msg:null,util:util});	
}

exports.createEngineerPost=function(req,res){
	var UserInfo_mod=new DbMode();
	for(var key in req.body){
		//console.log(key);
		if(DbMode['cloums'][key]!=null && DbMode['cloums'][key]['input']['type']==='password')
		{
	    console.log("原始密码：",req.body[key]);
	    
		//UserInfo_mod[key]=md5.update(req.body[key]).digest('hex').toUpperCase(); 
	    UserInfo_mod[key] = jiaMi(req.body[key]);
		continue;
		}
		UserInfo_mod[key]=req.body[key];
	}
	var Guid = require('guid');
	var guid = Guid.create();
	UserInfo_mod.uLogin=guid;
	UserInfo_mod.uDepId=req.session.deptid;
	UserInfo_mod.uRolyId=req.session.roleid;
	
	UserInfo_mod.isValid(function (valid) {
	    if (!valid) {
	    	console.log(UserInfo_mod.errors); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
	    	res.render('UserInfo/createEngineer.html', { title: '新增工程师',inst:UserInfo_mod,msg:UserInfo_mod.errors});
	    }else{
	    	
	    	UserInfo_mod.save(function(err,inst){
	    		if(err){
	    			console.log(err);
	    			res.render('UserInfo/createEngineer.html', { title: '新增工程师',inst:inst,msg:err,util:util});
	    		}else{
	    		res.redirect('/UserInfo/EngineerList?dpt='+req.session.deptid); 
	    		}
	    	});	
	    }
	});	
}

exports.createpost=function(req,res){
	var UserInfo_mod=new DbMode();
	for(var key in req.body){
		//console.log(key);
		if(DbMode['cloums'][key]!=null && DbMode['cloums'][key]['input']['type']==='password')
		{
	    console.log("原始密码：",req.body[key]);
	    
		//UserInfo_mod[key]=md5.update(req.body[key]).digest('hex').toUpperCase(); 
	    UserInfo_mod[key] = jiaMi(req.body[key]);
		continue;
		}
		UserInfo_mod[key]=req.body[key];
	}
	UserInfo_mod.isValid(function (valid) {
	    if (!valid) {
	    	console.log(UserInfo_mod.errors); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
	    	res.render('UserInfo/create.html', { title: '新增用户',inst:UserInfo_mod,msg:UserInfo_mod.errors});
	    }else{
	    	
	    	UserInfo_mod.save(function(err,inst){
	    		if(err){
	    			console.log(err);
	    			res.render('UserInfo/create.html', { title: '新增用户',inst:inst,msg:err,util:util});
	    		}else{
	    		res.redirect('/UserInfo'); 
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
res.render('UserInfo/edit.html', { title: '编辑用户',inst:null,msg:err,util:util});
	}
else{
res.render('UserInfo/edit.html', { title: '编辑用户',inst:inst,msg:null,util:util});
}
}
);

};

exports.editEngineerGet=function(req,res){
	var id=req.query.id;
	DbMode.findOne({where:{id:id}}, function(err,inst){
	if(err){	
	res.render('UserInfo/editEngineer.html', { title: '编辑工程师',inst:null,msg:err,util:util});	
		}
	else{
		res.render('UserInfo/editEngineer.html', { title: '编辑工程师',inst:inst,msg:null,util:util});	
	}
	}
	);	
}


exports.editEngineerPost=function(req,res){
	var id=req.body["id"];
	DbMode.findOne({where:{id:id}}, function(err,inst){
	if(err){
	res.render('UserInfo/editEngineer.html', { title: '编辑工程师',inst:null,msg:err,util:util});
		}
	else{
	if(inst==null){
		res.render('UserInfo/editEngineer.html', { title: '编辑工程师',inst:null,msg:'未找到',util:util});	
		return;
	}
	for(var key in req.body){
			//console.log(key);
			if(key=='id')
				continue;		
			inst[key]=req.body[key];
		}

	DbMode.updateOrCreate(inst,function(err,o){
	if(err){	
	res.render('UserInfo/editEngineer.html', { title: '编辑工程师',inst:inst,msg:err,util:util});
	}
	else{
	res.render('UserInfo/editEngineer.html', { title: '编辑工程师',inst:o,msg:'修改成功！',util:util});
	}
	});

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
res.render('UserInfo/edit.html', { title: '编辑用户',inst:null,msg:err,util:util});
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
res.render('UserInfo/edit.html', { title: '编辑用户',inst:inst,msg:err,util:util});
}
else{
console.log("修改成功："+o);
res.render('UserInfo/edit.html', { title: '编辑用户',inst:inst,msg:'修改成功！',util:util});
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
res.render('UserInfo/detail.html', { title: '用户详细',inst:null,msg:err,util:util});
	}
else{
res.render('UserInfo/detail.html', { title: '用户详细',inst:inst,msg:null,util:util});
}
}
);

};

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
			res.send({success:true,msg:"删除用户成功！"});	
		}
			
		});
	
	}
	
});
	
}