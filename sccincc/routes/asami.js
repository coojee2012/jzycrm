var nami=require('../asterisk/asmanager').nami
,util=require('util')
, AsAction=require("nami").Actions;

exports.sippeers=function(req, res){
	nami.send(new AsAction.SipPeers(),function(response){
		console.log(response);
		//res.render('nami/index', { title: 'NAMI测试',response:util.inspect(response,true,null) });
		res.send(response);
		
	});	
}

exports.ping=function(req, res){
	nami.send(new AsAction.Ping(),function(response){
		console.log(response);
		//res.render('nami/index', { title: 'NAMI测试',response:util.inspect(response,true,null) });
		res.send(response);
		
	});	
}

exports.hangup=function(req, res){
	var action=new AsAction.Hangup();
	    action.Channel='sip/abcd';
	nami.send(action,function(response){
		console.log(response);
		//res.render('nami/index', { title: 'NAMI测试',response:util.inspect(response,true,null) });
		res.send(response);
		
	});	
}

exports.status=function(req, res){
	var action=new AsAction.Status();
	//Status.Channel='sip/abcd';
	nami.send(action,function(response){
		console.log(response);
		//res.render('nami/index', { title: 'NAMI测试',response:util.inspect(response,true,null) });
		res.send(response);
		
	});	
}

exports.command=function(req, res){
	var cmd=req.body['cmd']||req.query['cmd'];
	var action=new AsAction.Command();
	action.Command=cmd;
	nami.send(action,function(response){
		console.log(response);
		//res.render('nami/index', { title: 'NAMI测试',response:util.inspect(response,true,null) });
		res.send(response);
		
	});	
}

exports.extensionstate=function(req, res){
	var exten=req.body['exten']||req.query['exten'];
	var context=req.body['context']||req.query['context'];
	var action=new AsAction.ExtensionState();
	action.Exten=exten;
	action.Context=context
	nami.send(action,function(response){
		console.log(response);
		//res.render('nami/index', { title: 'NAMI测试',response:util.inspect(response,true,null) });
		res.send(response);
		
	});	
}

exports.getconfig=function(req, res){
	var filename=req.body['filename']||req.query['filename'];
	var category=req.body['category']||req.query['category'];
	var action=new AsAction.GetConfig();
	action.Filename=filename;
	action.Category=category
	nami.send(action,function(response){
		console.log(response);
		//res.render('nami/index', { title: 'NAMI测试',response:util.inspect(response,true,null) });
		res.send(response);
		
	});	
}

exports.createconfig=function(req, res){
	var filename=req.body['filename']||req.query['filename'];
	var action=new AsAction.CreateConfig();
	action.Filename=filename;
	
	nami.send(action,function(response){
		console.log(response);
		//res.render('nami/index', { title: 'NAMI测试',response:util.inspect(response,true,null) });
		res.send(response);
		
	});	
}

exports.getconfigjson=function(req, res){
	var filename=req.body['filename']||req.query['filename'];
	var action=new AsAction.GetConfigJson();
	action.Filename=filename;
	
	nami.send(action,function(response){
		console.log(response);
		//res.render('nami/index', { title: 'NAMI测试',response:util.inspect(response,true,null) });
		res.send(response);
		
	});	
}

exports.coreshowchannels=function(req, res){
	var action=new AsAction.CoreShowChannels();
	nami.send(action,function(response){
		console.log(response);
		//res.render('nami/index', { title: 'NAMI测试',response:util.inspect(response,true,null) });
		res.send(response);
		
	});	
}

exports.hangupexten=function(req, res){
	var exten=req.body['exten']||req.query['exten'];
	var type=req.body['type']||req.query['type'];
	if(!type){
		type='SIP';
	}
	getconnectchannel(type,exten,function(channels){
		console.log(channels);
		var action=new AsAction.Hangup();
		    action.Channel=channels.src;
		nami.send(action,function(response){
			res.send(response);			
		});						
	});	
}

exports.transfer=function(req,res){
	var extenfrom=req.body['extenfrom']||req.query['extenfrom'];
	var extento=req.body['extento']||req.query['extento'];
	var fromtype=req.body['fromtype']||req.query['fromtype'];
	if(!fromtype){
		fromtype='SIP';
	}
	
	getconnectchannel(fromtype,extenfrom,function(channels){
	var action=new AsAction.Redirect();
	 action.Channel=channels.src;
	 action.Exten=extento;
	 action.Context='from-exten-sip';
	 nami.send(action,function(response){
			res.send(response);			
		});	
	});
	
}
/**
* Originate Action
* @constructor
* @see Action(String)
* @see See <a href="https://wiki.asterisk.org/wiki/display/AST/ManagerAction_Originate">https://wiki.asterisk.org/wiki/display/AST/ManagerAction_Originate</a>.
* @property {String} Channel Channel
* @property {String} Exten Exten
* @property {String} Priority Priority
* @property {String} Application Application
* @property {String} Data Data
* @property {String} Timeout Timeout
* @property {String} CallerID CallerID
* @property {String} Account Account
* @property {String} Async Async
* @property {String} Codecs Codecs
* @augments Action
*/
exports.dialout=function(req,res){
var variable=req.body['variable']||req.query['variable'];
var outnumber=req.body['outnumber']||req.query['outnumber'];
var exten=req.body['exten']||req.query['exten'];

var Variable="CHANNEL(language)=cn,FRI2_OUTGOING_MEMBERID=1,POPTYPE="+variable;	
var channel="LOCAL/"+outnumber+"@sub-outgoing";
var Context='sub-outgoing-callback';
//var Context='app-exten';
var action=new AsAction.Originate();
action.Channel=channel;
//action.Timeout=30;
action.Async=true;
action.Account = exten;
action.CallerID=exten;
action.Context = Context;
action.Exten = exten;
console.log(action);
if(nami.connected){
nami.send(action,function(response){
	res.send(response);			
});	
}
else{
	res.send({Response:'NotConnected'});	
	
}
	
}

exports.packCall=function(req,res){
	var exten=req.body['exten']||req.query['exten'];
	var type=req.body['type']||req.query['type'];
	if(!type){
		type='SIP';
	}
	var timeout=req.body['timeout']||req.query['timeout'];
	getconnectchannel(type,exten,function(channels){
		console.log(channels);
		var action=new AsAction.Park();
		    action.Channel2=channels.src;
		    action.Channel=channels.dst;
		    action.Timeout=120000;
		nami.send(action,function(response){
			res.send(response);			
		});						
	});
}

exports.unPark=function(req,res){
	var exten=req.body['exten']||req.query['exten'];
	var type=req.body['type']||req.query['type'];
	if(!type){
		type='SIP';
	}
	parkCalls(function(response){
	if(response.Response==='Success'||response.response==='Success'){
		
	if(response.events!=null && response.events.length>0){
		for(var ii=0;ii<response.events.length;ii++){
		var fromexten=response.events[ii].from;
		var re = new RegExp(type+"/"+exten,"g");
		if(fromexten.match(re)){
		var channel=response.events[ii].channel;
		var action=new AsAction.Redirect();
		 action.Channel=channel;
		 action.Exten=exten;
		 action.Context='app-exten';
		 nami.send(action,function(response){
				res.send(response);			
			});	
		 break;
		}
		}
		
	}
	else{
		res.send({response:'Error',Msg:'当前没有被保持的通话！'});	
	}	
		
	}
	else{
	res.send(response);	
	}	
	});	
}

exports.checkService=function(req,res){
	var exten=req.body['exten']||req.query['exten'];
	var type=req.body['type']||req.query['type'];
	if(!type){
		type='SIP';
	}
	getconnectchannel(type,exten,function(channels){
		var action=new AsAction.Redirect();
		 action.Channel=channels.src;
		 action.Exten=exten;
		 action.Context='checkservice';
		 nami.send(action,function(response){
				res.send(response);			
			});	
		});	
	
}

/*exports.GetCallInfo=function(req,res){
	var exten=req.body['fromexten']||req.query['fromexten'];
	if(exten==null||exten==''){
		res.send({success:'0'});
	}
	else{
	var calleventDB=require('../modules/ippbx/callevent.js');	
	calleventDB.findOne({where:{extensionnumber:exten}},function(err,inst){
		if(err || inst==null)
			res.send({success:'0'});
		else{
			var resjson={};
			if (inst.status == "waite")
            {
                
                resjson.success=1;
                if (inst.routerdype == "2")
                {
                  
                    resjson.caller=inst.callednumber;
                    resjson.called=inst.callernumber;
                }
                else
                {
                	resjson.caller=inst.callernumber;
                    resjson.called=inst.callednumber;
                }
                
              
                resjson.unid=inst.uid;
                resjson.poptype=inst.poptype;
                resjson.callid=inst.callid;

                inst.status = "over";
                inst.poptype = "";
                calleventDB.updateOrCreate(inst,function(err,inst2){
                	if(err)
                		res.send({success:'0'});
                	else{
                		res.send(resjson);
                	}
                });

            }
            else
            {
            	res.send({success:'0'});
            }
		}
	});
	}
	
}*/

exports.GetCallInfo=function(req,res){
	
	var calleventDB=require('../modules/ippbx/callevent.js');	
	calleventDB.findOne({where:{status:'waite'}},function(err,inst){
		if(err || inst==null)
			res.send({success:'0'});
		else{
			var resjson={};
			if (inst.status == "waite")
            {
                
                resjson.success=1;
                if (inst.routerdype == "2")
                {
                  
                    resjson.caller=inst.callednumber;
                    resjson.called=inst.callernumber;
                }
                else
                {
                	resjson.caller=inst.callernumber;
                    resjson.called=inst.callednumber;
                }
                
              
                resjson.unid=inst.uid;
                resjson.poptype=inst.poptype;
                resjson.callid=inst.callid;

                inst.status = "over";
                inst.poptype = "";
                calleventDB.updateOrCreate(inst,function(err,inst2){
                	if(err)
                		res.send({success:'0'});
                	else{
                		res.send(resjson);
                	}
                });

            }
            else
            {
            	res.send({success:'0'});
            }
		}

	});
	
	
}

/*exports.GetCallInfo=function(req,res){

	var calleventDB=require('../modules/ippbx/callevent.js');	
	calleventDB.all({},function(err,insts){
		
			for (var i = 0; i < insts.length; i++) {
			var resjson={};
			var inst=insts[i];
			if (inst.status == "waite")
            {
                
                resjson.success=1;
                if (inst.routerdype == "2")
                {
                  
                    resjson.caller=inst.callednumber;
                    resjson.called=inst.callernumber;
                }
                else
                {
                	resjson.caller=inst.callernumber;
                    resjson.called=inst.callednumber;
                }
                
              
                resjson.unid=inst.uid;
                resjson.poptype=inst.poptype;
                resjson.callid=inst.callid;

                inst.status = "over";
                inst.poptype = "";
                calleventDB.updateOrCreate(inst,function(err,inst2){
                	if(err)
                		res.send({success:'0',msg:err});
                	else{
                		res.send(resjson);

                	}
                });

            }
            else
            {
            	res.send({success:'0',msg:'no calls'});
            }
		}
	
	});
	
	
}*/


exports.DadOn=function(req,res){
	var exten=req.body['exten']||req.query['exten'];
	var type=req.body['type']||req.query['type'];
	var extDB=require('../modules/ippbx/extension.js');
	
	try{
	extDB.all({where:{accountcode:exten}},function(err,dbs){
		if(err){
			res.send({Response:'Error',Msg:'获取分机号失败!'});	
			return;
		}
		console.log(dbs);
	  if(dbs!=null){
		var ext=dbs[0];
		if(ext.dndinfo==='on')
		{
		ext.dndinfo='off';
		}
		else{
			ext.dndinfo='on';	
		}
		extDB.updateOrCreate(ext,function(err,inst){
		if(err){
			res.send({Response:'Error',Msg:'更新状态失败!'});		
		}
		else{
			res.send({Response:'Success',Msg:'操作成功!'});	
			
		}
		});	
	}else{
		
		res.send({Response:'Error',Msg:'没有找到分机号,'+exten});		
	}	
		
	});
	}
	catch(e){
		res.send({Response:'Error',Msg:e});	
	}
	
}

function parkCalls(cb){
	var action=new AsAction.ParkedCalls();
nami.send(action,function(response){
	cb(response);			
});		
}

function getconnectchannel(type,exten,cb){
	var src='';
	var dst='';
	var result={src:src,dst:dst};
	//var re = eval('/'+exten+'/g');
	var  parent="^"+type+'\\/'+exten;
	
	var  re = new RegExp(parent,"gi");
	console.log(re);
	var action=new AsAction.CoreShowChannels();
    nami.send(action,function(response){
    if(response.response=='Success'){
    
	for(var i in response.events ){	
		//console.log("测试：");
		//console.log(response.events[i]);
		if(re.exec(response.events[i].channel) || response.events[i].accountcode==exten)
		{
			src=response.events[i].channel;
			dst=response.events[i].bridgedchannel;
			break;
		}
		}
    }
    
     cb({src:src,dst:dst});
	});
	

}






