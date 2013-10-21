var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var ComplaintCode = schema.define('ComplaintCode', {
	CodeName:   {type:String,limit:50},
	ParentID:   {type:Number,default:function () { return 0 }},
	Sequence:   {type:Number}

}, {
    restPath: '/ComplaintCode' // tell WebService adapter which path use as API endpoint
});
ComplaintCode.autotpl=false;
ComplaintCode.cloums={
		CodeName:   {name:"分类名称",input:Inputs.Text,search:true,create:true,table:true},
		ParentID:   {name:"上级分类",input:Inputs.SelectDB,search:true,create:true,table:true,selectdb:{dbname:'crm/FaqCode',key:'id',value:'CodeName'}},
		Sequence:    {name:"排序",input:Inputs.Text,search:true,create:true,table:true}

};
ComplaintCode.views={
		dir:'crm',
		name:'ComplaintCode',
		memo:'咨询建议类型管理',
		alias:'咨询建议类型管理'		
		}
ComplaintCode.Name='ComplaintCode';
ComplaintCode.validatesPresenceOf('CodeName',{message: '分类名称不能为空！'});
schema.models.ComplaintCode;
schema.isActual(function(err, actual) {
    if (!actual) {
        schema.autoupdate();
    }
});
module.exports = ComplaintCode;