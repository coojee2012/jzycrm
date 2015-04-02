var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var callsession = schema.define('callsession', {
	//id:{type:String,limit:50},
	accountcode:   {type:String,limit:50},
	callernumber:   {type:String,limit:50},
	extension:   {type:String,limit:50},
	routerline:   {type: Number, default: function () { return 0 }},
	cretime:   {type: Date, default: function () {return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	hanguptime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
    ishangup:{type:String,limit:10,default:'yes'},
	frist_cdruniqueid:    {type:String,limit:50}

}, {
    restPath: '/callsession' // tell WebService adapter which path use as API endpoint
});
callsession.autotpl=true;
callsession.cloums={
		accountcode:   {name:"呼叫帐号",input:Inputs.Text,search:true,create:false,table:true},
		callernumber:   {name:"主叫号码",input:Inputs.Text,search:true,create:false,table:true},
		extension:   {name:"分机号",input:Inputs.Text,search:true,create:false,table:true},
		routerline:   {name:"呼叫方向",input:Inputs.Selects,search:true,create:false,table:true,selects:[
		         		                                                                           {checked:' selected="selected"',
		      		                                                                            	 value:1,
		      		                                                                            	 name:'呼入'},
		      		                                                                           {checked:'',
		      			                                                                       value:2,
		      			                                                                       name:'呼出'}
		      		                                                                             ]},
		
		cretime:   {name:"呼叫时间",input:Inputs.Date,search:false,create:false,table:true},
		hanguptime:   {name:"挂机时间",input:Inputs.Date,search:false,create:false,table:true},
		frist_cdruniqueid:    {name:"关联编号",input:Inputs.Text,search:false,create:false,table:false}
};
callsession.views={
		dir:'ippbx',
		name:'callsession',
		memo:'通话记录',
		alias:'通话记录'		
		}
callsession.Name='callsession';
//callsession.validatesPresenceOf('name',{message: '名称不能为空！'});

schema.models.callsession;
//schema.automigrate();
module.exports = callsession;