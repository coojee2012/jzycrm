var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var myconstant = require('../../common/constant.js');
var ComplaintCode=require('./ComplaintCode');
var UserInfo=require('./UserInfo');
var CustomInfo=require('./CustomInfo');
var moment = require('moment');
var ComplaintRecords = schema.define('ComplaintRecords', {
	Content:   {type:String,limit:256},	
	answerContent:  {type:String,limit:256},
	backContent:  {type:String,limit:256},
	answerDept:  {type:String,limit:50},
	comments:  {type:String,limit:256},
	answerStatus:    {type: Number, default: function () { return 0 }},
	workTime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	answerTime:   {type: Date, default: function () { return null; }}

}, {
    restPath: '/ComplaintRecords' // tell WebService adapter which path use as API endpoint
});
ComplaintRecords.autotpl=false;
ComplaintRecords.cloums={
		CodeID: {name:"投诉类型",input:Inputs.SelectDB,search:true,create:true,table:true,selectdb:{dbname:'crm/ComplaintCode',key:'id',value:'CodeName'}},
		Content:    {name:"受理内容",input:Inputs.TextArea,search:false,create:true,table:false},
		answerContent:  {name:"处理内容",input:Inputs.TextArea,search:false,create:false,table:false},
		backContent:  {name:"回访内容",input:Inputs.TextArea,search:false,create:false,table:false},
		answerDept:  {name:"处理部门",input:Inputs.Text,search:true,create:true,table:true},
		comments:  {name:"领导批示",input:Inputs.TextArea,search:false,create:false,table:false},
		workManID: {name:"服务座席",input:Inputs.SelectDB,search:true,create:false,table:true,selectdb:{dbname:'crm/UserInfo',key:'id',value:'uName'}},
		backManID: {name:"回访座席",input:Inputs.SelectDB,search:true,create:false,table:true,selectdb:{dbname:'crm/UserInfo',key:'id',value:'uName'}},
		CustomID: {name:"用户名称",input:Inputs.SelectDB,search:true,create:false,table:true,selectdb:{dbname:'crm/CustomInfo',key:'id',value:'cname'}},
		answerStatus:  {name:"处理状态",input:Inputs.Radios,search:false,create:false,table:true,radios:myconstant.statusA},		
		workTime:   {name:"记录时间",input:Inputs.Date,search:false,create:false,table:true},
		backTime:   {name:"回访时间",input:Inputs.Date,search:false,create:false,table:false},
		answerTime:   {name:"处理时间",input:Inputs.Date,search:false,create:false,table:false}
		
}


ComplaintRecords.views={
dir:'crm',
name:'ComplaintRecords',
memo:'投诉记录',
alias:'投诉记录'		
}
ComplaintRecords.Name='ComplaintRecords';
ComplaintRecords.belongsTo(ComplaintCode,{as:'ComplaintCode',foreignKey: 'CodeID'});
ComplaintRecords.belongsTo(UserInfo,{as:'UserInfo2',foreignKey: 'backManID'});
ComplaintRecords.belongsTo(UserInfo,{as:'UserInfo1',foreignKey: 'workManID'});
ComplaintRecords.belongsTo(CustomInfo,{as:'CustomInfo',foreignKey: 'CustomID'});

ComplaintRecords.validatesPresenceOf('Content');

schema.models.ComplaintRecords;

module.exports = ComplaintRecords;