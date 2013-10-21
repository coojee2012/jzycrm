var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var AreaCode=require('./AreaCode');
var moment = require('moment');
var isornot=[
             {checked:' selected="selected"',
              	 value:0,
              	 name:'未恢复'},
             {checked:'',
             value:1,
             name:'处理中'},
             {checked:'',
                 value:2,
                 name:'已恢复'}
               ];
var WarterStopInfo = schema.define('WarterStopInfo', {
	stopReson:   {type:String,limit:100},
	smsTell:    {type:String,limit:150},
	isres:    {type: Number, default: function () { return 0 }},
	startTime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	endTime:   {type: Date, default: function () { return null; }},
	resTime:   {type: Date, default: function () { return null; }}
}, {
    restPath: '/WarterStopInfo' // tell WebService adapter which path use as API endpoint
});
WarterStopInfo.autotpl=false;
WarterStopInfo.cloums={
		stopReson:   {name:"停水原因",input:Inputs.Text,search:true,create:true,table:true},
		smsTell: {name:"短信内容",input:Inputs.Text,search:true,create:true,table:true},
		areaID: {name:"停水区域",input:Inputs.SelectDB,search:true,create:true,table:true,selectdb:{dbname:'crm/AreaCode',key:'id',value:'AreaName'}},
		isres:  {name:"恢复供水",input:Inputs.Radios,search:true,create:true,table:true,radios:isornot},
		startTime:   {name:"开始时间",input:Inputs.Date,search:false,create:true,table:true},     		                                                                             
		endTime:   {name:"预计结束时间",input:Inputs.Date,search:false,create:true,table:true},
		resTime:   {name:"恢复时间",input:Inputs.Date,search:false,create:false,table:true}
		
}

WarterStopInfo.views={
		dir:'crm',
		name:'WarterStopInfo',
		memo:'停水记录',
		alias:'停水记录'		
}
WarterStopInfo.Name='WarterStopInfo';
WarterStopInfo.belongsTo(AreaCode,{as:'AreaCode',foreignKey: 'areaID'});
WarterStopInfo.validatesPresenceOf('stopReson', 'smsTell',{message: '不能为空！'});

schema.models.WarterStopInfo;
module.exports = WarterStopInfo;