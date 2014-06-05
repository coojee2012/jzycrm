var AGI = require('./lib/index');
var moment = require('moment');
var routing = require('./routing');
var log4js = require('log4js');
var callsession = require('../modules/ippbx/callsession');

log4js.configure({
  "appenders": [{
    "type": "console"
  }, {
    "type": "file",
    "filename": "app.log",
    "maxLogSize": 102400,
    "backups": 3,
    "category": "app"
  }, {
    "type": "file",
    "filename": "agi.log",
    "maxLogSize": 102400,
    "backups": 3,
    "category": "agi"
  }],
  "replaceConsole": true
});

var logger = log4js.getLogger('agi');
logger.setLevel('DEBUG');



var server = AGI.createServer(function(context) {
  logger.debug("当前上下文状态：" + context.state + '，上下文流是否可读：' + context.stream.readable);

  var route = new routing({
    context: context,
    args: null,
    logger: logger,
    vars: null
  });

 /* server.getConnections(function(err, count) {
    logger.info('当前服务器连接数：' + count);
  });*/

  server.on("error", function(err) {
    logger.error(err);
  });

  //捕获获取变量事件
  //vars 捕获到的变量
  //访问开始的地方 


  context.on('variables', function(vars) {
    var script = vars.agi_network_script.split("?");
    var router = script[0];
    var args = {};
    if (script[1] && script[1] !== "") {
      var tmp = script[1].split('&');
      for (var i in tmp) {
        var kv = tmp[i].split('=');
        args[kv[0]] = kv[1];
      }
    }

    logger.debug(vars);
    logger.info('捕获到来自' + vars.agi_callerid + '的新呼叫， 呼叫编号为: ' + vars.agi_uniqueid);
    route.args = args;
    route.vars = vars;
    if (typeof(route[router]) === 'function') {
      route[router]();
    }
    //找不到AGI路由处理函数，将调用默认路由处理
    else {
      route.dodefault();
    }


  
  });
  //监听事件返回结果
  context.on('response', function(response) {
    logger.info("捕获到监听事件返回的结果：", response);
  });

  //捕获挂机
  context.on('hangup', function(vars) {
    logger.info("发生挂机事件.");
    if (route.args.routerline) {
      logger.info("正常呼叫中心流程，记录挂机时间.");


      callsession.findOne({
        where: {
         id: route.sessionnum
        }
      }, function(err, inst) {
        if (err || inst == null) {
          logger.error(err);
          context.end();
        } else {
          inst.hanguptime = moment().format("YYYY-MM-DD HH:mm:ss");
          callsession.updateOrCreate(inst, function(err, o) {
            if (err)
              logger.error(err);
            context.end();

          });
        }
      });

      
    } else {
      context.end();
    }

  });

  //捕获异常
  context.on('error', function(err) {
    logger.info("AGI ERROR:", err);
    context.end();
  });
  //AGI访问关闭
  context.on('close', function(o) {
    logger.info("AGI通道已关闭", o);
    route = null;
  });
});

if (!module.parent) {
  server.listen(4574);
}

module.exports = server;