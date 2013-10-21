var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var actionmodes = schema.define('actionmodes', {
	name:   {type:String,limit:50},
	url:   {type:String,limit:100},
	iconame:   {type:String,limit:50},
	memo:    {type:String,limit:200}

}, {
    restPath: '/actionmodes' // tell WebService adapter which path use as API endpoint
});
actionmodes.autotpl=true;
actionmodes.cloums={
		name:   {name:"动作名称",input:Inputs.Text,search:true,create:true,table:true},
		url:   {name:"URL地址",input:Inputs.Text,search:true,create:true,table:true},
		iconame:   {name:"图标名称",input:Inputs.Text,search:true,create:true,table:true},
		memo:    {name:"备注",input:Inputs.Text,search:false,create:true,table:true}
};
actionmodes.views={
		dir:'ippbx',
		name:'actionmodes',
		memo:'IVR动作类型',
		alias:'IVR动作类型'		
		}
actionmodes.Name='actionmodes';
actionmodes.validatesPresenceOf('name',{message: '名称不能为空！'});

schema.models.actionmodes;
//schema.automigrate();
/*schema.isActual(function(err, actual) {
    if (!actual) {
        schema.autoupdate();
    }
});*/
module.exports = actionmodes;