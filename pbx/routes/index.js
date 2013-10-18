var UserInfo=require('../modules/crm/UserInfo');
var Menmus=require('../modules/crm/Menmus');
var UserRole=require('../modules/crm/UserRole');
var Extension=require('../modules/ippbx/extension');
var RoelMenmuRlations=require('../modules/crm/RoelMenmuRlations');
var util=require('util');
var crypto=require('crypto');

var inld=new Array();
for(var key in UserInfo.relations){
	inld.push(key);
}

exports.index = function(req, res){
	req.session.user=null;
	res.redirect('login')  ;  
  //res.render('index.html',{title:'四川建设网呼叫中心',layout:false,umenmus:[]});
};

exports.post = function(req, res){
	  var EventProxy = require('eventproxy');
	  var proxy = new EventProxy();
	  
	  var ulogin=req.body.username;
	  var upass=req.body.password;
	  var usexten=req.body.usexten;
	  var md5 = crypto.createHash('md5');
	  var password = md5.update(upass).digest('hex').toUpperCase();
	  
	 // console.log("MD5:"+password+" upass:"+upass);
	  
	  UserInfo.findOne({include:inld,where: {uLogin: ulogin,uPass:password}, order: 'id DESC'}, function(e,db){
		  try{
			if(db==null)
			{
				res.redirect('login?msg=err1')  ; 
				return;
			}
				
		    if(usexten=='')
		    	usexten=db.uExten;
		    Extension.findOne({where:{accountcode:usexten}},function(err,extenold){
		    	if(err) {
		    		res.redirect('login?msg=err4')  ;  
		    		return;
		    	}
		    	if(extenold==null){
		    		res.redirect('login?msg=err5')  ;  
		    		return;
		    	}
		    	
		    	
		    	req.session.user=ulogin;
		    	req.session.username=db.uName;
		    	req.session.exten=usexten;
		    	req.session.deptid=db.uDepId;
		    	req.session.deptname=db.__cachedRelations.DepInfo.depName;
		    	req.session.userid=db.id;
		    	req.session.roleid=db.uRolyId;
		    	//console.log(req.session);
		    	
		    	extenold.doymicaccount=usexten;
		    	Extension.updateOrCreate(extenold,function(err,exten){
			    RoelMenmuRlations.all({where:{roleID:db.uRolyId}},function(e,dbs1){
				  if(dbs1==null || dbs1.length<1){
					  res.redirect('login?msg=err2')  ;  
					  return;
				  }
				 
				  var ids=new Array();
				  for(var mr in dbs1){
					 
					  ids.push(dbs1[mr].menmuID);
				  }
				  //console.log(ids.join(','));
				  Menmus.all({where:{id:{inq: ids.join(',')}}},function(e,dbs2){
					  if(dbs2==null || dbs2.length<1){
						  res.redirect('login?msg=err3')  ;  
						  return;
					  }
					var usermenmus={};
					var startmenmus={};
					startmenmus.starmenmu_grsz={
							title: '个人设置',
							url: '/UserManager/EditSelf',
							winWidth: 600,
							winHeight: 400,
							apptype: 'appwin',
							postdata: {}};
					startmenmus.starmenmu_syzn={
							title: '使用指南',
							url: '/RoleAdmin/Index',
							winWidth: 1100,
							winHeight: 650,
							apptype: 'appwin',
							postdata: {}};
					startmenmus.starmenmu_gywm={
							title: '关于我们',
							url: 'http://www.chinatelecom.com.cn/corp/lsqdcs/index.html',
							winWidth: 1100,
							winHeight: 650,
							apptype: 'appwin',
							postdata: {}};
					startmenmus.starmenmu_tcxt={
							title: '退出系统',
							url: '/Login/Index',
							winWidth: 1100,
							winHeight: 650,
							apptype: 'loginout',
							postdata: {}};
					var is7 = false;
	                var is8 = false;
					//console.log(dbs2);
					for(var menmu in dbs2){
						if(dbs2[menmu].mgID==7 ){
							 if (!is7) {
								 startmenmus.starmenmu_xtsz={
										 title: dbs2[menmu].mgName,
										 url:'#',
										 apptype:'haschild',
										 postdata:{},
										 winWidth:dbs2[menmu].width,
										 winHeight:dbs2[menmu].height
								 }; 
								 is7=true;
							 }
							 else{
								 startmenmus['sub_item_xtsz_'+dbs2[menmu].id]={
										 title: dbs2[menmu].mgName,
										 url:dbs2[menmu].menURL,
										 apptype:'appwin',
										 postdata:{},
										 winWidth:dbs2[menmu].width,
										 winHeight:dbs2[menmu].height
								 }; 	 
								 
							 }
						}
						else if(dbs2[menmu].mgID==8){
							 if (!is8) {
								// startmenmus.starmenmu_pbx={
										 startmenmus['sub_item_pbx_'+dbs2[menmu].id]={
										 title: dbs2[menmu].menName,
										 url:dbs2[menmu].menURL,
										 apptype:'appwin',
										 postdata:{},
										 winWidth:dbs2[menmu].width,
										 winHeight:dbs2[menmu].height
								 }; 
								 is8=true;
							 }
							 else{
								 startmenmus['sub_item_pbx_'+dbs2[menmu].id]={
										 title: dbs2[menmu].menName,
										 url:dbs2[menmu].menURL,
										 apptype:'appwin',
										 postdata:{},
										 winWidth:dbs2[menmu].width,
										 winHeight:dbs2[menmu].height
								 }; 	 
								 
							 }
							
						}
						else{
						usermenmus["menmu_"+dbs2[menmu].id]={
								title:dbs2[menmu].menName,
								url:dbs2[menmu].menURL,
								winWidth:dbs2[menmu].width,
								winHeight:dbs2[menmu].height
								
						}	
						}
					}
					//console.log(usermenmus);
					res.render('index.html', { title: '诚和办公客户服务系统',layout:false,umenmus:dbs2,user:db,exten:exten,menmus:util.inspect(usermenmus,false,null),startmenmus:util.inspect(startmenmus,false,null) });  
				  });  //查找菜单结束
			 
			});//获取角色和菜单关系结束
		    });//更新动态分机
		    }); //查找分机结束
			   
		  
		
		  }
		  catch(e){
			  
			  res.redirect('login?msg='+e)  ;  
		  }
		  
		    
	  });//查找用户信息结束
	  
};

//module.exports=route;