var DbMode=require('../modules/ippbx/ivruserinput');

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



where['ivrnumber']='';
where['ivrnumber']='';








res.render('ivruserinput/index.html', { title: 'IVR输入列表',where:where});
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
res.render('ivruserinput/index.html', { title: 'IVR输入列表',where:where});	
};
/**
GET新建
**/
exports.createget=function(req,res){
console.log(DbMode.cloums);
var inst=null;
res.render('ivruserinput/create.html', { title: '新增IVR输入',inst:inst,msg:null,util:util});
};
/**
POST新建
**/
exports.createpost=function(req,res){
	var ivruserinput_mod=new DbMode();
	for(var key in req.body){
		//console.log(key);
		if(DbMode['cloums'][key]!=null && DbMode['cloums'][key]['input']['type']==='password')
		{
		ivruserinput_mod[key]=md5.update(req.body[key]).digest('hex').toUpperCase(); 
		continue;
		}
		ivruserinput_mod[key]=req.body[key];
	}
	ivruserinput_mod.isValid(function (valid) {
	    if (!valid) {
	    	console.log(ivruserinput_mod.errors); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
	    	res.render('ivruserinput/create.html', { title: '新增IVR输入',inst:ivruserinput_mod,msg:ivruserinput_mod.errors});
	    }else{
	    	
	    	ivruserinput_mod.save(function(err,inst){
	    		if(err){
	    			console.log(err);
	    			res.render('ivruserinput/create.html', { title: '新增IVR输入',inst:inst,msg:err,util:util});
	    		}else{
	    		res.redirect('/ivruserinput'); 
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
res.render('ivruserinput/edit.html', { title: '编辑IVR输入',inst:null,msg:err,util:util});
	}
else{
res.render('ivruserinput/edit.html', { title: '编辑IVR输入',inst:inst,msg:null,util:util});
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
res.render('ivruserinput/edit.html', { title: '编辑IVR输入',inst:null,msg:err,util:util});
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
res.render('ivruserinput/edit.html', { title: '编辑IVR输入',inst:inst,msg:err,util:util});
}
else{
console.log("修改成功："+o);
res.render('ivruserinput/edit.html', { title: '编辑IVR输入',inst:inst,msg:null,util:util});
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
res.render('ivruserinput/detail.html', { title: 'IVR输入详细',inst:null,msg:err,util:util});
	}
else{
res.render('ivruserinput/detail.html', { title: 'IVR输入详细',inst:inst,msg:null,util:util});
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
			res.send({success:true,msg:"删除IVR输入成功！"});	
		}
			
		});
	
	}
	
});
	
}