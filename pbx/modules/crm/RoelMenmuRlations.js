var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var UserRole=require('./UserRole');
var Menmus=require('./Menmus');
var RoelMenmuRlations = schema.define('RoelMenmuRlations', {
	//roleID:   {type:Number},
	//menmuID:    {type:Number},
	isUse:	{type:Number,default:function () { return 0 }}
}, {
    restPath: '/RoelMenmuRlationss' // tell WebService adapter which path use as API endpoint
});


RoelMenmuRlations.autotpl=false;
RoelMenmuRlations.cloums={		
		roleID:   {name:"操作角色",input:Inputs.SelectDB,search:true,create:true,table:true,selectdb:{dbname:'crm/UserRole',key:'id',value:'roleName'}},
		menmuID:    {name:"菜单名称",input:Inputs.SelectDB,search:true,create:true,table:true,selectdb:{dbname:'crm/Menmus',key:'id',value:'menName'}},
		isUse:	{name:"是否可用",input:Inputs.Selects,search:true,table:true,create:true,selects:[
		        	                                                      
		        	                                                    	  {checked:' selected="selected"',
	                                                                            	 value:1,
	                                                                            	 name:'是'},
	                                                                           {checked:'',
		                                                                       value:0,
		                                                                       name:'否'}     	 
		        	                                                      
		        	                                                      ]}		
};
RoelMenmuRlations.views={
		dir:'crm',
		name:'RoelMenmuRlations',
		memo:'角色菜单管理',
		alias:'角色菜单管理'		
		}
RoelMenmuRlations.Name='RoelMenmuRlations';
RoelMenmuRlations.belongsTo(Menmus,{as:'Menmus',foreignKey: 'menmuID'});
RoelMenmuRlations.belongsTo(UserRole,{as:'UserRole',foreignKey: 'roleID'});
//RoelMenmuRlations.validatesPresenceOf('mgName');
//RoelMenmuRlations.validatesLengthOf('uPass', {min: 8, message: {min: '密码不能少于8位'}});
//RoelMenmuRlations.validatesInclusionOf('uSex', {in: ['男', '女']});
//RoelMenmuRlations.validatesExclusionOf('domain', {in: ['www', 'billing', 'admin']});
//RoelMenmuRlations.validatesNumericalityOf('mgType', {int: true});
//RoelMenmuRlations.validatesUniquenessOf('email', {message: 'email is not unique'});

schema.models.RoelMenmuRlations;

module.exports = RoelMenmuRlations;