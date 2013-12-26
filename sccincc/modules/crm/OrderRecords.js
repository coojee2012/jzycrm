var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var OrderType=require('./OrderType');
var UserInfo=require('./UserInfo');
var CustomInfo=require('./CustomInfo');
var DepInfo=require('./DepInfo');
var moment = require('moment');
var OrderRecords = schema.define('OrderRecords', {
	callUnitID:   {type:String,limit:50},
	uphone:   {type:String,limit:100},
	uaddr:   {type:String,limit:200},
	//dactorName:    {type:String,limit:150},
	orderContent:  {type:String,limit:500, default: function () { return '';}},
	OrderOptions:    {type: Number, default: function () { return 0 }},	
	recordTime:   {type: Date, default: function () { return null; }},
	paidanTime:   {type: Date, default: function () { return null;}},
	orderTime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	orderReslut:	{type:String,limit:500, default: function () { return '';}},
	memo:{type:String,limit:500, default: function () { return '';}}
	//serMan:	{type:Number,default:function () { return 540 }},
	//cID:	{type:Number,default:function () { return 0 }}
}, {
    restPath: '/OrderRecords' // tell WebService adapter which path use as API endpoint
});
OrderRecords.autotpl=false;
OrderRecords.cloums={
		callUnitID:   {name:"通话编号",input:Inputs.Hidden,search:true,create:true,table:true},
		uphone:   {name:"联系手机",input:Inputs.Hidden,search:true,create:true,table:true},
		uaddr:   {name:"联系地址",input:Inputs.Hidden,search:true,create:true,table:true},
		OrderTypeid: {name:"故障现象",input:Inputs.SelectDB,search:true,create:true,table:true,selectdb:{dbname:'crm/OrderType',key:'id',value:'typeName'}},
		orderContent:    {name:"受理内容",input:Inputs.TextArea,search:false,create:true,table:false},
		orderReslut:  {name:"处理结果",input:Inputs.TextArea,search:false,create:true,table:false},	
		DepID: {name:"处理部门",input:Inputs.SelectDB,search:true,create:true,table:true,selectdb:{dbname:'crm/DepInfo',key:'id',value:'depName'}},
		dactorName: {name:"处理人员",input:Inputs.SelectDBGroup,search:true,create:false,table:false,selectdbGroup:{dbname:'crm/UserInfo',key:'id',value:'uName',as:'UserInfo2',groupby:'depName',groupdb:'DepInfo'}},		
		serMan: {name:"服务座席",input:Inputs.SelectDB,search:true,create:false,table:false,selectdb:{dbname:'crm/UserInfo',key:'id',value:'uName',as:'UserInfo3'}},
		backMan: {name:"回访座席",input:Inputs.SelectDB,search:true,create:false,table:false,selectdb:{dbname:'crm/UserInfo',key:'id',value:'uName',as:'UserInfo1'}},
		cID: {name:"用户名称",input:Inputs.SelectDB,search:true,create:false,table:true,selectdb:{dbname:'crm/CustomInfo',key:'id',value:'cname'}},
		OrderOptions:  {name:"工单状态",input:Inputs.Radios,search:false,create:true,table:true,radios:[
		        		                                                                           {checked:' selected="selected"',
		      		                                                                            	 value:0,
		      		                                                                            	 name:'未处理'},
		      		                                                                           {checked:'',
		      			                                                                       value:1,
		      			                                                                       name:'处理中'},
		      			                                                                       {checked:'',
		      				                                                                       value:2,
		      				                                                                       name:'已完成'}
		      		                                                                             ]},
		recordTime:   {name:"处理时间",input:Inputs.Date,search:false,create:false,table:true},
		paidanTime:   {name:"派单时间",input:Inputs.Date,search:false,create:false,table:false},
		orderTime:   {name:"记录时间",input:Inputs.Date,search:false,create:false,table:false},
		memo:   {name:"备注",input:Inputs.Text,search:false,create:true,table:false}
		
}

OrderRecords.views={
		dir:'crm',
		name:'OrderRecords',
		memo:'工单记录',
		alias:'工单记录'		
}
OrderRecords.Name='OrderRecords';
OrderRecords.belongsTo(OrderType,{as:'OrderType',foreignKey: 'OrderTypeid'});
OrderRecords.belongsTo(UserInfo,{as:'UserInfo3',foreignKey: 'serMan'});
OrderRecords.belongsTo(UserInfo,{as:'UserInfo2',foreignKey: 'dactorName'});
OrderRecords.belongsTo(UserInfo,{as:'UserInfo1',foreignKey: 'backMan'});
OrderRecords.belongsTo(CustomInfo,{as:'CustomInfo',foreignKey: 'cID'});
OrderRecords.belongsTo(DepInfo,{as:'DepInfo',foreignKey: 'DepID'});
OrderRecords.validatesPresenceOf('orderContent', 'callUnitID');

schema.models.OrderRecords;
module.exports = OrderRecords;