var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var MenmuGroup = schema.define('MenmuGroup', {
	mgName:   {type:String,limit:50},
	mgMemo:    {type:String,limit:200},
	mgType:  {type:Number,default:function () { return 0 }},
	crtTime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	lastModifyTime:	{type:Date},
	delFail:	{type:Number,default:function () { return 0 }}
}, {
    restPath: '/MenmuGroup' // tell WebService adapter which path use as API endpoint
});

var grouptype=[
{checked:' selected="selected"',value:1,name:'客服平台'},
{checked:'',value:2,name:'短信平台'},
{checked:'',value:3,name:'知识库'},
{checked:'',value:4,name:'统计分析'},
{checked:'',value:5,name:'综合设置'},
{checked:'',value:6,name:'系统管理'},
{checked:'',value:7,name:'系统设置'},
{checked:'',value:8,name:'PBX设置'}
               ];

MenmuGroup.autotpl=false;
MenmuGroup.cloums={
		mgName:   {name:"分组名称",input:Inputs.Text,search:true,create:true,table:true},
		mgMemo:    {name:"备注",input:Inputs.Text,create:true,table:true},
		mgType:    {name:"分组类型",input:Inputs.Selects,search:true,create:true,table:true,selects:grouptype},
		
		delFail:	{name:"系统默认",input:Inputs.Selects,table:true,create:false,selects:[
		        	                                                      
		        	                                                    	  {checked:' selected="selected"',
	                                                                            	 value:1,
	                                                                            	 name:'是'},
	                                                                           {checked:'',
		                                                                       value:0,
		                                                                       name:'否'}     	 
		        	                                                      
		        	                                                      ]},
		crtTime:   {name:"创建时间",input:Inputs.Date,create:false,table:false},
		lastModifyTime:	{name:"修改时间",input:Inputs.Date,create:false,table:false}
};
MenmuGroup.views={
		dir:'crm',
		name:'MenmuGroup',
		memo:'管理和设置系统菜单组',
		alias:'菜单组'		
		}
MenmuGroup.Name='MenmuGroup';
MenmuGroup.validatesPresenceOf('mgName');
//Menmus.validatesLengthOf('uPass', {min: 8, message: {min: '密码不能少于8位'}});
//UserInfo.validatesInclusionOf('uSex', {in: ['男', '女']});
//UserInfo.validatesExclusionOf('domain', {in: ['www', 'billing', 'admin']});
MenmuGroup.validatesNumericalityOf('mgType', {int: true});
//UserInfo.validatesUniquenessOf('email', {message: 'email is not unique'});

schema.models.MenmuGroup;

module.exports = MenmuGroup;