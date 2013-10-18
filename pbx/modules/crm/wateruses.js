var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var UserInfo=require('./UserInfo');
var CustomInfo=require('./CustomInfo');
var moment = require('moment');
var wateruses = schema.define('wateruses', {
	stardu:    {type: Number, default: function () { return 0 }},
	enddu:    {type: Number, default: function () { return 0 }},
	cbtime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	startime:   {type: Date, default: function () { return null; }},
	endtime:   {type: Date, default: function () { return null; }}
}, {
    restPath: '/wateruses' // tell WebService adapter which path use as API endpoint
});
wateruses.autotpl=false;
wateruses.cloums={
		userID: {name:"抄表人员",input:Inputs.SelectDB,search:true,create:true,table:true,selectdb:{dbname:'crm/UserInfo',key:'id',value:'uName'}},
		customID: {name:"用户名称",input:Inputs.SelectDB,search:true,create:true,table:true,selectdb:{dbname:'crm/CustomInfo',key:'id',value:'cname'}},
		stardu:  {name:"起度",input:Inputs.Text,search:true,create:true,table:true},
		enddu:  {name:"止度",input:Inputs.Text,search:true,create:true,table:true},
		cbtime:   {name:"抄表时间",input:Inputs.Date,search:false,create:true,table:true},     		                                                                             
		startime:   {name:"起始时间",input:Inputs.Date,search:false,create:true,table:true},
		endtime:   {name:"结束时间",input:Inputs.Date,search:false,create:true,table:true}
		
}

wateruses.views={
		dir:'crm',
		name:'wateruses',
		memo:'停水记录',
		alias:'停水记录'		
}

wateruses.Name='wateruses';
wateruses.belongsTo(UserInfo,{as:'UserInfo',foreignKey: 'userID'});
wateruses.belongsTo(CustomInfo,{as:'CustomInfo',foreignKey: 'customID'});
wateruses.validatesPresenceOf('stopReson', 'smsTell',{message: '不能为空！'});

schema.models.wateruses;
module.exports = wateruses;