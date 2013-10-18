var DbMode=require('../modules/crm/Faq');

var util=require('util');
var crypto=require('crypto');
var md5 = crypto.createHash('md5');

var serverfn={};
for(var cl in DbMode.cloums){
	var inputype=DbMode.cloums[cl].input.type;
	if(inputype=='radios'||inputype=='selects'||inputype=='checkboxes'){
	var tmp=DbMode.cloums[cl][inputype];
	console.log(tmp);
	createfn(cl,tmp);
	}
	
}
var inld=new Array();
for(var key in DbMode.relations){
	inld.push(key);
}

function createfn(cl,tmp){
	serverfn["get_"+cl]=function(value){
		
		
		for(var tmtm in tmp){
			if(tmp[tmtm].value==value){
		return tmp[tmtm].name;
				}
		}
		}	
}




exports.get = function(req, res){
var where={};
var faqCodeId=req.query['faqCodeId']||-1;


where['titile']='';
where['titile']='';





where['faqCodeId']=faqCodeId;


res.render('Faq/index.html', { title: '知识库列表',items:null,serverfn:serverfn,where:where});
};

exports.post=function(req,res){
var where={};
var query=req.body;
for(var key in query){
where[key]=query[key]||'';	
}
res.render('Faq/index.html', { title: '知识库列表',items:null,serverfn:serverfn,where:where});	
};

exports.createget=function(req,res){
console.log(DbMode.cloums);
var inst=null;
res.render('Faq/create.html', { title: '新增知识库',inst:inst,msg:null,util:util});
};

exports.createpost=function(req,res){
	var Faq_mod=new DbMode();
	for(var key in req.body){
		//console.log(key);
		if(DbMode['cloums'][key]!=null && DbMode['cloums'][key]['input']['type']==='password')
		{
		Faq_mod[key]=md5.update(req.body[key]).digest('hex').toUpperCase(); 
		continue;
		}
		Faq_mod[key]=req.body[key];
	}
	Faq_mod.isValid(function (valid) {
	    if (!valid) {
	    	console.log(Faq_mod.errors); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
	    	res.render('Faq/create.html', { title: '新增知识库',inst:Faq_mod,msg:Faq_mod.errors});
	    }else{
	    	
	    	Faq_mod.save(function(err,inst){
	    		if(err){
	    			console.log(err);
	    			res.render('Faq/create.html', { title: '新增知识库',inst:inst,msg:err,util:util});
	    		}else{
	    		res.redirect('/Faq'); 
	    		}
	    	});	
	    }
	});

}

//编辑GET
exports.editget=function(req,res){
console.log(req.query);
var id=req.query.id;
DbMode.findOne({where:{id:id}}, function(err,inst){
if(err){
res.render('Faq/edit.html', { title: '编辑知识库',inst:null,msg:err,util:util});
	}
else{
res.render('Faq/edit.html', { title: '编辑知识库',inst:inst,msg:null,util:util});
}
}
);

};
//编辑POST
exports.editpost=function(req,res){
var id=req.body["id"];
DbMode.findOne({where:{id:id}}, function(err,inst){
if(err){
res.render('Faq/edit.html', { title: '编辑知识库',inst:null,msg:err,util:util});
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
res.render('Faq/edit.html', { title: '编辑知识库',inst:inst,msg:err,util:util});
}
else{
console.log("修改成功："+o);
res.render('Faq/edit.html', { title: '编辑知识库',inst:inst,msg:null,util:util});
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
res.render('Faq/detail.html', { title: '知识库详细',inst:null,msg:err,util:util});
	}
else{
res.render('Faq/detail.html', { title: '知识库详细',inst:inst,msg:null,util:util});
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
		console.log(res);
		inst.destroy(function(err){
		if(err){console.log(err);}
		else{
			res.send({success:true,msg:"删除知识库成功！"});	
		}
			
		});
	
	}
	
});
	
}