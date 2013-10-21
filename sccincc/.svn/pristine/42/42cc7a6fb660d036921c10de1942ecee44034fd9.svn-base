var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var AreaCodeTown=require('./AreaCodeTown');
var AreaCode = schema.define('AreaCode', {
	AreaName:   {type:String,limit:50},
	//ParentID:   {type:Number,default:function () { return 0 }},
	Sequence:   {type:Number}

}, {
    restPath: '/AreaCode' // tell WebService adapter which path use as API endpoint
});
AreaCode.autotpl=true;
AreaCode.cloums={
		AreaName:   {name:"街道/社区名称",input:Inputs.Text,search:true,create:true,table:true},
		ParentID:   {name:"上级行政",input:Inputs.SelectDB,search:true,create:true,table:true,selectdb:{dbname:'crm/AreaCodeTown',key:'id',value:'TownName'}},
		Sequence:    {name:"排序",input:Inputs.Text,search:true,create:true,table:true}
};
AreaCode.views={
		dir:'crm',
		name:'AreaCode',
		memo:'街道/社区',
		alias:'街道/社区'		
		}
AreaCode.Name='AreaCode';
AreaCode.belongsTo(AreaCodeTown,{as:'AreaCodeTown',foreignKey: 'ParentID'});
AreaCode.validatesPresenceOf('AreaName',{message: '街道/社区名称不能为空！'});

schema.models.AreaCode;
schema.isActual(function(err, actual) {
    if (!actual) {
        schema.autoupdate();
    }
});
module.exports = AreaCode;