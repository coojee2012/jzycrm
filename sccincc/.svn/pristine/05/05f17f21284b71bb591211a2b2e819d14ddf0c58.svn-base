var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var yesornot=[{checked:' selected="selected"',value:0,name:'否'} ,{checked:' ',value:1,name:'是'}];
var processmode=[{checked:' selected="selected"',value:1,name:'本地处理'} ,{checked:' ',value:2,name:'拨打外线'} ,{checked:' ',value:0,name:'黑名单'}];
var proto=[{checked:' selected="selected"',value:'sip',name:'SIP外线'} ,
               {checked:' ',value:'iax',name:'IAX2外线'},
               {checked:' ',value:'fxo',name:'FXO外线'},
               {checked:' ',value:'pri',name:'PRI外线'},
               {checked:' ',value:'custom',name:'自定义'}
];
var trunk = schema.define('trunk', {
	
	trunkname:   {type:String,limit:50},
	trunkproto:   {type:String,limit:50},
	trunkprototype:  {type:String,limit:50},
	trunkdevice:{type:String,limit:50},
	trunkremark: {type:String,limit:100},
	cretime:     {type: Date, default: function () {return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	args:    {type:String,limit:100}

}, {
    restPath: '/trunk' // tell WebService adapter which path use as API endpoint
});
trunk.autotpl=true;
trunk.cloums={
		
		trunkname:   {name:"线路名称",input:Inputs.Text,search:false,create:false,table:true},
		trunkproto:   {name:"线路协议",input:Inputs.Selects,search:true,create:true,table:true,selects:proto},
		trunkprototype:   {name:"设备类型",input:Inputs.Text,search:false,create:false,table:true},
		trunkdevice:   {name:"线路设备",input:Inputs.Text,search:true,create:true,table:true},
		trunkremark:   {name:"线路备注",input:Inputs.Text,search:false,create:true,table:true},
		cretime: {name:"创建时间",input:Inputs.Date,search:false,create:true,table:true},
		args:    {name:"线路参数",input:Inputs.Text,search:false,create:true,table:true}
		

};
trunk.views={
		dir:'ippbx',
		name:'trunk',
		memo:'系统外线',
		alias:'系统外线'		
		}
trunk.Name='trunk';
//trunk.belongsTo(localnumber,{as:'localnumber',foreignKey: 'localnumber'});
trunk.validatesPresenceOf('trunkname',{message: '线路名称不能为空！'});


schema.models.trunk;
//schema.automigrate();
module.exports = trunk;