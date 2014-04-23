 var conf = require('node-conf').load("common");
 var soap = require("soap");

 exports.get = function(req, res) {
 	var where = {};
 	where['in0'] = '';
 	where['in1'] = '';
 	res.render('fzcustominfo/index.html', {
 		title: '发展用户列表',
 		where: where
 	});
 };
 exports.post = function(req, res) {
 	var where = {};
 	var query = req.body;
 	for (var key in query) {
 		where[key] = query[key] || '';
 	}
 	res.render('fzcustominfo/index.html', {
 		title: '发展用户列表',
 		where: where
 	});
 };

 exports.getwx = function(req, res) {
 	var where = {};
 	where['in0'] = '';
 	where['in1'] = '';
 	where['in2'] = '';
 	where['in3'] = '';
 	res.render('fzcustominfo/wx.html', {
 		title: '正式用户列表',
 		where: where
 	});
 };

 exports.postwx = function(req, res) {
 	var where = {};
 	var query = req.body;
 	for (var key in query) {
 		where[key] = query[key] || '';
 	}
 	res.render('fzcustominfo/wx.html', {
 		title: '正式用户列表',
 		where: where
 	});
 };
//发展子系统信息查询
 exports.getList = function(req, res) {
 	var in0 = req.body.in0 || "";
 	var in1 = req.body.in1 || "";
 	var output = {};
 	output.aaData = [];
 	output.sEcho = "";
 	output.iTotalRecords = 0;
 	output.iTotalDisplayRecords = 0;
 	soap.createClient(conf.wcfurl, function(err, client) {
 		if (err || !client) {
 			console.log('无法访问远程服务！');
 			output.sEcho = "无法访问远程服务！";
 			res.send(output);
 		} else {
 			client.getList({
 				in0: in0,
 				in1: in1
 			}, function(err, result, body) {
 				/*res.set('Content-Type', 'text/xml');
 			res.send(body); 
 			console.log(body);*/
 				if (result && result.out !== null && result.out.Usefz && result.out.Usefz.length > 0) {
 					output.aaData = result.out.Usefz;
 					output.sEcho = "查询成功！";
 					output.iTotalRecords = result.out.Usefz.length;
 					output.iTotalDisplayRecords = result.out.Usefz.length;
 					res.send(output);
 				} else {
 					output.sEcho = "查询成功！";
 					res.send(output);
 				}

 			});
 		}

 	});

 }
//用水信息查询
 exports.getAll = function(req, res) {
 	var in0 = req.body.in0 || "";
 	var in1 = req.body.in1 || "";
 	var in2 = req.body.in2 || "2001-01";
 	var in3 = req.body.in3 || "2099-12";
 	var output = {};
 	output.aaData = [];
 	output.iTotalRecords = 0;
 	output.iTotalDisplayRecords = 0;
 	output.sEcho = "";
 	soap.createClient(conf.wcfurl, function(err, client) {
 		if (err || !client) {
 			console.log('无法访问远程服务！');
 			output.sEcho = "无法访问远程服务！";
 			res.send(output);
 		} else {
 			client.getAll({
 				in0: in0,
 				in1: in1,
 				in2: in2,
 				in3: in3
 			}, function(err, result, body) {
 				//console.log(result);
 				/*res.set('Content-Type', 'text/xml');
 			res.send(body); 
 			console.log(body);*/

 				if (result && result.out !== null && result.out.Rxwx && result.out.Rxwx.length > 0) {
 					output.aaData = result.out.Rxwx;
 					output.sEcho = "查询成功！";
 					output.iTotalRecords = result.out.Rxwx.length;
 					output.iTotalDisplayRecords = result.out.Rxwx.length;
 					res.send(output);
 				} else {
 					output.sEcho = "查询成功！";
 					res.send(output);
 				}

 			});
 		}

 	});
 }
 exports.getyh = function(req, res) {
 	var where = {};
 	where['in0'] = '';
 	where['in1'] = '';
 	where['in2'] = '';
 	where['in3'] = '';
 	where['in4'] = '';
 	res.render('fzcustominfo/yh.html', {
 		title: '正式用户列表',
 		where: where
 	});
 };

 exports.postyh = function(req, res) {
 	var where = {};
 	var query = req.body;
 	for (var key in query) {
 		where[key] = query[key] || '';
 	}
 	res.render('fzcustominfo/yh.html', {
 		title: '正式用户列表',
 		where: where
 	});
 };
//正式用户信息
 exports.getRxws = function(req, res) {
 	var in0 = req.body.in0 || ""; //户号
 	var in1 = req.body.in1 || ""; //户名
 	var in2 = req.body.in2 || ""; //表号
 	var in3 = req.body.in3 || ""; //联系地址	
 	var in4 = req.body.in4 || "1270093324"; //联系方式
 	var output = {};
 	output.aaData = [];
 	output.iTotalRecords = 0;
 	output.iTotalDisplayRecords = 0;
 	output.sEcho = "";
 	soap.createClient(conf.wcfurl, function(err, client) {
 		if (err || !client) {
 			console.log('无法访问远程服务！');
 			output.sEcho = "无法访问远程服务！";
 			res.send(output);
 		} else {
 			client.getRxws({
 				in0: in0,
 				in1: in1,
 				in2: in2,
 				in3: in3,
 				in4: in4
 			}, function(err, result, body) {
 				console.log(result);
 				/*res.set('Content-Type', 'text/xml');
 			res.send(body); 
 			console.log(body);*/

 				if (result && result.out !== null && result.out.Rxwx && result.out.Rxwx.length > 0) {
 					output.aaData = result.out.Rxwx;
 					output.sEcho = "查询成功！";
 					output.iTotalRecords = result.out.Rxwx.length;
 					output.iTotalDisplayRecords = result.out.Rxwx.length;
 					res.send(output);
 				} else {
 					output.sEcho = "查询成功！";
 					res.send(output);
 				}

 			});
 		}

 	});
 }