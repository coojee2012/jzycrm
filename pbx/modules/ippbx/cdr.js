var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var cdr = schema.define('cdr', {
	calldate:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	clid:   {type:String,limit:50},
	src:   {type:String,limit:50},
	dst:   {type: Number, default: function () { return 0 }},
	dcontext:   {type:String,limit:50},
	channel:   {type:String,limit:50},
	dstchannel:    {type:String,limit:50},
	lastapp:    {type:String,limit:50},
	lastdata:    {type:String,limit:50},
	duration:    {type:Number,default: function () { return 0 }},
	billsec:    {type:Number,default: function () { return 0 }},
	disposition:    {type:String,limit:50},
	amaflags:    {type:Number,default: function () { return 0 }},
	accountcode:    {type:String,limit:50},
	userfield:    {type:String,limit:50},
	uniqueid:    {type:String,limit:50}

}, {
    restPath: '/cdr' // tell WebService adapter which path use as API endpoint
});
cdr.autotpl=true;
cdr.cloums={
		calldate:   {name:"呼叫时间",input:Inputs.Date,search:false,create:false,table:true},
		clid:   {name:"来电显示",input:Inputs.Text,search:false,create:false,table:true},
		src:   {name:"来源地址",input:Inputs.Text,search:false,create:false,table:true},
		dst:   {name:"目的地址",input:Inputs.Text,search:false,create:false,table:true},
		dcontext:   {name:"上下文",input:Inputs.Text,search:false,create:false,table:true},
		channel:   {name:"源通道",input:Inputs.Date,search:false,create:false,table:true},
		dstchannel:    {name:"目的通道",input:Inputs.Text,search:false,create:false,table:true},
		lastapp:    {name:"最后应用",input:Inputs.Text,search:false,create:false,table:true},
		lastdata:    {name:"最后胡局",input:Inputs.Text,search:false,create:false,table:true},
		duration:    {name:"持续时间",input:Inputs.Text,search:false,create:false,table:true},
		billsec:    {name:"通话时长",input:Inputs.Text,search:false,create:false,table:true},
		disposition:    {name:"呼叫状态",input:Inputs.Text,search:false,create:false,table:true},
		amaflags:    {name:"管理标识",input:Inputs.Text,search:false,create:false,table:true},
		accountcode:    {name:"呼叫帐号",input:Inputs.Text,search:false,create:false,table:true},
		userfield:    {name:"用户区域",input:Inputs.Text,search:false,create:false,table:true},
		uniqueid:    {name:"呼叫UID",input:Inputs.Text,search:false,create:false,table:true}
};
cdr.views={
		dir:'ippbx',
		name:'cdr',
		memo:'通话记录',
		alias:'通话记录'		
		}
cdr.Name='cdr';
//cdr.validatesPresenceOf('name',{message: '名称不能为空！'});

schema.models.cdr;
//schema.automigrate();
module.exports = cdr;