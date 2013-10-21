var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var DepInfo=require('./DepInfo');
var UserRole=require('./UserRole');
var myvalite=require('../../common/validatefn.js');
var myconstant = require('../../common/constant.js');

var UserInfo = schema.define('UserInfo', {
	uName:   {type:String,limit:50},
	uCard:    {type:String,limit:100},
	uSex:  {type:Number,default:function () { return 0 }},
	uLogin:   {type:String,limit:50},
	uPass:	{type:String,limit:50},
	uPhone:{type:String,limit:50},
	uWorkid:{type:String,limit:50},
	uExten:	{type:String,limit:10},
	uAddr:{type:String,limit:200},
	readOnly:{type:Number,default:function () { return 0 }},
	isAgent:{type:Number,default:function () { return 0 }},
	uMemo:{type:String,limit:50},
	crtTime:{type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	lastChangeTime:{type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	lastLoginTime:{type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }}
//	uDepId:{type:Number},
//	uRolyId:{type:Number}
}, {
    restPath: '/UserInfo' // tell WebService adapter which path use as API endpoint
});
UserInfo.autotpl=false;
UserInfo.cloums={
		uName:   {name:"姓名",input:Inputs.Text,search:true,table:true,create:true},
		uCard:   {name:"身份证号",input:Inputs.Text,search:true,table:true,create:true},
		uSex:  {name:"性别",input:Inputs.Radios,search:true,table:true,create:true,radios:myconstant.sex},
		uLogin:   {name:"登录帐号",input:Inputs.Text,search:false,table:true,create:true},
		uPass:	{name:"登录密码",input:Inputs.Passwd,search:false,table:false,create:true},
		uPhone:{name:"手机号",input:Inputs.Text,search:true,table:true,create:true},
		uExten:	{name:"分机号码",input:Inputs.Text,search:true,table:true,create:true},
		uWorkid:{name:"工号",input:Inputs.Text,search:true,table:true,create:true},
		uAddr:{name:"联系地址",input:Inputs.Text,search:false,table:false,create:true},
		readOnly:{name:"系统默认",input:Inputs.Radios,search:false,table:false,create:true,radios:myconstant.yesorno},
		isAgent:{name:"是否座席",input:Inputs.Radios,search:false,table:false,create:true,radios:myconstant.yesorno},
		uDepId:{name:"所在部门",input:Inputs.SelectDB,search:true,table:true,create:true,selectdb:{dbname:'crm/DepInfo',key:'id',value:'depName'}},
		uRolyId:{name:"所属角色",input:Inputs.SelectDB,search:true,table:true,create:true,selectdb:{dbname:'crm/UserRole',key:'id',value:'roleName'}},	
		uMemo:{name:"备注",input:Inputs.Text,search:false,table:false,create:false},
		crtTime:{name:"创建时间",input:Inputs.Date,search:false,table:true,create:false},
		lastChangeTime:{name:"修改时间",input:Inputs.Date,search:false,table:false,create:false},
		lastLoginTime:{name:"登录时间",input:Inputs.Date,search:false,table:false,create:false}		
};

UserInfo.views={
		dir:'crm',
		name:'UserInfo',
		memo:'管理和设置系统用户',
		alias:'用户'		
		}
UserInfo.Name='UserInfo';
UserInfo.belongsTo(DepInfo,{as:'DepInfo',foreignKey: 'uDepId'});
UserInfo.belongsTo(UserRole,{as:'UserRole',foreignKey: 'uRolyId'});

UserInfo.validatesPresenceOf('uName','uPhone',{message: '值不能为空！'});
//UserInfo.validatesLengthOf('uPass', {min: 8, message: {min:'密码不能少于8位'}});
UserInfo.validatesInclusionOf('uSex', {in: [0, 1]});
UserInfo.validatesExclusionOf('uLogin', {in: ['root', 'www', 'admin'],message:'用户名不可用！'});
UserInfo.validate('uPhone',function(err){if(!myvalite.isint(this.uPhone)) err(); }, {message:'手机号码是整数数字'});
//UserInfo.validate('uExten',function(){}, {message:'分机号码是整数数字'});
//UserInfo.validatesUniquenessOf('email', {message: 'email is not unique'});

schema.models.UserInfo;

module.exports = UserInfo;
		