var myconstant = {};
myconstant.yesorno = [ {
	checked : ' checked=true ',
	value : '0',
	name : '否'
}, {
	checked : '',
	value : '1',
	name : '是'
}, ];

myconstant.sex = [ {
	checked : ' checked=true',
	value : '1',
	name : '男'
}, {
	checked : '',
	value : '0',
	name : '女'
}, ];

myconstant.statusA = [ {
	checked : ' selected="selected"',
	value : 0,
	name : '未处理'
}, {
	checked : '',
	value : 1,
	name : '处理中'
}, {
	checked : '',
	value : 2,
	name : '已处理'
} ];
module.exports = myconstant;