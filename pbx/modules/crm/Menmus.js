var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var MenmuGroup=require('./MenmuGroup');
var moment = require('moment');
var Menmus = schema.define('Menmus', {
	menName:   {type:String,limit:50},
	menURL:    {type:String,limit:150},
	iconName:  {type:String,limit:150},
   // mgID:    {type: Number, default: function () { return 0 }},
	crtTime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	width:	{type:Number,default:function () { return 960 }},
	height:	{type:Number,default:function () { return 540 }},
	ordernum:	{type:Number,default:function () { return 0 }}
}, {
    restPath: '/Menmus' // tell WebService adapter which path use as API endpoint
});
Menmus.autotpl=true;
Menmus.cloums={
		menName:   {name:"菜单名称",input:Inputs.Text,search:true,create:true,table:true,checkboxes:[
		                                                                             {checked:' checked=""',
		                                                                            	 value:'',
		                                                                            	 name:''}
		                                                                             ]},
		menURL:    {name:"菜单地址",input:Inputs.Text,search:false,create:true,table:true,radios:[
		                                                                         { checked:' checked=""',
	                                                                               value:'',
	                                                                               name:''} 
		                                                                         ]},
		iconName:  {name:"图标名称",input:Inputs.Text,search:false,create:true,table:true,selects:[
		                                                                          {checked:' selected=""',
		                                                                           value:'',
		                                                                           name:''}     
		                                                                          ]},
	    mgID:      {name:"菜单组",input:Inputs.SelectDB,search:true,create:true,table:true,selectdb:{dbname:'crm/MenmuGroup',key:'id',value:'mgName'}},
		
		width:	   {name:"窗口宽度",input:Inputs.Text,search:false,create:true,table:false},
		height:	   {name:"窗口高度",input:Inputs.Text,search:false,create:true,table:false},
		ordernum:  {name:"窗口排序",input:Inputs.Text,search:false,create:true,table:false},
		crtTime:   {name:"创建时间",input:Inputs.Date,search:false,create:false,table:false}
		
}

Menmus.getgroup=function(){
	MenmuGroup.all(function(err,dbs){
	if(err){
		return [];
	}
	else{
		var res=[];
		dbs.forEach(function(item){
		console.log(item);
		var tmoobj={};
		tmoobj["checked"]='';
		tmoobj["value"]=item.id;
		tmoobj["name"]=item.mgName;
		if(tmoobj!=null)
		res.push(tmoobj);
		})	;
		
		return [];
	}
	});	
};
Menmus.views={
dir:'crm',
name:'Menmus',
memo:'管理和设置系统菜单',
alias:'菜单'		
}
Menmus.Name='Menmus';
Menmus.belongsTo(MenmuGroup,{as:'MenmuGroup',foreignKey: 'mgID'});

Menmus.validatesPresenceOf('menName', 'menURL');
//Menmus.validatesLengthOf('uPass', {min: 8, message: {min: '密码不能少于8位'}});
//UserInfo.validatesInclusionOf('uSex', {in: ['男', '女']});
//UserInfo.validatesExclusionOf('domain', {in: ['www', 'billing', 'admin']});
Menmus.validatesNumericalityOf('ordernum', {int: true});
//UserInfo.validatesUniquenessOf('email', {message: 'email is not unique'});

schema.models.Menmus;
schema.isActual(function(err, actual) {
    if (!actual) {
        schema.autoupdate();
    }
});
module.exports = Menmus;