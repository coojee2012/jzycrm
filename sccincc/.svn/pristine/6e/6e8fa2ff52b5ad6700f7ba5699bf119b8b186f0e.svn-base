var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var localnumber=require('./localnumber');
var yesornot=[{checked:' selected="selected"',value:0,name:'否'} ,{checked:' ',value:1,name:'是'}];
var processmode=[{checked:' selected="selected"',value:1,name:'本地处理'} ,{checked:' ',value:2,name:'拨打外线'} ,{checked:' ',value:0,name:'黑名单'}];
var processdefinedlocal=[{checked:' selected="selected"',value:'',name:'全部'} ,
               {checked:' ',value:'extension',name:'分机'},
               {checked:' ',value:'ivr',name:'IVR菜单'},
               {checked:' ',value:'queue',name:'呼叫队列'},
               {checked:' ',value:'conference',name:'电话会议'},
               {checked:' ',value:'agi',name:'AGI'}
];
var router = schema.define('router', {
	
	proirety:   {type:Number},
	createmode:   {type:Number,default: function () { return 0 }},
	routerline:   {type:Number,default: function () { return 1 }},
	routername:{type:String},
	optextra:  {type:String},
	lastwhendone:   {type:Number,default: function () { return 0 }},
	match_callergroup:    {type:String,limit:50},
	match_callerid:    {type:String,limit:200},
	match_callerlen:    {type:String,limit:50},
	match_callednum:     {type:String,limit:50},
	match_calledlen:    {type:String,limit:50},
	replace_callerid:   {type:String,limit:50},
	replace_calledtrim:   {type:String,limit:50},
	replace_calledappend: {type:String,limit:50},
	process_mode:{type:Number,default: function () { return 0 }},
	process_defined:   {type:String,limit:100}

}, {
    restPath: '/router' // tell WebService adapter which path use as API endpoint
});
router.autotpl=true;
router.cloums={
		
		proirety:   {name:"优先权",input:Inputs.Text,search:false,create:false,table:true},
		createmode:   {name:"系统只读",input:Inputs.Radios,search:true,create:true,table:true,radios:yesornot},
		routerline:   {name:"路由线路",input:Inputs.Text,search:false,create:false,table:true},
		routername:   {name:"路由名称",input:Inputs.Text,search:true,create:true,table:true},
		optextra:   {name:"操作扩展",input:Inputs.Text,search:false,create:true,table:true},
		lastwhendone: {name:"最终规则",input:Inputs.Radios,search:false,create:true,table:true,radios:yesornot},
		match_callergroup:    {name:"匹配主叫组",input:Inputs.Text,search:false,create:true,table:true},
		match_callerlen:    {name:"匹配主叫长度",input:Inputs.Text,search:false,create:true,table:true},		 		     		                                                                        
		match_callerid:    {name:"匹配主叫号码",input:Inputs.Text,search:false,create:true,table:false},
		match_callednum:    {name:"匹配被叫号码",input:Inputs.Text,search:false,create:true,table:true},
		match_calledlen:    {name:"匹配被叫长度",input:Inputs.Text,search:false,create:true,table:true},
		replace_callerid:    {name:"主叫替换",input:Inputs.Text,search:false,create:true,table:true},
		replace_calledtrim:    {name:"被叫替换",input:Inputs.Text,search:false,create:true,table:true},
		replace_calledappend:    {name:"追加替换",input:Inputs.Text,search:false,create:true,table:true},
		process_mode: {name:"处理方式",input:Inputs.Selects,search:false,create:true,table:true,selects:processmode},
		process_defined:{name:"处理定义",input:Inputs.Text,search:false,create:true,table:true}

};
router.views={
		dir:'ippbx',
		name:'router',
		memo:'呼叫路由',
		alias:'呼叫路由'		
		}
router.Name='router';
//router.belongsTo(localnumber,{as:'localnumber',foreignKey: 'localnumber'});
router.validatesPresenceOf('routername',{message: '路由名称不能为空！'});


schema.models.router;
//schema.automigrate();
module.exports = router;