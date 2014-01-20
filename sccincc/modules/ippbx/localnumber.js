var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var localnumber = schema.define('localnumber', {
	number:   {type:String,limit:50},
	"typeof":   {type:String,limit:50},
	assign:   {type: String,limit:100}
	

}, {
    restPath: '/localnumber' // tell WebService adapter which path use as API endpoint
});
localnumber.autotpl=true;
localnumber.cloums={
		number:   {name:"号码",input:Inputs.Text,search:true,create:true,table:true},
		"typeof":   {name:"类型",input:Inputs.Text,search:false,create:true,table:true},
		assign:   {name:"标识",input:Inputs.Text,search:false,create:true,table:true}
};
localnumber.views={
		dir:'ippbx',
		name:'localnumber',
		memo:'本地号码',
		alias:'本地号码'		
		}
localnumber.Name='localnumber';
//localnumber.validatesPresenceOf('name',{message: '名称不能为空！'});

schema.models.localnumber;
//schema.automigrate();
module.exports = localnumber;