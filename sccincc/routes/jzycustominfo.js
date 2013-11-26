  var soap = require('soap');
  var fs = require('fs');
  var util = require('util');
  var wcfurl = 'http://localhost:8088/JzyService.svc?wsdl';

   //获取客户档案列表
  exports.get = function(req, res) {
  	var cunit = req.body["cunit"] || req.query["cunit"] || "";
  	var where={};
  	where.Vip_name='';
  	where.Card_id='';
  	where.Jbr='';
  	res.render('jzycustominfo/index.html', {
  					title: '客户档案列表',
  					where: where
  				});
  	
  }

  exports.post=function(req,res){
var where = {};
	var query = req.body;
	for (var key in query) {
		where[key] = query[key] || '';
	}
	res.render('jzycustominfo/index.html', {
		title: '客户档案列表',
		where: where
	});

  }
   //获取客户档案列表
  exports.getCustoms = function(req, res) {
  	var cunit = req.body["Vip_name"] || req.query["Vip_name"] || "";
  	var cardnum = req.body["Card_id"] || req.query["Card_id"] || "";
  	var jbr = req.body["Jbr"] || req.query["Jbr"] || "";
var jieguo = {};
                    jieguo.iTotalRecords = 10;
					jieguo.sEcho = req.query['sEcho'] || req.body['sEcho'];
					jieguo.iTotalDisplayRecords = 10;

soap.createClient(wcfurl, function(err, client) {
  		if (err) {
  			console.log("连接服务发生异常！", err);
  			res.send("连接服务发生异常！", util.inspect(err, null, null));
  		}

  		if (!client) {
  			console.log("无法正常连接服务！");
  			res.send("无法正常连接服务！");
  		}
  		client.getCustoms({
  			cunit: cunit,
  			cardnum: "",
  			jbr: ""
  		}, function(err, result, body) {
  			//client.getCustom({tel:"13699012676"},function(err, result,body){
  			if (err) {
  				console.log("getCustoms err", util.inspect(err, null, null));
  				res.send("getCustoms err:" + util.inspect(err, null, null));
  			} else {
  				console.log("getCustoms", result['getCustomsResult']);
  				
  				if (result['getCustomsResult'].CustomInfo)
  					jieguo.aaData = result['getCustomsResult'].CustomInfo;
  				else
  					jieguo.aaData = [];
  				res.send(jieguo);
  				
  			}


  		});

  	});


  }

