var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var ConsultCode = schema.define('ConsultCode', {
	ctName:   {type:String,limit:50},
	ctMemo:  {type:String,limit:50}

}, {
    restPath: '/ConsultCode' // tell WebService adapter which path use as API endpoint
});
ConsultCode.autotpl=false;
ConsultCode.cloums={
		ctName:   {name:"咨询类型",input:Inputs.Text,search:true,create:true,table:true},
		ctMemo:    {name:"备注",input:Inputs.Text,search:false,create:true,table:true}
};
ConsultCode.views={
		dir:'crm',
		name:'ConsultCode',
		memo:'咨询类型管理',
		alias:'咨询类型管理'		
		}
ConsultCode.Name='ConsultCode';
ConsultCode.validatesPresenceOf('ctName',{message: '咨询类型不能为空！'});
schema.models.ConsultCode;

module.exports = ConsultCode;