
var util=require('util');
exports.contacts = function(req, res){
	var UserInfo=require('../modules/crm/UserInfo');
	var inld=new Array();
	for(var key in UserInfo.relations){
		inld.push(key);
	}
	
	UserInfo.all({include:inld,order:'id DESC'},function(err,dbs){ 
	res.render('common/contacts.html', { title: '联系人',items:dbs});
	  });  
};