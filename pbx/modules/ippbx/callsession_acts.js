var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var callsession_acts = schema.define('callsession_acts', {
	actid:   {type:String,limit:50},
	callsessionid:   {type:String,limit:50},
	cdruniqueid:   {type:String,limit:50},
	acttime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss");}},
	"function":   {type:String,limit:50},
	var0key:   {type:String,limit:50},
	var0value:   {type:String,limit:50},
	var1key:   {type:String,limit:50},
	var1value:   {type:String,limit:50},
	var2key:   {type:String,limit:50},
	var2value:   {type:String,limit:50},
	var3key:   {type:String,limit:50},
	var3value:   {type:String,limit:50},

	extradata:    {type:String,limit:50}

}, {
    restPath: '/callsession_acts' // tell WebService adapter which path use as API endpoint
});
callsession_acts.autotpl=true;
callsession_acts.cloums={
		actid:   {name:"记录编号",input:Inputs.Text,search:true,create:true,table:true},
		callsessionid:   {name:"会话编号",input:Inputs.Text,search:true,create:true,table:true},
		cdruniqueid:   {name:"CDR编号",input:Inputs.Text,search:true,create:true,table:true},
		acttime:   {name:"发生时间",input:Inputs.Date,search:true,create:true,table:true},		
		func_tion:   {name:"执行方法",input:Inputs.Text,search:true,create:true,table:true},
		var0key:   {name:"第一变量键",input:Inputs.Text,search:true,create:true,table:true},
		var0value:  {name:"第一变量值",input:Inputs.Text,search:true,create:true,table:true},
		var1key:   {name:"第二变量键",input:Inputs.Text,search:true,create:true,table:true},
		var1value:  {name:"第二变量值",input:Inputs.Text,search:true,create:true,table:true},
		var2key:   {name:"第三变量键",input:Inputs.Text,search:true,create:true,table:true},
		var2value:  {name:"第三变量值",input:Inputs.Text,search:true,create:true,table:true},
		var3key:   {name:"第四变量键",input:Inputs.Text,search:true,create:true,table:true},
		var3value:  {name:"第四变量值",input:Inputs.Text,search:true,create:true,table:true},

		extradata:    {name:"其他数据",input:Inputs.Text,search:true,create:true,table:true}
};
callsession_acts.views={
		dir:'ippbx',
		name:'callsession_acts',
		memo:'呼叫动作记录',
		alias:'呼叫动作记录'		
		}
callsession_acts.Name='callsession_acts';
//callsession_acts.validatesPresenceOf('name',{message: '名称不能为空！'});

schema.models.callsession_acts;
//schema.automigrate();
module.exports = callsession_acts;