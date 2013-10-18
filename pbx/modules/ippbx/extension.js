var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var localnumber=require('./localnumber');
var extension = schema.define('extension', {
	cretime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	accountcode:   {type:String,limit:50,index: true,unique:true},
	
	password:   {type:String,limit:50},
	deviceproto:   {type:String,limit:50},
	devicenumber:{type:String,limit:50},
	devicestring:  {type:String,limit:50},
	fristchecked:   {type:Number,default: function () { return 0 }},
	transfernumber:    {type:String,limit:50},
	dndinfo:    {type:String,limit:50,default: function () { return 'off'; }},
	diallocal_failed:    {type:String,limit:50,default: function () { return 'dodefault' }},
	infoname:     {type:String,limit:50},
	infoemail:    {type:String,limit:50},
	infodetail:   {type:String,limit:50},
	inforemark:   {type:String,limit:50},
	doymicaccount: {type:String,limit:50}
	//localnumber:   {type:String,limit:50}

}, {
    restPath: '/extension' // tell WebService adapter which path use as API endpoint
});
extension.autotpl=true;
extension.cloums={
		
		accountcode:   {name:"分机号码",input:Inputs.Text,search:true,create:true,table:true},
		password:   {name:"注册密码",input:Inputs.Passwd,search:false,create:true,table:false},
		deviceproto:   {name:"注册协议",input:Inputs.Selects,search:true,create:true,table:true,
			selects:[
		         {checked:' selected="selected"',
		     	  value:'SIP',
		     	  name:'SIP协议'} ,
		     	 {checked:' ',
			     value:'IAX2',
			     name:'IAX2协议'},
			     {checked:' ',
				 value:'DAHADI',
				 name:'座席卡'}
		     	]},
		devicenumber:   {name:"设备号码",input:Inputs.Text,search:false,create:true,table:true},
		devicestring:   {name:"设备字符",input:Inputs.Text,search:false,create:true,table:true},
		fristchecked:   {name:"首次验证",input:Inputs.Selects,search:false,create:false,table:true,selects:[
	   		          		                                                                          {checked:' selected="selected"',
		 		     		                                                                            	 value:0,
		 		     		                                                                            	 name:'否'} ,
		 		     		                                                                              {checked:' ',
		 			     		                                                                            	 value:1,
		 			     		                                                                            	 name:'已验证'}
		 		     		                                                                          ]},
		transfernumber:    {name:"呼转号码",input:Inputs.Text,search:false,create:true,table:true},
		dndinfo:    {name:"分机示忙",input:Inputs.Text,search:false,create:false,table:true},
		diallocal_failed:    {name:"失败处理",input:Inputs.Selects,search:false,create:true,table:true,selects:[
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
		infoname:    {name:"分机名称",input:Inputs.Text,search:false,create:false,table:false},
		infoemail:    {name:"电子邮件",input:Inputs.Text,search:false,create:false,table:false},
		infodetail:    {name:"详细信息",input:Inputs.Text,search:false,create:false,table:false},
		inforemark:    {name:"信息备注",input:Inputs.Text,search:false,create:false,table:false},
		doymicaccount:    {name:"动态帐号",input:Inputs.Text,search:false,create:false,table:false},
		cretime:   {name:"创建时间",input:Inputs.Date,search:false,create:false,table:true},
		localnumber:    {name:"本地号码",input:Inputs.Text,search:false,create:false,table:false}

};
extension.views={
		dir:'ippbx',
		name:'extension',
		memo:'系统分机',
		alias:'系统分机'		
		}
extension.Name='extension';
extension.belongsTo(localnumber,{as:'lc',foreignKey: 'localnumber'});
extension.validatesPresenceOf('accountcode',{message: '分机号不能为空！'});
extension.validatesLengthOf('password', {min: 4, message: {min: '密码不能少于4位'}});
/*extension.validateAsync('accountcode',function(err){
	err();
	extension.findOne({where:{accountcode:this.accountcode}},function(e,db){
	if(db!=null)
		err();
	});
	
	}, {message:'号码重复'});*/

schema.models.extension;
//schema.automigrate();
schema.isActual(function(err, actual) {
    if (!actual) {
        schema.autoupdate();
    }
});
module.exports = extension;