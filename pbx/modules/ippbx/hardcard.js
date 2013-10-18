var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var hardcard = schema.define('hardcard', {
	linenumber:   {type:Number},
	lineproto:   {type:String,limit:50,default: function () { return 'PRI'; }},
	linedriver:   {type: String,limit:50, default: function () { return 'DAHDI'; }},
	linegroup:   {type: Number}
	

}, {
    restPath: '/hardcard' // tell WebService adapter which path use as API endpoint
});
hardcard.autotpl=true;
hardcard.cloums={
		linenumber:   {name:"线路编号",input:Inputs.Text,search:true,create:true,table:true},
		lineproto:   {name:"线路协议",input:Inputs.Text,search:true,create:true,table:true},
		linedriver:   {name:"线路驱动",input:Inputs.Text,search:true,create:true,table:true},
		linegroup:   {name:"线路分组",input:Inputs.Text,search:true,create:true,table:true}
};
hardcard.views={
		dir:'ippbx',
		name:'hardcard',
		memo:'外线语音卡',
		alias:'外线语音卡'		
		}
hardcard.Name='hardcard';
//hardcard.validatesPresenceOf('name',{message: '名称不能为空！'});

schema.models.hardcard;
//schema.automigrate();
module.exports = hardcard;