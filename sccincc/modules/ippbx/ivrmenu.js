var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var localnumber=require('./localnumber');
var ivrmenu = schema.define('ivrmenu', {
	ivrnumber:   {type:String,limit:50},
	ivrname:   {type:String,limit:50},
	description:   {type:String,limit:150},
	cretime:   {type: Date,default: function () { return moment().format("YYYY-MM-DD HH:mm:ss");}},
	localnumber:   {type: String,limit:50},
	isreadonly:   {type:Number,default: function () {return 0;}}
	

}, {
    restPath: '/ivrmenu' // tell WebService adapter which path use as API endpoint
});
ivrmenu.autotpl=true;
ivrmenu.cloums={
		ivrnumber:    {name:"IVR号码",input:Inputs.Text,search:true,create:true,table:true},
		ivrname:      {name:"IVR名称",input:Inputs.Text,search:false,create:true,table:true},
		description:  {name:"描述",input:Inputs.Text,search:false,create:true,table:true},
		cretime:      {name:"创建时间",input:Inputs.Text,search:false,create:false,table:true},
		isreadonly:   {name:"系统只读",input:Inputs.Radios,search:false,create:true,table:true,radios:[
			           		                                                                         {checked:' checked="checked"',
			        	                                                                            	 value:1,
			        	                                                                            	 name:'是'} ,
			        	                                                                               {checked:' ',
				        	                                                                            	 value:0,
				        	                                                                            	 name:'否'} 
			        		                                                                         ]},
		localnumber:  {name:"本地号码",input:Inputs.Text,search:false,create:false,table:false}
};
ivrmenu.views={
		dir:'ippbx',
		name:'ivrmenu',
		memo:'IVR菜单',
		alias:'IVR菜单'		
		}
ivrmenu.Name='ivrmenu';
ivrmenu.belongsTo(localnumber,{as:'ln',foreignKey: 'localnumber'});
ivrmenu.validatesPresenceOf('ivrnumber',{message: '号码不能为空！'});
ivrmenu.validatesPresenceOf('ivrname',{message: '名称不能为空！'});

schema.models.ivrmenu;
//schema.automigrate();
module.exports = ivrmenu;