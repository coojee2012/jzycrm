 var conf = require('node-conf').load("common");
 var soap=require("soap");
 
 exports.get = function(req, res) {
 var in0=req.query.in0 || "" ;
 var in1=req.query.in1 || "" ;
 soap.createClient(conf.wcfurl, function(err, client) {
 client.getList({in0:in0,in1:in1},function(err,result){
 	if(result && result.out!==null && result.out.Usefz && result.out.Usefz.length>0){
res.send(result.out.Usefz);
 	}else{
 	res.send([]);	
 	}
  
  });
 });

 }
