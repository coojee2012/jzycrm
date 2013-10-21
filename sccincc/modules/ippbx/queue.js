var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var localnumber=require('./localnumber');
var yesornot=[{checked:' selected="selected"',value:0,name:'否'} ,{checked:' ',value:1,name:'是'}];
var strategys=[{checked:' selected="selected"',value:'rrmemory',name:'记忆轮巡'} ,
               {checked:' ',value:'ringall',name:'坐席全呼'},
               {checked:' ',value:'roundrobin',name:'轮流呼叫'},
               {checked:' ',value:'leastrecent',name:'最近接听最少'},
               {checked:' ',value:'fewestcalls',name:'完成呼叫最少'},
               {checked:' ',value:'random',name:'随机'}
];
var queue = schema.define('queue', {
	cretime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss");}},
	queuenumber:   {type:String,limit:50},
	queuename:   {type:String,limit:50},
	announce:   {type:String,limit:50},
	playring:{type:Number,default: function () { return 0 }},
	saymember:  {type:Number,default: function () { return 0 }},
	queuetimeout:   {type:Number,default: function () { return 0 }},
	failedon:    {type:String,limit:50},
	members:    {type:String,limit:200},
	strategy:    {type:String,limit:50},
	wrapuptime:     {type:Number,default: function () { return 0 }},
	timeout:    {type:Number,default: function () { return 0 }},
	musicclass:   {type:String,limit:50},
	retry:   {type:Number,default: function () { return 0 }},
	joinempty: {type:String,limit:50},
	frequency:{type:Number,default: function () { return 0 }},
	localnumber:   {type:String,limit:50}

}, {
    restPath: '/queue' // tell WebService adapter which path use as API endpoint
});
queue.autotpl=true;
queue.cloums={
		cretime:   {name:"创建时间",input:Inputs.Date,search:false,create:false,table:true},
		queuenumber:   {name:"队列号码",input:Inputs.Text,search:true,create:true,table:true},
		queuename:   {name:"队列名称",input:Inputs.Text,search:true,create:true,table:true},
		announce:   {name:"语音通知",input:Inputs.Radios,search:false,create:true,table:true,radios:yesornot},
		playring:   {name:"背景音乐",input:Inputs.Radios,search:false,create:true,table:true,radios:yesornot},
		saymember:   {name:"播放工号",input:Inputs.Radios,search:false,create:true,table:true,radios:yesornot},
		queuetimeout: {name:"等待超时",input:Inputs.Text,search:false,create:true,table:true},
		failedon:    {name:"失败处理",input:Inputs.Text,search:false,create:true,table:true},
		members:    {name:"队列成员",input:Inputs.Selects,search:false,create:true,table:true,selects:[
		   		          		                                                                          {checked:' selected="selected"',
		 		     		                                                                            	 value:'dodefault',
		 		     		                                                                            	 name:'系统默认'} ,
		 		     		                                                                              {checked:' ',
		 			     		                                                                            	 value:'ivr',
		 			     		                                                                            	 name:'跳转自动语音'},
		 			     		                                                                          {checked:' ',
		 				     		                                                                            	 value:'voicemail',
		 				     		                                                                            	 name:'语音留言'}
		 		     		                                                                          ]},
		strategy:    {name:"振铃策略",input:Inputs.Selects,search:false,create:true,table:true,selects:strategys},
		wrapuptime:    {name:"循环通知",input:Inputs.Text,search:false,create:true,table:true},
		timeout:    {name:"呼叫超时",input:Inputs.Text,search:false,create:true,table:true},
		musicclass:    {name:"背景音乐",input:Inputs.Text,search:false,create:true,table:true},
		retry:    {name:"呼叫重试",input:Inputs.Text,search:false,create:true,table:true},
		joinempty: {name:"加入空队列",input:Inputs.Radios,search:false,create:true,table:true,radios:yesornot},
		frequency:{name:"通知频率",input:Inputs.Text,search:false,create:true,table:true},
		localnumber:    {tname:"本地号码",input:Inputs.Text,search:false,create:false,table:false}

};
queue.views={
		dir:'ippbx',
		name:'queue',
		memo:'系统分机',
		alias:'系统分机'		
		}
queue.Name='queue';
queue.belongsTo(localnumber,{as:'ln',foreignKey: 'localnumber'});
queue.validatesPresenceOf('accountcode',{message: '分机号不能为空！'});
queue.validatesLengthOf('password', {min: 4, message: {min: '不能少于4位'}});

schema.models.queue;
//schema.automigrate();
module.exports = queue;