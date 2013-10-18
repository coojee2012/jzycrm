var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var AreaCodeTown = schema.define('AreaCodeTown', {
	TownName:   {type:String,limit:50},
	ParentID:   {type:Number,default:function () { return 0 }},
	Sequence:   {type:Number}

}, {
    restPath: '/AreaCodeTown' // tell WebService adapter which path use as API endpoint
});
AreaCodeTown.autotpl=true;
AreaCodeTown.cloums={
		TownName:   {name:"镇（乡）名称",input:Inputs.Text,search:true,create:true,table:true},
		ParentID:   {name:"上级行政",input:Inputs.Hidden,search:false,create:false,table:false},
		Sequence:    {name:"排序",input:Inputs.Text,search:true,create:true,table:true}
};
AreaCodeTown.views={
		dir:'crm',
		name:'AreaCodeTown',
		memo:'行政镇（乡）',
		alias:'行政镇（乡）'		
		}
AreaCodeTown.Name='AreaCodeTown';
//AreaCodeTown.belongsTo(AreaCodeTown,{as:'AreaCodeTown',foreignKey: 'ParentID'});
AreaCodeTown.validatesPresenceOf('TownName',{message: '行政名称不能为空！'});

schema.models.AreaCodeTown;
schema.isActual(function(err, actual) {
    if (!actual) {
        schema.autoupdate();
    }
});
module.exports = AreaCodeTown;