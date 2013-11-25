var SysLog=require('../modules/crm/SysLog');
var util=require('util');
var syslog={};
syslog.add=function add(req,res,type,err){
var errorpage=req.path;
var msg=util.inspect(err,false,null);
var log=new SysLog();
    log.content=msg;
    log.errorpage=errorpage;
    log.controller=type;
    log.save(function(err,inst){
    	if(err)
    		console.log('记录数据库日志发生错误：',err);
    	return;
    });

}
module.exports = syslog;