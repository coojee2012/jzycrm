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
	var where="";
	if(req.session.roleid == 8 )//派单部门只能看到自己部门的
        where+=" and DepID="+req.session.deptid;
		
	OrderRecords.query("select count(1) as cnt from OrderRecords where 1=1 and OrderOptions=0 "+where+";",function(err,dbs){
		var notdo=dbs[0].cnt;
        OrderRecords.query("select count(1) as cnt from OrderRecords where 1=1 "+where+";",function(err,dbs){
         var count= dbs[0].cnt;
         ep.emit('gd', {count:count,notdo:notdo});
        });

	});
	
	var ConsultRecords = require('../modules/crm/ConsultRecords');
	
	ConsultRecords.query("select count(1) as cnt from ConsultRecords where isOver=0;",function(err,dbs){
		var notdo = dbs[0].cnt;
        ConsultRecords.query("select count(1) as cnt from ConsultRecords;",function(err,dbs){
            var count= dbs[0].cnt;
            ep.emit('zx', {count:count,notdo:notdo});
        });

	});
	
   var WarterStopInfo = require('../modules/crm/WarterStopInfo');
	
   WarterStopInfo.query("select count(1) as cnt from WarterStopInfo where isres=0;",function(err,dbs){
       var notdo = dbs[0].cnt;
       WarterStopInfo.query("select count(1) as cnt from WarterStopInfo",function(err,dbs){
           var count= dbs[0].cnt;
           ep.emit('ts', {count:count,notdo:notdo});
       });

	});
	
   var Sms = require('../modules/crm/Sms');
	
   Sms.query("select count(1) as cnt from Sms where sendState=0;",function(err,dbs){
       var notdo = dbs[0].cnt;
       Sms.query("select count(1) as cnt from Sms;",function(err,dbs){
           var count= dbs[0].cnt;
           ep.emit('dx', {count:count,notdo:notdo});
       });

	});
   
	
	
		
}
exports.jsonget=function(req,res){
    var ep = new EventProxy();
  ep.all('gd', function (gd) {
      // 在所有指定的事件触发后，将会被调用执行
      // 参数对应各自的事件名
      var tonum={gd:gd};
      res.send({success:true,inst:tonum,error:null,callmsg:null});
    });

  var OrderRecords = require('../modules/crm/OrderRecords');
	var where="";
	if(req.session.roleid == 8 )//派单部门只能看到自己部门的
    where+=" and DepID="+req.session.deptid;

    var notdo=0;
    var waitdo=0;
    var harddo=0;

	OrderRecords.query("select count(1) as cnt from OrderRecords where 1=1 and OrderOptions=0  "+where+";",function(err,dbs){
        notdo=dbs[0].cnt;
        OrderRecords.query("select count(1) as cnt from OrderRecords where 1=1 and OrderOptions=1  "+where+";",function(err,dbs){
            waitdo= dbs[0].cnt;
            OrderRecords.query("select count(1) as cnt from OrderRecords where 1=1 and OrderOptions=2  "+where+";",function(err,dbs){
                harddo=  dbs[0].cnt;
                ep.emit('gd', {notdo:notdo,waitdo:waitdo,harddo:harddo});
            });
        });


	});

    }

exports.post=function(req,res){
	res.render('RemindReacords/index.html',{inst:null,error:null,callmsg:null});	
}

