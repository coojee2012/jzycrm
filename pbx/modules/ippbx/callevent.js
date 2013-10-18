var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var callevent = schema.define('callevent', {
	extensionnumber:   {type:String,limit:50},
	callernumber:   {type:String,limit:50},
	callednumber:   {type:String,limit:50},
	uid:   {type:String,limit:50},
	callid:   {type:String,limit:100},
	creattime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	status:   {type:String,limit:10},
	routerdype:   {type:Number,default:function () { return 0 }},
	parked:   {type:String,limit:50},
	poptype:    {type:String,limit:50}

}, {
    restPath: '/callevent' // tell WebService adapter which path use as API endpoint
});
callevent.autotpl=true;
callevent.cloums={
		extensionnumber:   {name:"分机号",input:Inputs.Text,search:true,create:true,table:true},
		callernumber:   {name:"主角号码",input:Inputs.Text,search:true,create:true,table:true},
		callednumber:   {name:"被叫号码",input:Inputs.Text,search:true,create:true,table:true},
		uid:   {name:"呼叫编号",input:Inputs.Text,search:true,create:true,table:true},
		callid:   {name:"呼叫ID",input:Inputs.Text,search:true,create:true,table:true},
		creattime:   {name:"呼叫时间",input:Inputs.Date,search:true,create:true,table:true},
		status:   {name:"状态",input:Inputs.Selects,search:true,create:true,table:true,selects:[
		                                                                           {checked:' selected="selected"',
		                                                                            	 value:'wait',
		                                                                            	 name:'未弹出'},
		                                                                           {checked:'',
			                                                                       value:'over',
			                                                                       name:'已弹出'}
		                                                                             ]},
		routerdype:   {name:"线路类型",input:Inputs.Selects,search:true,create:true,table:true,selects:[
		                                                                           {checked:' selected="selected"',
		                                                                            	 value:1,
		                                                                            	 name:'外线'},
		                                                                           {checked:'',
			                                                                       value:2,
			                                                                       name:'内线'}
		                                                                             ]},
		parked:   {name:"保持状态",input:Inputs.Text,search:true,create:true,table:true},
		poptype:    {name:"弹出类型",input:Inputs.Text,search:false,create:true,table:true}
};
callevent.views={
		dir:'ippbx',
		name:'callevent',
		memo:'来电事件',
		alias:'来电事件'		
		}
callevent.Name='callevent';
//callevent.validatesPresenceOf('name',{message: '名称不能为空！'});

schema.models.callevent;
//schema.automigrate();
module.exports = callevent;