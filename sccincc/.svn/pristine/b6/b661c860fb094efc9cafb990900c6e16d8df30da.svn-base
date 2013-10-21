var DbMode=require('../modules/crm/ConsultRecords');
var util=require('util');
var crypto=require('crypto');
var md5 = crypto.createHash('md5');

var inld=new Array();
for(var key in DbMode.relations){
	inld.push(key);
}

exports.get = function(req, res){
	
	var where={};
	var cID=req.query['cID']||req.body['cID'];
	var srvManID=req.query['srvManID']||req.body['srvManID'];
	if(cID!=='')
	where.cID=cID;
	else
	where.cID=-1;
	if(srvManID!=='')
	where.srvManID=srvManID;
	else
	where.srvManID=-1;
	
	where['callUnitID']='';
	where['ctID']=-1;
	where['ctContent']='';
	where['ctContent']='';

	res.render('ConsultRecords/index.html', { title: '咨询记录列表',where:where});
};

exports.post=function(req,res){
	var where={};
	var query=req.body;
	for(var key in query){
		where[key]=query[key]||'';	
	}
	res.render('ConsultRecords/index.html', { title: '咨询记录列表',where:where});	
};

exports.createget=function(req,res){
	var unid=req.query['unid']||req.body['unid'];	
	var customid=req.query['customid']||req.body['customid'];

	var inst=new DbMode();
	inst.callUnitID=unid;
	inst.cID=customid;
	inst.ctContent='';
	inst.ansContent='';
	inst.srvManID=0;
	res.render('ConsultRecords/create.html', { title: '新增咨询记录',inst:inst,msg:null,util:util});
};

exports.createpost=function(req,res){
	var ConsultRecords_mod=new DbMode();
	for(var key in req.body){
		//console.log(key);
		if(DbMode['cloums'][key]!=null && DbMode['cloums'][key]['input']['type']==='password')
		{
			ConsultRecords_mod[key]=md5.update(req.body[key]).digest('hex').toUpperCase(); 
			continue;
		}
		ConsultRecords_mod[key]=req.body[key];
	}
	ConsultRecords_mod.isValid(function (valid) {
		if (!valid) {
			console.log(ConsultRecords_mod.errors); // hash of errors {attr:
			// [errmessage, errmessage,
			// ...], attr: ...}
			res.render('ConsultRecords/create.html', { title: '新增咨询记录',inst:ConsultRecords_mod,msg:ConsultRecords_mod.errors});
		}else{

			ConsultRecords_mod.save(function(err,inst){
				if(err){
					console.log(err);
					res.render('ConsultRecords/create.html', { title: '新增咨询记录',inst:inst,msg:err,util:util});
				}else{
					res.redirect('/ConsultRecords'); 
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
			res.render('ConsultRecords/edit.html', { title: '编辑咨询记录',inst:null,msg:err,util:util});
		}
		else{
			res.render('ConsultRecords/edit.html', { title: '编辑咨询记录',inst:inst,msg:null,util:util});
		}
	}
	);

};
//编辑POST
exports.editpost=function(req,res){
	var id=req.body["id"];
	DbMode.findOne({where:{id:id}}, function(err,inst){
		if(err){
			res.render('ConsultRecords/edit.html', { title: '编辑咨询记录',inst:null,msg:err,util:util});
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
					res.render('ConsultRecords/edit.html', { title: '编辑咨询记录',inst:inst,msg:err,util:util});
				}
				else{
					console.log("修改成功："+o);
					res.render('ConsultRecords/edit.html', { title: '编辑咨询记录',inst:inst,msg:null,util:util});
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
			res.render('ConsultRecords/detail.html', { title: '咨询记录详细',inst:null,msg:err,util:util});
		}
		else{
			res.render('ConsultRecords/detail.html', { title: '咨询记录详细',inst:inst,msg:null,util:util});
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
					res.send({success:true,msg:"删除咨询记录成功！"});	
				}

			});

		}

	});

}