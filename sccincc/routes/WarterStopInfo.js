var DbMode=require('../modules/crm/WarterStopInfo');
var fs = require('fs');  
var util=require('util');
var crypto=require('crypto');
var md5 = crypto.createHash('md5');
var moment = require('moment');
var syslog=require('../common/syslog');
//var formidable = require('formidable');
var inld=new Array();
for(var key in DbMode.relations){
	inld.push(key);
}
/**
GET获取列表
**/
exports.get = function(req, res){
var where={};



where['stopReson']='';
where['stopReson']='';




where['smsTell']='';
where['smsTell']='';




where['areaID']=-1;




where['isres']=-1;





res.render('WarterStopInfo/index.html', { title: '停水记录列表',where:where});
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
res.render('WarterStopInfo/index.html', { title: '停水记录列表',where:where});	
};
/**
GET新建
**/
exports.createget=function(req,res){
console.log(DbMode.cloums);
var inst=null;
res.render('WarterStopInfo/create.html', { title: '新增停水记录',inst:inst,msg:null,util:util});
};
/**
POST新建
**/
exports.createpost=function(req,res){
var WarterStopInfo_mod=new DbMode();

/**
var form = new formidable.IncomingForm();
    form.uploadDir = "tmp"
    form.parse(req, function(err, fields, files) {
    fs.rename(files.fileInput.path, 'tmp/n.png', function (err) {
       // if (err) throw err;
    	if(err) console.log(err);
    });
    });
**/
var obj = req.files.fileInput;  
var tmp_path = obj.path;  
var new_path = "./public/assounds/stopwater.wav";//+obj.name;  
//console.log("原路径："+tmp_path);  
fs.rename(tmp_path,new_path,function(err){  
    if(err){  
        //throw err;
        syslog.add(req,res,'fs',err);
        console.log(err);
		res.render('WarterStopInfo/create.html', { title: '新增停水记录',inst:null,msg:err,util:util});
    }
    
    else{
    
for(var key in req.body){
	if(key=='leaders')
		continue;
	if(key=='fileInput')
		continue;
	WarterStopInfo_mod[key]=req.body[key];
}
WarterStopInfo_mod.isValid(function (valid) {
    if (!valid) {
    	console.log(WarterStopInfo_mod.errors); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
    	res.render('WarterStopInfo/create.html', { title: '新增停水记录',inst:WarterStopInfo_mod,msg:WarterStopInfo_mod.errors});
    }else{
    	
    	WarterStopInfo_mod.save(function(err,inst){
    		if(err){
    			syslog.add(req,res,'sql',err);
    			console.log(err);
    			res.render('WarterStopInfo/create.html', { title: '新增停水记录',inst:inst,msg:err,util:util});
    		}else{
    		res.redirect('/WarterStopInfo'); 
    		}
    	});	
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
	syslog.add(req,res,'sql',err);
res.render('WarterStopInfo/edit.html', { title: '编辑停水记录',inst:null,msg:err,util:util});
	}
else{
res.render('WarterStopInfo/edit.html', { title: '编辑停水记录',inst:inst,msg:null,util:util});
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
syslog.add(req,res,'sql',err);
res.render('WarterStopInfo/edit.html', { title: '编辑停水记录',inst:null,msg:err,util:util});
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
console.log("修改错误："+o);
res.render('WarterStopInfo/edit.html', { title: '编辑停水记录',inst:inst,msg:err,util:util});
}
else{
console.log("修改成功："+o);

res.render('WarterStopInfo/edit.html', { title: '编辑停水记录',inst:inst,msg:null,util:util});
}
});

}
}
);

};

	/**
	恢复供水
	**/
	exports.huifu=function(req,res){
	console.log(req.query,req.body);
	var id=req.body.id || req.query.id;
	var new_path = "./public/assounds/stopwater.wav";//+obj.name;  
	fs.unlink(new_path,function(err){
		if(err){
			syslog.add(req,res,'fs',err);
			res.send({success:false,msg:"更新系统语音失败！"});	
			return;
		}
		DbMode.findOne({where:{id:id}}, function(err,inst){
			if(err){
				syslog.add(req,res,'sql',err);
				res.send({success:false,msg:"查询失败！"});	
				}
			else{
			if(inst!=null){
				inst.endTime=moment().format("YYYY-MM-DD HH:mm:ss");
				DbMode.updateOrCreate(inst,function(err,o){
					if(err){
						syslog.add(req,res,'sql',err);
						res.send({success:false,msg:"更新失败！"});	
						}
						else{
							
							res.send({success:true,msg:"恢复成功！"});		
							
						}
				});
			}
			else{
				res.send({success:false,msg:"没有找到改记录！"});	
			}
			}
			}
			);	
		
	});


	};
	
	
/**
GET详细
**/
exports.detail=function(req,res){
var id=req.query.id;
DbMode.findOne({where:{id:id}}, function(err,inst){
if(err){
	syslog.add(req,res,'sql',err);
res.render('WarterStopInfo/detail.html', { title: '停水记录详细',inst:null,msg:err,util:util});
	}
else{
res.render('WarterStopInfo/detail.html', { title: '停水记录详细',inst:inst,msg:null,util:util});
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
			res.send({success:true,msg:"删除停水记录成功！"});	
		}
			
		});
	
	}
	
});
	
}