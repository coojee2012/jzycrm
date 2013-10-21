var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var moment = require('moment');
var roleoptions=[
                 {checked:' checked=""',value:'1',name:'只读'},
                 {checked:'',value:'3',name:'读写'},
                 {checked:'',value:'7',name:'修改'}
];
var UserRole = schema.define('UserRole', {
	roleName:   {type:String,limit:50},
	hasPtions:   {type: Number, default: function () { return 0 }},
	crtTime:   {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	lastModify:  {type: Date, default: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }},
	roleDetail:    {type:String,limit:200}

}, {
    restPath: '/UserRole' // tell WebService adapter which path use as API endpoint
});
UserRole.autotpl=false;
UserRole.cloums={
		roleName:   {name:"角色名称",input:Inputs.Text,search:true,create:true,table:true},
		hasPtions:   {name:"操作权限",input:Inputs.Selects,search:true,create:true,table:true,selects:roleoptions},
		crtTime:   {name:"创建时间",input:Inputs.Date,search:false,create:false,table:true},
		lastModify:   {name:"修改时间",input:Inputs.Date,search:false,create:false,table:true},
		roleDetail:    {name:"角色描述",input:Inputs.Text,search:false,create:false,table:true}
};
UserRole.views={
		dir:'crm',
		name:'UserRole',
		memo:'管理和设置角色信息',
		alias:'角色管理'		
		}
UserRole.Name='UserRole';
UserRole.validatesPresenceOf('roleName',{message: '角色名称不能为空！'});
UserRole.validatesPresenceOf('hasPtions',{message: '角色操作不能为空！'});
schema.models.UserRole;

module.exports = UserRole;