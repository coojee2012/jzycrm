var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var recordfiles = schema.define('recordfiles', {
	filename:   {type:String,limit:50},
	extname:    {type:String,limit:50},
	filesize:   {type:Number,default:function () { return 0 }},
	associate:  {type:String,limit:50},
	calltype:   {type:String,limit:50},
	cretime:    {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	extennum:   {type:String,limit:50},
	folder:     {type:String,limit:50},
	doymicac:   {type:String,limit:50}

}, {
    restPath: '/recordfiles' // tell WebService adapter which path use as API endpoint
});
recordfiles.autotpl=false;
recordfiles.cloums={
		filename:   {name:"文件名",input:Inputs.Text,search:false,create:true,table:true},
		extname:   {name:"扩展名",input:Inputs.Text,search:false,create:true,table:true},
		filesize:   {name:"文件大小",input:Inputs.Text,search:false,create:false,table:true},
		associate:   {name:"关联编号",input:Inputs.Text,search:false,create:true,table:true},
		calltype:   {name:"呼叫类型",input:Inputs.Text,search:false,create:false,table:true},
		cretime:   {name:"记录时间",input:Inputs.Date,search:true,create:false,table:true},
		extennum:   {name:"分机号",input:Inputs.Text,search:true,create:true,table:true},
	    folder:   {name:"文件夹",input:Inputs.Text,search:false,create:false,table:false},
		
		doymicac:    {name:"动态帐号",input:Inputs.Text,search:false,create:false,table:true}
};
recordfiles.views={
		dir:'ippbx',
		name:'recordfiles',
		memo:'录音记录',
		alias:'录音记录'		
		}
recordfiles.Name='recordfiles';
//recordfiles.validatesPresenceOf('name',{message: '名称不能为空！'});

schema.models.recordfiles;
//schema.automigrate();
module.exports = recordfiles;