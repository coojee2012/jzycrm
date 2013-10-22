var util=require('util');
var CustomInfo=require('../modules/crm/CustomInfo');

exports.get=function(req,res){
var callid=req.body['callid']||req.query['callid'];	
var unid=req.body['unid']||req.query['unid'];	
var caller=req.body['caller']||req.query['caller'];	
var called=req.body['called']||req.query['called'];	
var poptype=req.body['poptype']||req.query['poptype'];
var callmsg={};
callmsg.callid=callid;
callmsg.unid=unid;
callmsg.caller=caller;
callmsg.called=called;
callmsg.poptype=poptype;
console.log(callmsg);
try{

	CustomInfo.findOne({where:{phone:caller}},function(err,inst){
	if(err)
	{
	throw err;
	}
	if(inst==null)
	{
		inst=new CustomInfo();
		inst.phone=caller;
		inst.csex=0;
	}
	
	res.render('screenpop/index.html',{inst:inst,error:null,callmsg:callmsg});
	});	
}
catch(e){
	res.render('404',{});	
	}


}

exports.post=function(req,res){
var id=req.body['id']||	req.query['id'];

CustomInfo.findOne({where:{id:id}}, function(err,custom){

if(custom==null)
custom=new CustomInfo();
	
for(var key in req.body){	
	custom[key]=req.body[key];
}

custom.isValid(function (valid) {
	
    if (!valid) {
    	//console.log(custom); // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}
    	//res.render('screenpop/index.html',{inst:custom,error:custom.errors});
    	res.send({success:false,error:custom.errors});
    }else{
    	CustomInfo.updateOrCreate(custom,function(err,inst){
    		if(err){
    			console.log(err);
    			//res.render('screenpop/index.html', { title: '新增系统外线',inst:inst,error:err});
    			res.send({success:false,error:err});
    		}else{
    			//res.render('screenpop/index.html',{inst:inst,error:null});
    			//console.log(inst);
    			res.send({success:true,id:inst.id,error:null});
    		}	
    		
    	});
    
    }
});//结束验证
});//查询有无
}
