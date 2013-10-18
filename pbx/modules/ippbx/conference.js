var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var conference = schema.define('conference', {
	cretime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	confno:   {type:String,limit:50},
	pincode:   {type:String,limit:50},
	playwhenevent:   {type: Number, default: function () { return 0 }},
	mohwhenonlyone:   {type: Number, default: function () { return 0 }}

}, {
    restPath: '/conference' // tell WebService adapter which path use as API endpoint
});
conference.autotpl=true;
conference.cloums={
		cretime:   {name:"创建时间",input:Inputs.Date,search:false,create:false,table:true},
		confno:   {name:"会议号码",input:Inputs.Text,search:true,create:true,table:true},
		pincode:   {name:"会议密码",input:Inputs.Passwd,search:false,create:true,table:true},
		playwhenevent:   {name:"静音模式",input:Inputs.Radios,search:false,create:true,table:true,radios:[
		           		                                                                         {checked:' checked="checked"',
		        	                                                                            	 value:1,
		        	                                                                            	 name:'是'} ,
		        	                                                                               {checked:' ',
			        	                                                                            	 value:0,
			        	                                                                            	 name:'否'} 
		        		                                                                         ]},
		mohwhenonlyone:   {name:"背景播放",input:Inputs.Radios,search:false,create:true,table:true,radios:[
			           		                                                                         {checked:' checked="checked"',
			        	                                                                            	 value:1,
			        	                                                                            	 name:'是'} ,
			        	                                                                               {checked:' ',
				        	                                                                            	 value:0,
				        	                                                                            	 name:'否'} 
			        		                                                                         ]}
};
conference.views={
		dir:'ippbx',
		name:'conference',
		memo:'电话会议室',
		alias:'电话会议室'		
		}
conference.Name='conference';
//conference.validatesPresenceOf('name',{message: '名称不能为空！'});

schema.models.conference;
//schema.automigrate();
module.exports = conference;