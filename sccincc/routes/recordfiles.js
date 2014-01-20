var DbMode=require('../modules/ippbx/recordfiles');

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








where['cretime_from']='';
where['cretime_to']='';




where['extennum']='';
where['extennum']='';


var UserInfo = require('../modules/crm/UserInfo.js');
	var agents = {};
	UserInfo.all({
		where: {
			isAgent: 1
		}
	}, function(err, dbs) {
		for (var i = 0; i < dbs.length; i++) {
			agents[dbs[i].uExten] = dbs[i].uName;
		}
		res.render('recordfiles/index.html', { title: '录音记录列表',agents:util.inspect(agents),where:where});
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

var UserInfo = require('../modules/crm/UserInfo.js');
	var agents = {};
	UserInfo.all({
		where: {
			isAgent: 1
		}
	}, function(err, dbs) {
		for (var i = 0; i < dbs.length; i++) {
			agents[dbs[i].uExten] = dbs[i].uName;
		}
		res.render('recordfiles/index.html', { title: '录音记录列表',agents:util.inspect(agents),where:where});
	});
};
/**
GET新建
**/
exports.createget=function(req,res){
console.log(DbMode.cloums);
var inst=null;
res.render('recordfiles/create.html', { title: '新增录音记录',inst:inst,msg:null,util:util});
};
/**
POST新建
**/
exports.createpost=function(req,res){
	var recordfiles_mod=new DbMode();
	for(var key in req.body){
		//console.log(key);
		if(DbMode['cloums'][key]!=null && DbMode['cloums'][key]['input']['type']==='password')
		{
		recordfiles_mod[key]=md5.update(req.body[key]).digest('hex').toUpperCase(); 
		continue;
		}
		recordfiles_mod[key]=req.body[key];
	}
	recordfiles_mod.isValid(function (valid) {
	    if (!valid) {
	    	console.log(recordfiles_mod.errors); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
	    	res.render('recordfiles/create.html', { title: '新增录音记录',inst:recordfiles_mod,msg:recordfiles_mod.errors});
	    }else{
	    	
	    	recordfiles_mod.save(function(err,inst){
	    		if(err){
	    			console.log(err);
	    			res.render('recordfiles/create.html', { title: '新增录音记录',inst:inst,msg:err,util:util});
	    		}else{
	    		res.redirect('/recordfiles'); 
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
res.render('recordfiles/edit.html', { title: '编辑录音记录',inst:null,msg:err,util:util});
	}
else{
res.render('recordfiles/edit.html', { title: '编辑录音记录',inst:inst,msg:null,util:util});
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
res.render('recordfiles/edit.html', { title: '编辑录音记录',inst:null,msg:err,util:util});
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
res.render('recordfiles/edit.html', { title: '编辑录音记录',inst:inst,msg:err,util:util});
}
else{
console.log("修改成功："+o);
res.render('recordfiles/edit.html', { title: '编辑录音记录',inst:inst,msg:null,util:util});
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
res.render('recordfiles/detail.html', { title: '录音记录详细',inst:null,msg:err,util:util});
	}
else{
res.render('recordfiles/detail.html', { title: '录音记录详细',inst:inst,msg:null,util:util});
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
			res.send({success:true,msg:"删除录音记录成功！"});	
		}
			
		});
	
	}
	
});
	
}