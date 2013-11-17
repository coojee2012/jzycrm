var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var SysLog = schema.define('SysLog', {
	content:      {type:String,limit:600},
	errorpage:    {type:String,limit:80},
	controller:   {type:String,limit:50},
	crttime:     {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }}
}, {
    restPath: '/SysLog' // tell WebService adapter which path use as API endpoint
});
SysLog.autotpl=false;
SysLog.cloums={
		content:   {name:"错误内容",input:Inputs.Text,search:false,create:true,table:true},
		errorpage:   {name:"页面",input:Inputs.Text,search:false,create:true,table:true},
		controller:   {name:"控制器",input:Inputs.Text,search:false,create:true,table:true},
		crttime:    {name:"记录时间",input:Inputs.Date,search:true,create:false,table:true}
};
SysLog.views={
		dir:'crm',
		name:'SysLog',
		memo:'系统日志',
		alias:'系统日志'		
		}
SysLog.Name='SysLog';
SysLog.validatesPresenceOf('content',{message: '内容不能为空！'});


schema.models.SysLog;


module.exports = SysLog;