var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Inputs = require('../../autoinput/autoinput');
var FaqCode = require('./FaqCode');
var UserInfo = require('./UserInfo');
var CustomInfo = require('./CustomInfo');
var moment = require('moment');
var Faq = schema.define('Faq', {
	titile : {
		type : String,
		limit : 50
	},
	content : {
		type : String,
		limit : 256
	}
}, {
	restPath : '/Faq' // tell WebService adapter which path use as API
						// endpoint
	});
Faq.autotpl = false;
Faq.cloums = {
	titile : {
		name : "标题",
		input : Inputs.Text,
		search : true,
		create : true,
		table : true
	},
	content : {
		name : "内容",
		input : Inputs.Editor,
		search : false,
		create : true,
		table : false
	},
	faqCodeId : {
		name : "分类名称",
		input : Inputs.SelectDB,
		search : true,
		create : true,
		table : true,
		selectdb : {
			dbname : 'crm/FaqCode',
			key : 'id',
			value : 'CodeName'
		}
	}

}

Faq.views = {
	dir : 'crm',
	name : 'Faq',
	memo : '知识库',
	alias : '知识库'
}
Faq.Name = 'Faq';
Faq.belongsTo(FaqCode, {
	as : 'FaqCode',
	foreignKey : 'faqCodeId'
});

Faq.validatesPresenceOf('titile', 'content');

schema.models.Faq;

module.exports = Faq;