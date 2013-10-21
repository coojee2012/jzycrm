var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var actionmodes=require('./actionmodes');
var ivraction = schema.define('ivraction', {
	ivrnumber:   {type:String,limit:50},
	ordinal:   {type:Number,default:function(){return 1;}},
	//actmode:   {type: Number,default:function(){return 1;}},
	args:   {type:String,limit:256}
	

}, {
    restPath: '/ivraction' // tell WebService adapter which path use as API endpoint
});
ivraction.autotpl=true;
ivraction.cloums={
		ivrnumber:   {name:"IVR号码",input:Inputs.Text,search:true,create:true,table:true,selectdb:{dbname:'ippbx/ivrmenu',key:'ivrnumber',value:'ivrname'}},
		ordinal:     {name:"执行编号",input:Inputs.Text,search:true,create:true,table:true},
		actmode:     {name:"执行动作",input:Inputs.SelectDB,search:true,create:true,table:true,selectdb:{dbname:'ippbx/actionmodes',key:'id',value:'name'}},
		args:        {name:"执行参数",input:Inputs.Text,search:true,create:true,table:true}
};
ivraction.views={
		dir:'ippbx',
		name:'ivraction',
		memo:'IVR执行',
		alias:'IVR执行'		
		}
ivraction.Name='ivraction';
ivraction.belongsTo(actionmodes,{as:'actionmodes',foreignKey: 'actmode'});
ivraction.validatesPresenceOf('ivrnumber',{message: 'IVR号码不能为空！'});

schema.models.ivraction;
//schema.automigrate();
module.exports = ivraction;