var util=require('util');
var EventProxy = require('eventproxy');


exports.get=function(req,res){
	var ep = new EventProxy();
	ep.all('gd', 'zx','ts','dx', function (gd, zx,ts,dx) {
		  // 在所有指定的事件触发后，将会被调用执行
		  // 参数对应各自的事件名
		  var tonum={gd:gd, zx:zx,ts:ts,dx:dx};
		  res.render('RemindReacords/index.html',{inst:tonum,error:null,callmsg:null});
		});
	
	
	var OrderRecords = require('../modules/crm/OrderRecords');
	OrderRecords.all({},function(err,dbs){
		var count=dbs.length;
		var notdo=0;
		for(var i=0;i<count;i++){
			if(dbs[i].OrderOptions==0)
				notdo++;
		}
		ep.emit('gd', {count:count,notdo:notdo});	
	});
	
	var ConsultRecords = require('../modules/crm/ConsultRecords');
	
	ConsultRecords.all({},function(err,dbs){
		var count=dbs.length;
		var notdo=0;
		for(var i=0;i<count;i++){
			if(dbs[i].isOver==0)
				notdo++;
		}
		ep.emit('zx', {count:count,notdo:notdo});	
	});
	
   var WarterStopInfo = require('../modules/crm/WarterStopInfo');
	
   WarterStopInfo.all({},function(err,dbs){
		var count=dbs.length;
		var notdo=0;
		for(var i=0;i<count;i++){
			if(dbs[i].isres==0)
				notdo++;
		}
		ep.emit('ts', {count:count,notdo:notdo});	
	});
	
   var Sms = require('../modules/crm/Sms');
	
   Sms.all({},function(err,dbs){
		var count=dbs.length;
		var notdo=0;
		for(var i=0;i<count;i++){
			if(dbs[i].sendState==0)
				notdo++;
		}
		ep.emit('dx', {count:count,notdo:notdo});	
	});
   
	
	
		
}

exports.post=function(req,res){
	res.render('RemindReacords/index.html',{inst:null,error:null,callmsg:null});	
}

