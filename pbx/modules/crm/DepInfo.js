var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var UserInfo=require('./UserInfo');
var moment = require('moment');
var DepInfo = schema.define('DepInfo', {
	depName:   {type:String,limit:50},
	memo:    {type:String,limit:200}

}, {
    restPath: '/DepInfo' // tell WebService adapter which path use as API endpoint
});
DepInfo.autotpl=false;
DepInfo.cloums={
		depName:   {name:"部门名称",input:Inputs.Text,search:true,create:true,table:true},
		memo:    {name:"备注",input:Inputs.Text,search:true,create:true,table:true}
};
DepInfo.views={
		dir:'crm',
		name:'DepInfo',
		memo:'管理和设置部门信息',
		alias:'部门信息'		
		}
DepInfo.Name='DepInfo';
//DepInfo.hasMany(UserInfo);
DepInfo.validatesPresenceOf('depName',{message: '部门名称不能为空！'});

schema.models.DepInfo;

module.exports = DepInfo;