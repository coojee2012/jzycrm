var DbMode=require('../modules/ippbx/extension');

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



where['accountcode']='';
where['accountcode']='';





where['deviceproto']=-1;















res.render('extension/index.html', { title: '系统分机列表',where:where});
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
res.render('extension/index.html', { title: '系统分机列表',where:where});	
};
/**
GET新建
**/
exports.createget=function(req,res){
console.log(DbMode.cloums);
var inst=null;
res.render('extension/create.html', { title: '新增系统分机',inst:inst,msg:null,util:util});
};
/**
POST新建
**/
exports.createpost=function(req,res){
	var extension_mod=new DbMode();
	for(var key in req.body){
		//console.log(key);
		if(DbMode['cloums'][key]!=null && DbMode['cloums'][key]['input']['type']==='password')
		{
		extension_mod[key]=md5.update(req.body[key]).digest('hex').toUpperCase(); 
		continue;
		}
		extension_mod[key]=req.body[key];
	}
	extension_mod.isValid(function (valid) {
	    if (!valid) {
	    	console.log(extension_mod.errors); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
	    	res.render('extension/create.html', { title: '新增系统分机',inst:extension_mod,msg:extension_mod.errors});
	    }else{
	    	
	    	extension_mod.save(function(err,inst){
	    		if(err){
	    			console.log(err);
	    			res.render('extension/create.html', { title: '新增系统分机',inst:inst,msg:err,util:util});
	    		}else{
	    		res.redirect('/extension'); 
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
res.render('extension/edit.html', { title: '编辑系统分机',inst:null,msg:err,util:util});
	}
else{
res.render('extension/edit.html', { title: '编辑系统分机',inst:inst,msg:null,util:util});
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
res.render('extension/edit.html', { title: '编辑系统分机',inst:null,msg:err,util:util});
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
res.render('extension/edit.html', { title: '编辑系统分机',inst:inst,msg:err,util:util});
}
else{
console.log("修改成功："+o);
res.render('extension/edit.html', { title: '编辑系统分机',inst:inst,msg:null,util:util});
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
res.render('extension/detail.html', { title: '系统分机详细',inst:null,msg:err,util:util});
	}
else{
res.render('extension/detail.html', { title: '系统分机详细',inst:inst,msg:null,util:util});
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
			res.send({success:true,msg:"删除系统分机成功！"});	
		}
			
		});
	
	}
	
});
	
}