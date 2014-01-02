var util=require('util');
var EventProxy = require('eventproxy');
var soap = require('soap');
var fs = require('fs');
var wcfurl = 'http://127.0.0.1:8088/JzyService.svc?wsdl';


exports.get=function(req,res){
	var ep = new EventProxy();
	ep.all('gd', function (gd) {
		  // 在所有指定的事件触发后，将会被调用执行
		  // 参数对应各自的事件名
		  var tonum={gd:gd};
		  res.render('RemindReacords/index.html',{inst:tonum,error:null,callmsg:null});
		});
	
	
	
 soap.createClient(wcfurl, function(err, client) {
 	 var jieguo = {};

      if (err) {
        console.log("连接服务发生异常！", err);
        res.send("连接服务发生异常！", util.inspect(err, null, null));
      }

      if (!client) {
        console.log("无法正常连接服务！");
        res.send("无法正常连接服务！");
      } else {
        client.getCalls({
          keywords: '',
          card_id: '',
          dostate: -1,
          timefrom: '',
          timeto: ''

        }, function(err, result, body) {
          //client.getCustom({tel:"13699012676"},function(err, result,body){
          if (err) {
            console.log("getCalls err", util.inspect(err, null, null));
            res.send("getCalls err:" + util.inspect(err, null, null));
          } else {
            console.log("getCalls", result['getCallsResult']);
            if (Object.prototype.toString.call(result['getCallsResult'].CallRecords) === '[object Array]') {
              jieguo.aaData = result['getCallsResult'].CallRecords;
            } else if (result['getCallsResult'].CallRecords) {
              jieguo.aaData = [];
              jieguo.aaData.push(result['getCallsResult'].CallRecords);
            } else
              jieguo.aaData = [];

              var count=jieguo.aaData.length;
              var notdo=0;
              for(var i=0;i<jieguo.aaData.length;i++){
              	if(jieguo.aaData[i].DoState==0){
              		notdo+=1;
              	}

              }
              ep.emit('gd', {count:count,notdo:notdo});	
           

          }


        });
      }

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
  
  
  
 soap.createClient(wcfurl, function(err, client) {
   var jieguo = {};

      if (err) {
        console.log("连接服务发生异常！", err);
        res.send("连接服务发生异常！", util.inspect(err, null, null));
      }

      if (!client) {
        console.log("无法正常连接服务！");
        res.send("无法正常连接服务！");
      } else {
        client.getCalls({
          keywords: '',
          card_id: '',
          dostate: -1,
          timefrom: '',
          timeto: ''

        }, function(err, result, body) {
          //client.getCustom({tel:"13699012676"},function(err, result,body){
          if (err) {
            console.log("getCalls err", util.inspect(err, null, null));
            res.send("getCalls err:" + util.inspect(err, null, null));
          } else {
            console.log("getCalls", result['getCallsResult']);
            if (Object.prototype.toString.call(result['getCallsResult'].CallRecords) === '[object Array]') {
              jieguo.aaData = result['getCallsResult'].CallRecords;
            } else if (result['getCallsResult'].CallRecords) {
              jieguo.aaData = [];
              jieguo.aaData.push(result['getCallsResult'].CallRecords);
            } else
              jieguo.aaData = [];

              var count=jieguo.aaData.length;
              var notdo=0;
              var waitdo=0;
              for(var i=0;i<jieguo.aaData.length;i++){
                if(jieguo.aaData[i].DoState==0){
                  notdo+=1;
                }
                if(jieguo.aaData[i].DoState==1){
                  waitdo+=1;
                }

              }
              ep.emit('gd', {count:count,notdo:notdo,waitdo:waitdo}); 
           

          }


        });
      }

    }); 

}



exports.post=function(req,res){
	res.render('RemindReacords/index.html',{inst:null,error:null,callmsg:null});	
}

