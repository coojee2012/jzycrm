var DbMode=require('../modules/ippbx/callsession_acts');

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



where['actid']='';
where['actid']='';




where['callsessionid']='';
where['callsessionid']='';




where['cdruniqueid']='';
where['cdruniqueid']='';




where['acttime_from']='';
where['acttime_to']='';




where['func_tion']='';
where['func_tion']='';




where['var0key']='';
where['var0key']='';




where['var0value']='';
where['var0value']='';




where['var1key']='';
where['var1key']='';




where['var1value']='';
where['var1value']='';




where['var2key']='';
where['var2key']='';




where['var2value']='';
where['var2value']='';




where['var3key']='';
where['var3key']='';




where['var3value']='';
where['var3value']='';




where['extradata']='';
where['extradata']='';


res.render('callsession_acts/index.html', { title: '呼叫动作记录列表',where:where});
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
res.render('callsession_acts/index.html', { title: '呼叫动作记录列表',where:where});	
};
/**
GET新建
**/
exports.createget=function(req,res){
console.log(DbMode.cloums);
var inst=null;
res.render('callsession_acts/create.html', { title: '新增呼叫动作记录',inst:inst,msg:null,util:util});
};
/**
POST新建
**/
exports.createpost=function(req,res){
	var callsession_acts_mod=new DbMode();
	for(var key in req.body){
		//console.log(key);
		if(DbMode['cloums'][key]!=null && DbMode['cloums'][key]['input']['type']==='password')
		{
		callsession_acts_mod[key]=md5.update(req.body[key]).digest('hex').toUpperCase(); 
		continue;
		}
		callsession_acts_mod[key]=req.body[key];
	}
	callsession_acts_mod.isValid(function (valid) {
	    if (!valid) {
	    	console.log(callsession_acts_mod.errors); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
	    	res.render('callsession_acts/create.html', { title: '新增呼叫动作记录',inst:callsession_acts_mod,msg:callsession_acts_mod.errors});
	    }else{
	    	
	    	callsession_acts_mod.save(function(err,inst){
	    		if(err){
	    			console.log(err);
	    			res.render('callsession_acts/create.html', { title: '新增呼叫动作记录',inst:inst,msg:err,util:util});
	    		}else{
	    		res.redirect('/callsession_acts'); 
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
res.render('callsession_acts/edit.html', { title: '编辑呼叫动作记录',inst:null,msg:err,util:util});
	}
else{
res.render('callsession_acts/edit.html', { title: '编辑呼叫动作记录',inst:inst,msg:null,util:util});
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
res.render('callsession_acts/edit.html', { title: '编辑呼叫动作记录',inst:null,msg:err,util:util});
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
res.render('callsession_acts/edit.html', { title: '编辑呼叫动作记录',inst:inst,msg:err,util:util});
}
else{
console.log("修改成功："+o);
res.render('callsession_acts/edit.html', { title: '编辑呼叫动作记录',inst:inst,msg:null,util:util});
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
res.render('callsession_acts/detail.html', { title: '呼叫动作记录详细',inst:null,msg:err,util:util});
	}
else{
res.render('callsession_acts/detail.html', { title: '呼叫动作记录详细',inst:inst,msg:null,util:util});
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
			res.send({success:true,msg:"删除呼叫动作记录成功！"});	
		}
			
		});
	
	}
	
});
	
}