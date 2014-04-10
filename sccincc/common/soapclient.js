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

var soap=require("soap");

 var url = 'http://221.182.119.26:8008/YBW/services/user?wsdl';
  var args = {name: 'value'};
  soap.createClient(url, function(err, client) {
    /*  client.MyFunction(args, function(err, result) {
          console.log(result);
      });*/

 /* //console.log(client.describe());
  client.getList({},function(err,result){
   logger.info(result.body);
  });
   client.getAll({name:"",call:""},function(err,result){
   logger.info(result.body);
  });
    client.getId({},function(err,result){
//console.log(result);
  });*/
  logger.info("我被加载了~");
  exports.soapclient=client;
  });