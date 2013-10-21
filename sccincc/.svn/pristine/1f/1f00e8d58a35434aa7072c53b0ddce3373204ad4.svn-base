var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var checkservice = schema.define('checkservice', {
	agtnum:   {type:String,limit:50},
	point:   {type:String,limit:50},
	cdrid:   {type:String,limit:50},
	crttime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }}

}, {
    restPath: '/checkservice' // tell WebService adapter which path use as API endpoint
});
checkservice.autotpl=true;
checkservice.cloums={
		agtnum:   {name:"分机号",input:Inputs.Text,search:true,create:true,table:true},
		point:   {name:"主角号码",input:Inputs.Text,search:true,create:true,table:true},
		cdrid:   {name:"呼叫编号",input:Inputs.Text,search:true,create:true,table:true},
		crttime:   {name:"呼叫时间",input:Inputs.Date,search:true,create:true,table:true}
};
checkservice.views={
		dir:'ippbx',
		name:'checkservice',
		memo:'座席评分',
		alias:'座席评分'		
		}
checkservice.Name='checkservice';


schema.models.checkservice;

module.exports = checkservice;