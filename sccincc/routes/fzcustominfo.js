 var conf = require('node-conf').load("common");
 var soap = require("soap");

 exports.get = function(req, res) {
 	var in0 = req.query.in0 || "";
 	var in1 = req.query.in1 || "";
 	soap.createClient(conf.wcfurl, function(err, client) {
 		client.getList({
 			in0: in0,
 			in1: in1
 		}, function(err, result,body) {
 			res.set('Content-Type', 'text/xml');
 			res.send(body); 
 			console.log(body);
 			/*if (result && result.out !== null && result.out.Usefz && result.out.Usefz.length > 0) {
 				res.send(result.out.Usefz);
 			} else {
 				res.send([]);
 			}*/

 		});
 	});

 }

 exports.getAll = function(req, res) {
 	var in0 = req.query.in0 || "";
 	var in1 = req.query.in1 || "";
 	var in2 = req.query.in2 || "2001-01";
 	var in3 = req.query.in3 || "2014-04";
 	soap.createClient(conf.wcfurl, function(err, client) {
 		client.getAll({
 			in0: in0,
 			in1: in1,
 			in2: in2,
 			in3: in3
 		}, function(err, result) {
 			console.log(result);
 			if (result && result.out !== null && result.out.Rxwx && result.out.Rxwx.length > 0) {
 				res.send(result.out.Rxwx);
 			} else {
 				res.send(result);
 			}

 		});
 	});
 }