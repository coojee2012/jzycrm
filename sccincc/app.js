/**
 * Module dependencies.
 */

var express = require('express'), 
partials = require('express-partials'), 
routes = require('./routes'), 
user = require('./routes/user'),
http = require('http'), 
path = require('path');
var MySQLSessionStore = require('connect-mysql-session')(express);
var fs = require('fs');
var accessLogfile = fs.createWriteStream('access.log', {
	flags : 'a'
});
var errorLogfile = fs.createWriteStream('error.log', {
	flags : 'a'
});



var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(partials());
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.bodyParser());
app.use(express.bodyParser({uploadDir:'./uploads'}));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session(
		{
    store: new MySQLSessionStore("callcenter", "root", "12345678", {
        host:'127.0.0.1',
        port:3306
    }),
    secret: "keyboard cat"
}
		));

app.use(require('stylus').middleware(__dirname + '/public'));

app.use(app.router);

app.use(express.logger( {
	stream : accessLogfile
}));


app.configure('production', function() {
  app.use(function(err, req, res, next){
	  console.log('在文件记录错误日志：');
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLogfile.write(meta + err.stack + '\n');
    next();
  });
});
 
//for 2.x
//app.configure('production', function() {
//  app.error(function(err, req, res, next){
//    var meta = '['+new Date()+']' + req.url + '\n';
//    errLogfile.write(meta + err.stack + '\n');
//    next();
//  });
//});

app.use( function(req, res, next) {
//	console.log("用来判断用户是否已经登录：",req.session);
	
//	if (!req.session.user && req.path!='/') {
//		req.session.error='请先登陆';
//		return res.redirect('/login');
//		}
	
		next();
	});

app.use(logErrors);
//app.use(clientErrorHandler);
//app.use(errorHandler);

app.locals( {
	title : '四川建设网客户服务系统',
	phone : '1-250-858-9990',
	email : 'me@myapp.com'
});

function logErrors(err, req, res, next) {
	console.log('在屏幕输出错误日志：');
	console.error(err.stack);

	next(err);
}

//function clientErrorHandler(err, req, res, next) {
//	if (req.xhr) {
//		res.send(500, {
//			error : '服务器内部错误!'
//		});
//	} else {
//		next(err);
//	}
//}

//function errorHandler(err, req, res, next) {
//	var meta = '[' + new Date() + '] ' + req.url + '\n';
//	errorLogfile.write(meta + err.stack + '\n');
//	next();
//
//	// res.status(500);
//	// res.render('error', { error: err });
//}

// development only
if ('development' == app.get('env')) {
	console.log("当前程序运行于开发环境");
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler( {
		dumpExceptions : true,
		showStack : true
	}));
}

//只用于生产环境
if ('production' == app.get('env')) {
	console.log("当前程序运行于生产环境");
	var oneYear = 31557600000;
	app.use(express.static(__dirname + '/public', {
		maxAge : oneYear
	}));
	//app.use(express.errorHandler());
	
}

var routings = require(__dirname + '/routes/routing.js');
for ( var i in routings) {
	//console.log(routings[i]);
	for ( var r in routings[i]) {
		var pf = require(__dirname + routings[i][r].file)[routings[i][r].fn];
		if (routings[i][r].method == 'get')
			app.get(routings[i][r].urlreg, pf);
		else if (routings[i][r].method == 'post')
			app.post(routings[i][r].urlreg, pf);
		else
			app.all(routings[i][r].urlreg, pf);
	}

}



/**
app.get('*', function(req, res){
 res.render('404', {
 title: 'No Found'
 })
 });
 **/

/*
 * http.createServer(app).listen(app.get('port'), function(){
 * console.log('Express server listening on port ' + app.get('port')); });
 */

if (!module.parent) {
	app.listen(3000);
	console.log("Express server listening on port %d in %s mode", app
			.get('port'), app.settings.env);
}

module.exports = app;
