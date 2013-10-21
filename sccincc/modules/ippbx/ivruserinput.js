var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var ivrmenu=require('./ivrmenu');
var userinputs=[{checked:' selected="selected"',value:'0',name:'0'},
                {checked:'',value:'1',name:'1'},
                {checked:'',value:'2',name:'2'},
                {checked:'',value:'3',name:'3'},
                {checked:'',value:'4',name:'4'},
                {checked:'',value:'5',name:'5'},
                {checked:'',value:'6',name:'6'},
                {checked:'',value:'7',name:'7'},
                {checked:'',value:'8',name:'8'},
                {checked:'',value:'9',name:'9'},
                {checked:'',value:'*',name:'*'}
                  ];
var ivruserinput = schema.define('ivruserinput', {
	ivrnumber:   {type:String,limit:50},
	general:   {type:Number,default: function () {return 0;}},
	general_type:   {type:String,limit:50},
	general_args:   {type:String,limit:150},
	input:   {type: String,limit:10},
	gotoivrnumber:   {type: String,limit:50},
	gotoivractid:   {type: String,limit:50}
	

}, {
    restPath: '/ivruserinput' // tell WebService adapter which path use as API endpoint
});
ivruserinput.autotpl=true;
ivruserinput.cloums={
		ivrnumber:    {name:"IVR号码",input:Inputs.Text,search:true,create:true,table:true},
		input:      {name:"用户输入",input:Inputs.Selects,search:false,create:true,table:true,selects:userinputs},
		general_type:  {name:"只读类型",input:Inputs.Text,search:false,create:true,table:true},
		general_args:      {name:"只读参数",input:Inputs.Text,search:false,create:true,table:true},
		general:   {name:"系统只读",input:Inputs.Radios,search:false,create:true,table:true,radios:[
			           		                                                                         {checked:' checked="checked"',
			        	                                                                            	 value:1,
			        	                                                                            	 name:'是'} ,
			        	                                                                               {checked:' ',
				        	                                                                            	 value:0,
				        	                                                                            	 name:'否'} 
			        		                                                                         ]},
	  gotoivrnumber:  {name:"跳转IVR",input:Inputs.Text,search:false,create:true,table:true,selectdb:{dbname:'ippbx/ivrmenu',key:'ivrnumber',value:'ivrname'}},
	  gotoivractid:  {name:"跳转action",input:Inputs.Text,search:false,create:true,table:true}
};
ivruserinput.views={
		dir:'ippbx',
		name:'ivruserinput',
		memo:'IVR输入',
		alias:'IVR输入'		
		}
ivruserinput.Name='ivruserinput';
//ivruserinput.belongsTo(localnumber,{as:'localnumber',foreignKey: 'localnumber'});
ivruserinput.validatesPresenceOf('ivrnumber',{message: '号码不能为空！'});
ivruserinput.validatesInclusionOf('input', {in: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*']},{message: '输入字符不合法！'});

schema.models.ivruserinput;
//schema.automigrate();
module.exports = ivruserinput;