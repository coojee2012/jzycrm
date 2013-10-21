var DbMode=require('../modules/crm/Sms');

var util=require('util');
var crypto=require('crypto');
var md5 = crypto.createHash('md5');
var inld=new Array();
for(var key in DbMode.relations){
	inld.push(key);
}
/**
GET获取列表
**/
exports.get = function(req, res){
var where={};
where['mobile']='';
where['content']='';
where['sendState']=-1;
res.render('Sms/index.html', { title: '短信列表',where:where});
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
res.render('Sms/index.html', { title: '短信列表',where:where});	
};
/**
GET新建
**/
exports.createget=function(req,res){
console.log(DbMode.cloums);
var inst=null;
res.render('Sms/create.html', { title: '新增短信',inst:inst,msg:null,util:util});
};
/**
POST新建
**/
exports.createpost=function(req,res){
	//var Sms_mod=new DbMode();
	var mobiles=req.body['mobile'].split(',');
	var content=req.body['content'];
	diguiarray(req,res,mobiles,content);
/*	for(var key in req.body){
		//console.log(key);
		if(DbMode['cloums'][key]!=null && DbMode['cloums'][key]['input']['type']==='password')
		{
		Sms_mod[key]=md5.update(req.body[key]).digest('hex').toUpperCase(); 
		continue;
		}
		Sms_mod[key]=req.body[key];
	}*/
/*	Sms_mod.isValid(function (valid) {
	    if (!valid) {
	    	console.log(Sms_mod.errors); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
	    	res.render('Sms/create.html', { title: '新增短信',inst:Sms_mod,msg:Sms_mod.errors});
	    }else{
	    	
	    	Sms_mod.save(function(err,inst){
	    		if(err){
	    			console.log(err);
	    			res.render('Sms/create.html', { title: '新增短信',inst:inst,msg:err,util:util});
	    		}else{
	    		res.redirect('/Sms'); 
	    		}
	    	});	
	    }
	});*/

}

exports.AddSmsInfo=function(req,res){
	var Sms_mod=new DbMode();
	for(var key in req.body){
		Sms_mod[key]=req.body[key];
	}
	Sms_mod.isValid(function (valid) {
	    if (!valid) {	    	
	    	res.send({success:false,msg:"发送失败！"});	
	    }
	    else
	    {	    	
	    	Sms_mod.save(function(err,inst){
	    		if(err){
	    			res.send({success:false,msg:"发送失败！"});	
	    		}else{
	    			res.send({success:true,msg:"发送成功！"});	
	    		}
	    	});	
	    }
	});
}

function diguiarray(req,res,a,c){
if(a.length>0){
	var phone=a.pop();
	var Sms_mod=new DbMode();
	Sms_mod.mobile=phone;
	Sms_mod.content=c;
	Sms_mod.save(function(err,inst){
		diguiarray(req,res,a,c);	
	});
}else{
	res.redirect('/Sms'); 	
}	
}
/**
GET编辑
**/
exports.editget=function(req,res){
console.log(req.query);
var id=req.query.id;
DbMode.findOne({where:{id:id}}, function(err,inst){
if(err){
res.render('Sms/edit.html', { title: '编辑短信',inst:null,msg:err,util:util});
	}
else{
res.render('Sms/edit.html', { title: '编辑短信',inst:inst,msg:null,util:util});
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
res.render('Sms/edit.html', { title: '编辑短信',inst:null,msg:err,util:util});
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
res.render('Sms/edit.html', { title: '编辑短信',inst:inst,msg:err,util:util});
}
else{
console.log("修改成功："+o);
res.render('Sms/edit.html', { title: '编辑短信',inst:inst,msg:null,util:util});
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
res.render('Sms/detail.html', { title: '短信详细',inst:null,msg:err,util:util});
	}
else{
res.render('Sms/detail.html', { title: '短信详细',inst:inst,msg:null,util:util});
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
			res.send({success:true,msg:"删除短信成功！"});	
		}
			
		});
	
	}
	
});
	
}