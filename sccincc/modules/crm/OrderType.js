var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var OrderType = schema.define('OrderType', {
	typeName:   {type:String,limit:50}

}, {
    restPath: '/OrderType' // tell WebService adapter which path use as API endpoint
});
OrderType.autotpl=false;
OrderType.cloums={
		typeName:   {name:"工单类别",input:Inputs.Text,search:true,create:true,table:true},
		
};
OrderType.views={
		dir:'crm',
		name:'OrderType',
		memo:'工单类别',
		alias:'工单类别'		
		}
OrderType.Name='OrderType';
//OrderType.hasMany(UserInfo);
OrderType.validatesPresenceOf('typeName',{message: '工单类别不能为空！'});

schema.models.OrderType;

module.exports = OrderType;