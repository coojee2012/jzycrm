/**
 * Module dependencies.
 */

var express = require('express'),
	partials = require('express-partials'),
	routes = require('./routes'),
	user = require('./routes/user'),
	http = require('http'),
	path = require('path');
var conf = require('node-conf');
var log4js = require('log4js');

var log4js = require('log4js');
log4js.configure({
	appenders: [{
			type: 'console'
		}, //控制台输出
		{
			type: 'file', //文件输出
			filename: 'web.log',
			maxLogSize: 10240000,
			backups: 3,
			category: 'normal'
		}
	],
	replaceConsole: true
});
var logger = log4js.getLogger('normal');
logger.setLevel('INFO');

//var MySQLSessionStore = require('connect-mysql-session')(express);

var fs = require('fs');
//var accessLogfile = fs.createWriteStream('access.log', {
//	flags : 'a'
//});
//var errorLogfile = fs.createWriteStream('error.log', {
//	flags : 'a'
//});
var mysqlconfig = conf.load('mysql');
var mysql = require('mysql').createConnection({
	host: mysqlconfig.host,
	user: mysqlconfig.username,
	password: mysqlconfig.password,
	database: mysqlconfig.database
}),
	MySQLStore = require('connect-mysql')(express);


var app = express();

// all environments
app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(partials());
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.bodyParser());
app.use(express.bodyParser({
	uploadDir: './uploads'
}));
app.use(express.methodOverride());
app.use(express.cookieParser());

//app.use(express.session({ secret: "keyboard cat" }));
app.use(express.session({
	secret: 'supersecretkeygoeshere',
	store: new MySQLStore({
		client: mysql
	})
}));



app.use(require('stylus').middleware(__dirname + '/public'));

app.use(log4js.connectLogger(logger, {
	level: 'auto',
	format: ':method :url'
}));

app.use(app.router);

//app.use(express.logger( {
//	stream : accessLogfile
//}));


app.configure('production', function() {
	app.use(function(err, req, res, next) {
		console.log('在文件记录错误日志：', err);
		// var meta = '[' + new Date() + '] ' + req.url + '\n';
		// errorLogfile.write(meta + err.stack + '\n');
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

app.use(function(req, res, next) {
	//	console.log("用来判断用户是否已经登录：",req.session);

	//	if (!req.session.user && req.path!='/') {
	//		req.session.error='请先登陆';
	//		return res.redirect('/login');
	//		}

	next();
});

//app.use(logErrors);
//app.use(clientErrorHandler);
//app.use(errorHandler);

var common=conf.load('common');
app.locals({
	title: common.sysname,
	phone: common.phone,
	email: common.email
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
	//app.use(express.errorHandler( {
	//	dumpExceptions : true,
	//	showStack : true
	//}));
}

//只用于生产环境
if ('production' == app.get('env')) {
	console.log("当前程序运行于生产环境");
	var oneYear = 31557600000;
	app.use(express.static(__dirname + '/public', {
		maxAge: oneYear
	}));
	//app.use(express.errorHandler());

}

var routings = require(__dirname + '/routes/routing.js');
for (var i in routings) {
	//console.log(routings[i]);
	for (var r in routings[i]) {
		var pf = require(__dirname + routings[i][r].file)[routings[i][r].fn];
		if (routings[i][r].method == 'get') {
			//console.log(routings[i][r].urlreg,pf);
			app.get(routings[i][r].urlreg, pf);
		} else if (routings[i][r].method == 'post')
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
	app.listen(83);
	console.log("Express server listening on port %d in %s mode", app
		.get('port'), app.settings.env);
}

module.exports = app;