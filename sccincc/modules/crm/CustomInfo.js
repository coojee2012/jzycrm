var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var AreaCode=require('./AreaCode');
var UserInfo=require('./UserInfo');
var CustomInfo=require('./CustomInfo');
var moment = require('moment');
var yongshuiqingkuang=[
{checked:' selected="selected"',value:1,name:'正常用水'},
{checked:'',value:0,name:'欠费停水'}
];
var hunfou=[{checked:' selected="selected"',value:1, name:'已婚'},
            {checked:'',value:0,name:'未婚'}];
var CustomInfo = schema.define('CustomInfo', {
	cname:   {type:String,limit:50,default:function(){return '';}},
	csex:    {type: Number, default: function () { return 0 }},
	cage:  {type: String,limit:50,default: function () { return "" }},
	marital:    {type: Number, default: function () { return 0 }},
	cAddr:   {type:String,limit:150,default:function(){return '';}},
	tel:    {type: String,limit:50,default:function(){return '';}},
	phone:    {type: String,limit:50,default:function(){return '';}},
	birthday:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	crtTime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	lastModifyTime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},	
	lifeAddr:	{type:String,limit:150,default:function(){return '';}},
	workunit:	{type:String,limit:150,default:function(){return '';}},
	work:	{type:String,limit:150,default:function(){return '';}},
	idcard:	{type:String,limit:100,default:function(){return '';}},
	loverName:	{type:String,limit:50,default:function(){return '';}},
	userCode:	{type:String,limit:50,default:function(){return '';}},
	userPwd:	{type:String,limit:50,default:function(){return '';}},
	optionMan:	{type:Number,default:function () { return 0 }}
}, {
    restPath: '/CustomInfo' // tell WebService adapter which path use as API endpoint
});
CustomInfo.autotpl=false;
CustomInfo.cloums={
		cname:   {name:"用户姓名",input:Inputs.Text,search:true,create:true,table:true},
		idcard: {name:"用户号",input:Inputs.Text,search:true,create:true,table:true},
		lifeAddr: {name:"用水地址",input:Inputs.TextArea,search:false,create:true,table:true},
		cage:    {name:"用水性质",input:Inputs.Text,search:false,create:true,table:true},
		cAddr:  {name:"家庭住址",input:Inputs.Text,search:false,create:false,table:false},
		tel: {name:"固定电话",input:Inputs.Text,search:false,create:false,table:false},
		phone: {name:"联系电话",input:Inputs.Text,search:true,create:true,table:true},		
		workunit: {name:"水表口径",input:Inputs.Text,search:false,create:true,table:true},
		work: {name:"水表号",input:Inputs.Text,search:true,create:true,table:true},		
		loverName: {name:"爱人姓名",input:Inputs.Text,search:false,create:false,table:false},
		userCode: {name:"登录名",input:Inputs.Text,search:false,create:false,table:false},
		userPwd: {name:"登录密码",input:Inputs.Text,search:false,create:false,table:false},
		optionMan: {name:"记录人员",input:Inputs.SelectDB,search:false,create:false,table:false,selectdb:{dbname:'crm/UserInfo',key:'id',value:'uName'}},
		areaCode: {name:"行政区划",input:Inputs.SelectDBGroup,search:false,create:false,table:false,selectdbGroup:{dbname:'crm/AreaCode',key:'id',value:'AreaName',groupby:'TownName',groupdb:'AreaCodeTown'}},
		csex:  {name:"用水情况",input:Inputs.Radios,search:false,create:true,table:true,radios:yongshuiqingkuang},
		marital:  {name:"婚否",input:Inputs.Radios,search:false,create:false,table:false,radios:hunfou},
		//orderContent:  {name:"处理结果",input:Inputs.Text,search:false,create:true,table:true},
		crtTime:   {name:"创建时间",input:Inputs.Date,search:false,create:true,table:true},
		lastModifyTime:   {name:"修改时间",input:Inputs.Date,search:false,create:false,table:false},
		birthday:   {name:"出生年月",input:Inputs.Date,search:false,create:false,table:false}
		
}

CustomInfo.views={
		dir:'crm',
		name:'CustomInfo',
		memo:'用户信息',
		alias:'用户信息'		
}
CustomInfo.Name='CustomInfo';
CustomInfo.belongsTo(AreaCode,{as:'AreaCode',foreignKey: 'areaCode'});
CustomInfo.validatesPresenceOf('cname', 'phone',{message: '必填，不能为空。'});
//CustomInfo.validatesLengthOf('userPwd', {min: 8, message: {min: '密码不能少于8位'}});
//CustomInfo.validatesInclusionOf('cage', {in: ['男', '女']});
//UserInfo.validatesExclusionOf('domain', {in: ['www', 'billing', 'admin']});
//CustomInfo.validatesNumericalityOf('cage', {int: true});
//UserInfo.validatesUniquenessOf('email', {message: 'email is not unique'});

schema.models.CustomInfo;

module.exports = CustomInfo;