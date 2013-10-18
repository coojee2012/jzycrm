var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var ConsultCode=require('./ConsultCode');
var UserInfo=require('./UserInfo');
var CustomInfo=require('./CustomInfo');
var moment = require('moment');
var myconstant = require('../../common/constant.js');


var huifangleixing=[
                    {checked:' selected="selected"',value:1,name:'电话'},
                    {checked:'',value:2,name:'短信'},
                    {checked:'',value:3,name:'其他'}
                      ];
var ConsultRecords = schema.define('ConsultRecords', {
	callUnitID:   {type:String,limit:50},
	ctContent:  {type:String,limit:255},
	isOver:    {type: Number, default: function () { return 0 }},
	isNeedBack:    {type: Number, default: function () { return 0 }},
	backStatus:    {type: Number, default: function () { return 0 }},
	backType:    {type: Number, default: function () { return 0 }},
	srvScode:    {type: Number, default: function () { return 0 }},
	ansTime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	backTime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	rbackTime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	ansContent:	{type:String,limit:255},
	backContent:	{type:String,limit:255}
}, {
    restPath: '/ConsultRecords' // tell WebService adapter which path use as API endpoint
});
ConsultRecords.autotpl=false;
ConsultRecords.cloums={
		callUnitID:   {name:"咨询编号",input:Inputs.Hidden,search:true,create:true,table:true},
		ctID: {name:"咨询类型",input:Inputs.SelectDB,search:true,create:true,table:true,selectdb:{dbname:'crm/ConsultCode',key:'id',value:'ctName'}},
		ctContent:    {name:"咨询内容",input:Inputs.TextArea,search:true,create:true,table:true},
		isNeedBack:  {name:"是否回访",input:Inputs.Radios,search:false,create:false,table:false,radios:myconstant.yesorno},
		backStatus:  {name:"回访状态",input:Inputs.Radios,search:false,create:false,table:false,radios:myconstant.yesorno},		
		backType:  {name:"回访方式",input:Inputs.Selects,search:false,create:false,table:false,selects:huifangleixing},
		ansContent:  {name:"受理内容",input:Inputs.TextArea,search:false,create:true,table:true},
		isOver:  {name:"受理结果",input:Inputs.Radios,search:false,create:true,table:true,radios:myconstant.statusA},
		backContent:  {name:"回访内容",input:Inputs.TextArea,search:false,create:false,table:false},		
		srvManID: {name:"服务座席",input:Inputs.SelectDB,search:true,create:false,table:true,selectdb:{dbname:'crm/UserInfo',key:'id',value:'uName'}},
		backMan: {name:"回访人员",input:Inputs.SelectDB,search:false,create:false,table:false,selectdb:{dbname:'crm/UserInfo',key:'id',value:'uName'}},
		cID: {name:"用户名称",input:Inputs.SelectDB,search:true,create:false,table:true,selectdb:{dbname:'crm/CustomInfo',key:'id',value:'cname'}},
		srvScode:   {name:"用户评分",input:Inputs.Text,search:false,create:false,table:false},
		rbackTime:   {name:"回访时间",input:Inputs.Date,search:false,create:false,table:false},
		backTime:   {name:"回访时间",input:Inputs.Date,search:false,create:false,table:false},
		ansTime:   {name:"记录时间",input:Inputs.Date,search:false,create:false,table:true}
		
}

ConsultRecords.views={
		dir:'crm',
		name:'ConsultRecords',
        memo:'咨询记录',
        alias:'咨询记录'		
}
ConsultRecords.Name='ConsultRecords';
ConsultRecords.belongsTo(ConsultCode,{as:'ConsultCode',foreignKey: 'ctID'});
ConsultRecords.belongsTo(UserInfo,{as:'UserInfo2',foreignKey: 'backMan'});
ConsultRecords.belongsTo(UserInfo,{as:'UserInfo1',foreignKey: 'srvManID'});
ConsultRecords.belongsTo(CustomInfo,{as:'CustomInfo',foreignKey: 'cID'});

ConsultRecords.validatesPresenceOf('ctContent', 'callUnitID');
//ConsultRecords.validatesLengthOf('uPass', {min: 8, message: {min: '密码不能少于8位'}});
//UserInfo.validatesInclusionOf('uSex', {in: ['男', '女']});
//UserInfo.validatesExclusionOf('domain', {in: ['www', 'billing', 'admin']});
//ConsultRecords.validatesNumericalityOf('ordernum', {int: true});
//UserInfo.validatesUniquenessOf('email', {message: 'email is not unique'});

schema.models.ConsultRecords;

module.exports = ConsultRecords;