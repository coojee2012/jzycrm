var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var forlostnum = schema.define('forlostnum', {
	extension:   {type:String,limit:50},
	lostnumber:   {type:String,limit:50},
	reback:   {type: String,limit:50, default: function () { return '否'; }},
	certime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss");}},
	backtime:   {type: Date},
	whoback:    {type:String,limit:50}

}, {
    restPath: '/forlostnum' // tell WebService adapter which path use as API endpoint
});
forlostnum.autotpl=true;
forlostnum.cloums={
		extension:   {name:"被叫号码",input:Inputs.Text,search:true,create:true,table:true},
		lostnumber:   {name:"未接号码",input:Inputs.Text,search:true,create:true,table:true},
		reback:   {name:"是否回复",input:Inputs.Text,search:true,create:true,table:true},
		whoback:   {name:"回复分机",input:Inputs.Text,search:true,create:true,table:true},
		backtime:   {name:"回复时间",input:Inputs.Date,search:false,create:true,table:true},
		certime:   {name:"来电时间",input:Inputs.Date,search:false,create:true,table:true}
};
forlostnum.views={
		dir:'ippbx',
		name:'forlostnum',
		memo:'未接来电',
		alias:'未接来电'		
		}
forlostnum.Name='forlostnum';
//forlostnum.validatesPresenceOf('name',{message: '名称不能为空！'});

schema.models.forlostnum;
//schema.automigrate();
module.exports = forlostnum;