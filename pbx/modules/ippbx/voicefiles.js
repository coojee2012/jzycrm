var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var yesornot=[{checked:' selected="selected"',value:0,name:'否'} ,{checked:' ',value:1,name:'是'}];
var processmode=[{checked:' selected="selected"',value:1,name:'本地处理'} ,{checked:' ',value:2,name:'拨打外线'} ,{checked:' ',value:0,name:'黑名单'}];
var proto=[{checked:' selected="selected"',value:'sip',name:'SIP外线'} ,
               {checked:' ',value:'iax',name:'IAX2外线'},
               {checked:' ',value:'fxo',name:'FXO外线'},
               {checked:' ',value:'pri',name:'PRI外线'},
               {checked:' ',value:'custom',name:'自定义'}
];
var voicefiles = schema.define('voicefiles', {
	
	filename:   {type:String,limit:50},
	extname:   {type:String,limit:50},
	folder:  {type:String,limit:50},
	description:{type:String,limit:100},
	label: {type:String,limit:50},
	associate: {type:String,limit:50},
	isreadonly: {type:Number,default: function () { return 0 }},
	mailprocessed: {type:Number,default: function () { return 0 }},
	cretime:     {type: Date, default: function () {return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	args:    {type:String,limit:100}

}, {
    restPath: '/voicefiles' // tell WebService adapter which path use as API endpoint
});
voicefiles.autotpl=true;
voicefiles.cloums={
		
		filename:   {name:"文件名",input:Inputs.Text,search:true,create:true,table:true},
		extname:   {name:"扩展名",input:Inputs.Selects,search:false,create:true,table:true,selects:proto},
		folder:   {name:"文件夹",input:Inputs.Text,search:false,create:false,table:true},
		description:   {name:"描述",input:Inputs.Text,search:false,create:true,table:true},
		label:   {name:"标签",input:Inputs.Text,search:false,create:true,table:true},
		associate:   {name:"关联",input:Inputs.Text,search:false,create:true,table:true},
		isreadonly:   {name:"系统只读",input:Inputs.Radios,search:false,create:true,table:true,radios:yesornot},
		mailprocessed:   {name:"邮件推送",input:Inputs.Radios,search:false,create:false,table:true,radios:yesornot},
		cretime: {name:"创建时间",input:Inputs.Date,search:false,create:false,table:true},
		args:    {name:"参数",input:Inputs.Text,search:false,create:true,table:true}
		

};
voicefiles.views={
		dir:'ippbx',
		name:'voicefiles',
		memo:'语音文件',
		alias:'语音文件'		
		}
voicefiles.Name='voicefiles';
//voicefiles.belongsTo(localnumber,{as:'localnumber',foreignKey: 'localnumber'});
voicefiles.validatesPresenceOf('filename',{message: '文件名称不能为空！'});


schema.models.voicefiles;
//schema.automigrate();
module.exports = voicefiles;