var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var FaqCode = schema.define('FaqCode', {
	CodeName:   {type:String,limit:50},
	ParentID:   {type:Number,default:function () { return 0;}},
	Sequence:   {type:Number}

}, {
    restPath: '/FaqCode' // tell WebService adapter which path use as API endpoint
});
FaqCode.autotpl=false;
FaqCode.cloums={
		CodeName:   {name:"分类名称",input:Inputs.Text,search:true,create:true,table:true},
		ParentID:   {name:"上级分类",input:Inputs.Text,search:true,create:true,table:true,selectdb:{dbname:'crm/FaqCode',key:'id',value:'CodeName'}},
		Sequence:    {name:"排序",input:Inputs.Text,search:true,create:true,table:true}
};
FaqCode.views={
		dir:'crm',
		name:'FaqCode',
		memo:'知识库分类管理',
		alias:'知识库分类管理'		
		}
FaqCode.Name='FaqCode';

FaqCode.validatesPresenceOf('CodeName',{message: '分类名称不能为空！'});

schema.models.FaqCode;

module.exports = FaqCode;