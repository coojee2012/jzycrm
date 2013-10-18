var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var smsstate=[{checked:' selected="selected"',value:0,name:'未发送'},{checked:'',value:1,name:'正在发送'},{checked:'',value:2,name:'发送成功'},{checked:'',value:2,name:'发送失败'}]
var Sms = schema.define('Sms', {
	mobile:     {type:String,limit:50},
	content:    {type:String,limit:256},
	shuoming:    {type:String,limit:256},
	SendTime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	WorkTime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	sendState:  {type:Number,default:function () { return 0 }}

}, {
    restPath: '/Sms' // tell WebService adapter which path use as API endpoint
});
Sms.autotpl=false;
Sms.cloums={
		mobile:    {name:"手机号",input:Inputs.Text,search:true,create:true,table:true},
		content:   {name:"短信内容",input:Inputs.TextArea,search:true,create:true,table:true},
		shuoming:    {name:"说明",input:Inputs.Text,search:true,create:true,table:true},
		SendTime:  {name:"发送时间",input:Inputs.Date,search:false,create:false,table:false},
		WorkTime:  {name:"更新时间",input:Inputs.Date,search:false,create:false,table:false},
		sendState:  {name:"发送状态",input:Inputs.Selects,search:true,create:false,table:true,selects:smsstate}
};
Sms.views={
		dir:'crm',
		name:'Sms',
		memo:'短信',
		alias:'短信'		
		}
Sms.Name='Sms';

Sms.validatesPresenceOf('mobile','content',{message: '不能为空！'});

schema.models.Sms;
schema.isActual(function(err, actual) {
    if (!actual) {
        schema.autoupdate();
    }
});
module.exports = Sms;