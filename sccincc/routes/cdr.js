var DbMode=require('../modules/ippbx/cdr');

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

















res.render('cdr/index.html', { title: '通话记录列表',where:where});
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
res.render('cdr/index.html', { title: '通话记录列表',where:where});	
};

exports.backupdb=function(req,res){
    var fs=require('fs');
    fs.readdir('./public/dbbackups',function(err,files){

        if(err){
            res.send(err);
        }
        else{
            var filenames={};
            var dates=[];
            for(var i=0;i<files.length;i++){
                if(/^callcenter(\d+)\.gz/.test(files[i])){
                    dates.push(RegExp.$1);
                    filenames[RegExp.$1]=files[i];
                }

            }
            dates.sort(function(a,b){
                return a<b?1:-1;
            });
            res.render('cdr/backup.html', { files: filenames,dates:dates});
        }

    });

}
/**
GET新建
**/
exports.createget=function(req,res){
console.log(DbMode.cloums);
var inst=null;
res.render('cdr/create.html', { title: '新增通话记录',inst:inst,msg:null,util:util});
};
/**
POST新建
**/
exports.createpost=function(req,res){
	var cdr_mod=new DbMode();
	for(var key in req.body){
		//console.log(key);
		if(DbMode['cloums'][key]!=null && DbMode['cloums'][key]['input']['type']==='password')
		{
		cdr_mod[key]=md5.update(req.body[key]).digest('hex').toUpperCase(); 
		continue;
		}
		cdr_mod[key]=req.body[key];
	}
	cdr_mod.isValid(function (valid) {
	    if (!valid) {
	    	console.log(cdr_mod.errors); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
	    	res.render('cdr/create.html', { title: '新增通话记录',inst:cdr_mod,msg:cdr_mod.errors});
	    }else{
	    	
	    	cdr_mod.save(function(err,inst){
	    		if(err){
	    			console.log(err);
	    			res.render('cdr/create.html', { title: '新增通话记录',inst:inst,msg:err,util:util});
	    		}else{
	    		res.redirect('/cdr'); 
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
res.render('cdr/edit.html', { title: '编辑通话记录',inst:null,msg:err,util:util});
	}
else{
res.render('cdr/edit.html', { title: '编辑通话记录',inst:inst,msg:null,util:util});
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
res.render('cdr/edit.html', { title: '编辑通话记录',inst:null,msg:err,util:util});
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
res.render('cdr/edit.html', { title: '编辑通话记录',inst:inst,msg:err,util:util});
}
else{
console.log("修改成功："+o);
res.render('cdr/edit.html', { title: '编辑通话记录',inst:inst,msg:null,util:util});
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
res.render('cdr/detail.html', { title: '通话记录详细',inst:null,msg:err,util:util});
	}
else{
res.render('cdr/detail.html', { title: '通话记录详细',inst:inst,msg:null,util:util});
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
			res.send({success:true,msg:"删除通话记录成功！"});	
		}
			
		});
	
	}
	
});
	
}