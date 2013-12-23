var util=require('util');
var moment = require('moment');
function in_array (arr){ 
    // 判断参数是不是数组 
    var isArr =  arr && console.log( 
            typeof arr==='object' ? arr.constructor===Array ? arr.length ? arr.length===1 ? arr[0]:arr.join(','):'an empty array': arr.constructor: typeof arr  
        ); 
  
    // 不是数组则抛出异常 
    if(!isArr){ 
        return false; 
    } 
  
    // 遍历是否在数组中 
    for(var i=0,k=arr.length;i<k;i++){ 
        if(this==arr[i]){ 
            return true;     
        } 
    } 
  
    // 如果不在数组中就会返回false 
    return false; 
} 

exports.callsessionget = function(req, res){
	console.log(req.query,req.body);
	var tjtype=req.query['tjtype']||req.body['tjtype']||'agenttimes';
	var title=req.query['title']||req.body['title']||'呼叫统计（次数/座席）';
	var dataurl=req.query['dataurl']||req.body['dataurl']||'/chart/callsession';
	res.render('chart/callsession.html', { title: title,dataurl:dataurl,tjtype:tjtype});	
}
exports.callhchartget=function(req,res){
res.render('chart/hchart.html', {});
}
exports.callhchartpost=function(req,res){
res.render('chart/hchart.html', {});
}
exports.callsessionpost = function(req, res){
	var datefrom=req.body['datefrom']||'';
	var dateto=req.body['dateto']||'';
	var callsession=require('../modules/ippbx/callsession.js');
	if(datefrom===''){
		datefrom=moment().format("YYYY-MM-DD");	
	}
	if(dateto===''){
		dateto=moment().format("YYYY-MM-DD");	
	}
	datefrom+=' 00:00:00';
	dateto+=' 23:59:59';
	var date1=moment(datefrom,'YYYY-MM-DD HH:mm:ss');
	var date2=moment(dateto,'YYYY-MM-DD HH:mm:ss');
	if(Date.parse(date1)>Date.parse(date2)) {
	res.send({success:false,msg:'查询日期后者比前者早，这不科学！'});
	}
	else{
		var sql='SELECT COUNT( * ) AS number,routerline, accountcode FROM callsession WHERE 1 =1';
		sql+=" and  cretime >= '" + datefrom + "' and cretime <= '" + dateto + "' ";
		//sql+=' and extension >=9000 ';
		sql+=' GROUP BY routerline, accountcode ';
		callsession.query(sql,function(err,dbs){
		if(err){
			res.send({success:false,msg:'数据库查询发生错误：！'+util.inspect(err,false,null)});	
		}else{
		console.log(dbs);
		var callin=[];
		var callout=[];
		var agent=['8001','8002','8003','8004','8005','8006','8007','8008','8009','8010'];
		for(var i in agent){
			var suo=true;
			for(var j=0;j<dbs.length;j++){
			if(dbs[j].accountcode===agent[i] && dbs[j].routerline===1){
				callin.push([agent[i],dbs[j].number]);	
				suo=false;
			}
			else if(dbs[j].accountcode===agent[i] && dbs[j].routerline===2){
				callout.push([agent[i],dbs[j].number]);	
				suo=false;
			}
			else{
				
			}
			}
			if(suo){
			callin.push([agent[i],0]);	
			callout.push([agent[i],0]);
			}
		}
		res.send({success:true,msg:'',data1:callin,data2:callout});
		}	
		});
			
	}
	
	//res.render('chart/callsession.html', { title: '联系人',items:null});	
}
exports.callsessiondatetimes = function(req, res){
	var datefrom=req.body['datefrom']||'';
	var dateto=req.body['dateto']||'';
	var callsession=require('../modules/ippbx/callsession.js');
	if(datefrom===''){
		datefrom=moment().format("YYYY-MM-DD");	
	}
	if(dateto===''){
		dateto=moment().format("YYYY-MM-DD");	
	}
	datefrom+=' 00:00:00';
	dateto+=' 23:59:59';
	var date1=moment(datefrom,'YYYY-MM-DD HH:mm:ss');
	var date2=moment(dateto,'YYYY-MM-DD HH:mm:ss');
	if(Date.parse(date1)>Date.parse(date2)) {
	res.send({success:false,msg:'查询日期后者比前者早，这不科学！'});
	}
	else{
		var sql="SELECT COUNT( * ) AS number,routerline, date(cretime) as date FROM callsession WHERE 1 =1";
		sql+=" and  cretime >= '" + datefrom + "' and cretime <= '" + dateto + "' ";
		//sql+=' and extension >=9000 ';
		sql+=" GROUP BY routerline, date(cretime) ";
		callsession.query(sql,function(err,dbs){
		if(err){
			res.send({success:false,msg:'数据库查询发生错误：！'+util.inspect(err,false,null)});	
		}else{
		console.log(dbs);
		var callin=[];
		var callout=[];
		//var agent=['8001','8002','8003','8004','8005','8006','8007','8008','8009','8010'];
		//for(var i in agent){
			//var suo=true;
			for(var j=0;j<dbs.length;j++){
			if(dbs[j].routerline===1){
				callin.push([dbs[j].date,dbs[j].number]);	
				suo=false;
			}
			else if(dbs[j].routerline===2){
				callout.push([dbs[j].date,dbs[j].number]);	
				suo=false;
			}
			else{
				
			}
			}
			//if(suo){
			//callin.push([agent[i],0]);	
			//callout.push([agent[i],0]);
			//}
		//}
		res.send({success:true,msg:'',data1:callin,data2:callout});
		}	
		});
			
	}
	
	//res.render('chart/callsession.html', { title: '联系人',items:null});	
}
//GET工单统计页面
exports.orderchartsget=function(req,res){
	res.render('chart/ordercharts.html', { title: '',dataurl:'',tjtype:''});	
}
//POST工单统计页面
exports.orderchartspost=function(req,res){
	res.render('chart/ordercharts.html', { title: '',dataurl:'',tjtype:''});	
}
//GET派单统计页面
exports.paidanchartsget=function(req,res){
	res.render('chart/paidancharts.html', { title: '',dataurl:'',tjtype:''});	
}
//POST派单统计页面
exports.paidanchartspost=function(req,res){
	res.render('chart/paidancharts.html', { title: '',dataurl:'',tjtype:''});	
}
//GET座席话务统计页面
exports.callreportsget=function(req,res){
var UserInfo=require('../modules/crm/UserInfo.js');
UserInfo.all({where:{isAgent:1}},function(err,dbs){
var agent=[];
var error=null;
if(err){
error=err;
}
else if(dbs.length==0){
error="没有找到座席。";
}else{
agent=dbs;
}
res.render('chart/callreports.html', { title: '',Agent:agent,error:error});
});
	
}
