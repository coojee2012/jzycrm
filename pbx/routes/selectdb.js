exports.all = function(req, res){
var tbname=req.query['tbname'] || req.body['tbname'];
var groupby=req.query['groupby'] || req.body['groupby'];
var groupdb=req.query['groupdb'] || req.body['groupdb'];
var where=req.query['where'] || req.body['where'] || {};
//var key=req.body['key'];
//var value=req.body['value'];
var TB=require('../modules/'+tbname);
var inld=new Array();
for(var key in TB.relations){
	inld.push(key);
}
TB.all({include:inld,where:where},function(err,dbs){
	if(err){
		res.send({success:false,msg:err,dbs:[]});	
	}else{
		
		if(groupby && groupdb && groupby!='' && groupdb!=''){
			var dbss={};			
			for(var i=0;i<dbs.length;i++){
				//console.log('groupdb:',groupdb);
				//console.log('groupby:',groupby);
				var dbsskey=dbs[i].__cachedRelations[groupdb][groupby];
				console.log('dbsskey is array',dbss[dbsskey]);
				//Object.prototype.toString.call(obj) === '[object Array]';   								
				if(dbss[dbsskey] && dbss[dbsskey].length>0)
				{
					
					dbss[dbsskey].push(dbs[i]);	
				}
				else{					
					dbss[dbsskey]=[];
					dbss[dbsskey].push(dbs[i]);
				}
			}
			
			res.send({success:true,msg:'获取成功',data:dbss});	
		}
		else{
		res.send({success:true,msg:'获取成功',data:dbs});
		}
	}
});
}

exports.pagingsearch=function(req,res){
	var dbname=req.query['dbname'] || req.body['dbname'];	
	var searchDb=require('../modules/'+dbname);
	var serverfn={};
	
	for(var cl in searchDb.cloums){
		var inputype=searchDb.cloums[cl].input.type;
		if(inputype=='radios'||inputype=='selects'||inputype=='checkboxes'){
		var tmp=searchDb.cloums[cl][inputype];
		//console.log(tmp);
		createfn(cl,tmp);
		}
		
	}
	
	function createfn(cl,tmp){
		serverfn["get_"+cl]=function(value){
			
			
			for(var tmtm in tmp){
				//console.log('old：',tmp[tmtm].value);
				//console.log('new：',value);
				if(tmp[tmtm].value==value){
			return tmp[tmtm].name;
					}
			}
			return '--';
			
			}	
	}
	
	//查询起始页面，第一页是0
	var iDisplayStart=req.query['iDisplayStart'] || req.body['iDisplayStart'];
	//每页长度
	var iDisplayLength=req.query['iDisplayLength'] || req.body['iDisplayLength'];
	var iSortCol_0=req.query['iSortCol_0'] || req.body['iSortCol_0'];
	
	//排序字符串
	var order="";
	
	//列表显示的表字段名
	var cls=req.query['cls'] || req.body['cls'];
	var aColumns=cls.split('___');
	//var aColumns=['uName','uPhone','uExten','uDepId','id'];
	
	//aColumns.push('id');
	//console.log('aColumns:',aColumns);
	if(iSortCol_0!=null && iSortCol_0!='' ){
		var iSortingCols=req.query['iSortingCols'] || req.body['iSortingCols'];
		var sOrder = '';
		
		for ( var i=0 ; i<iSortingCols ; i++ )
		{
			var iSortCol=req.query['iSortCol_'+i]||req.body['iSortCol_'+i];
			var bSortable=req.query['bSortable_'+iSortCol] || req.body['bSortable_'+iSortCol];
			
			if ( bSortable == "true" && sOrder==''  )
			{
				var sSortDir=req.query['sSortDir_'+i]||req.body['sSortDir_'+i];
				
				sOrder += aColumns[iSortCol]+" "+(sSortDir==='asc' ? 'asc' : 'desc');
			}
			if ( bSortable == "true" && sOrder!=''  )
			{
				var sSortDir=req.query['sSortDir_'+i]||req.body['sSortDir_'+i];
				
				sOrder += ","+aColumns[iSortCol]+" "+(sSortDir==='asc' ? 'asc' : 'desc');
			}
			
		}
		order=sOrder;
	}
	
	if(order==null || order=='')
		order='id DESC';
	
	var where={};
	var sSearch=req.query['sSearch'] || req.body['sSearch'];
	if(sSearch && sSearch!='' ){
		for ( var i=0 ; i<aColumns.length ; i++ )
		{
			//where[aColumns[i]]={like:sSearch};
			/*if(where=='' || where==null)
				where='WHERE `'+aColumns[i]+"` LIKE '%"+sSearch.replace(';','')+"%'";
			else
			where+='OR `'+aColumns[i]+"` LIKE '%"+sSearch.replace(';','')+"%'";*/
		}
	}
	var wherestr=req.query['where']||'';
	if(wherestr!=''){
	var tmp0=wherestr.split(',,,,,');
	for(var i=0;i<tmp0.length;i++){
	if(tmp0[i]==='' ||  tmp0[i]==undefined || tmp0[i]==='undefined')
		continue;
	var tmp1=tmp0[i].split(':::::');
	if(tmp1[1]==='undefined' || tmp1[1]==undefined || tmp1[1]==-1 || tmp1[1]==''){
	continue;
	}
	var tmp2=tmp1[1].split('|||||');
	if(tmp2[1]==='undefined' || tmp2[1]==undefined || tmp2[1]==-1 || tmp2[1]==''){
		if(tmp2[0]=='like' || tmp2[0]=='inq' || tmp2[0]=='nin' || tmp2[0]=='gt' || tmp2[0]=='gte'|| tmp2[0]=='lt' || tmp2[0]=='lte' || tmp2[0]=='between'|| tmp2[0]=='neq')
		{}
		else{
			where[tmp1[0]]=tmp2[0];
		}
		}else{
	where[tmp1[0]]={};
	where[tmp1[0]][tmp2[0]]=tmp2[1];
		}
	}
	}
	
	//where.useor=true;
	var output ={};
	
	var inld=new Array();
	for(var key in searchDb.relations){
		inld.push(key);
	}
	console.log(where);
	searchDb.all(
		{
			where:where
			
		}
			,function(err,counts){
			var count=counts.length;
			  //console.log("COUNT:");
			  //console.log(count);
				if(count<1){
					res.send(output);
					}
				else{
				
				searchDb.all(
						{
						include:inld,
						where:where,
						order:order,
						skip:iDisplayStart,
						limit:iDisplayLength
						},function(err,dbs){
						output.iTotalRecords=count;
						output.sEcho=req.query['sEcho'] || req.body['sEcho'];
						output.iTotalDisplayRecords=count;
						var redata=[];
						for(var i=0;i<dbs.length;i++){
							var tmppnj={};
							for(var j=0;j<aColumns.length;j++){
								//console.log(aColumns[j]);
								//if(!searchDb.cloums[aColumns[j]] || searchDb.cloums[aColumns[j]]==null)
								console.log(aColumns[j]);
								if(aColumns[j]!='id' && searchDb.cloums[aColumns[j]].input.type=='selectdb'){
									var finddb=searchDb.cloums[aColumns[j]].selectdb.dbname.split("/");
									var dbname=finddb[finddb.length-1];
									if(searchDb.cloums[aColumns[j]].selectdb && searchDb.cloums[aColumns[j]].selectdb.as!==undefined){
										dbname=searchDb.cloums[aColumns[j]].selectdb.as
									}
									var dbcl=searchDb.cloums[aColumns[j]].selectdb.value;
									//console.log(dbs[i]);
									if(!dbs[i].__cachedRelations[dbname] || dbs[i].__cachedRelations[dbname]==null){
										tmppnj[aColumns[j]]='--';	
									}else
									{
									//tmppnj[aColumns[j]]=dbs[i].__cachedRelations[dbname][dbcl];
									  tmppnj[aColumns[j]]=dbs[i].__cachedRelations[dbname];
									}
									
								}
								else if(aColumns[j]!='id' && searchDb.cloums[aColumns[j]].input.type=='selectdbGroup'){
									var finddb=searchDb.cloums[aColumns[j]].selectdbGroup.dbname.split("/");
									var dbname=finddb[finddb.length-1];
									if(searchDb.cloums[aColumns[j]].selectdbGroup && searchDb.cloums[aColumns[j]].selectdbGroup.as!==undefined){
										dbname=searchDb.cloums[aColumns[j]].selectdbGroup.as
									}
									var dbcl=searchDb.cloums[aColumns[j]].selectdbGroup.value;
									//console.log(dbs[i]);
									
									if(!dbs[i].__cachedRelations[dbname] || dbs[i].__cachedRelations[dbname]==null){
										tmppnj[aColumns[j]]='--';	
									}else
									{
									//tmppnj[aColumns[j]]=dbs[i].__cachedRelations[dbname][dbcl];
									tmppnj[aColumns[j]]=dbs[i].__cachedRelations[dbname];
									}
									
									
									
								}
								else if(aColumns[j]!='id' && (searchDb.cloums[aColumns[j]].input.type=='radios' || searchDb.cloums[aColumns[j]].input.type=='selects' ||searchDb.cloums[aColumns[j]].input.type=='checkboxes')){									
							
										tmppnj[aColumns[j]]=serverfn["get_"+aColumns[j]](dbs[i][aColumns[j]]);
									
									
									//console.log(aColumns[j],dbs[i]);
								}
								else{
								tmppnj[aColumns[j]]=dbs[i][aColumns[j]];
								//console.log(aColumns[j],dbs[i]);
								}
								//tmppnj[j]=dbs[i][aColumns[j]];
								
							}
							redata[i]=tmppnj;	
						}
						//console.log(redata);
						output.aaData=redata;
						res.send(output);
						}		
				);
				}
			});
			

}

exports.pagingsearch2=function(req,res){
	var dbname=req.query['dbname'] || req.body['dbname'];	
	var searchDb=require('../modules/'+dbname);
	//表关系
	var inld=new Array();
	for(var key in searchDb.relations){
		inld.push(key);
	}
	
	//查询起始页面，第一页是0
	var iDisplayStart=req.query['iDisplayStart'] || req.body['iDisplayStart'];
	//每页长度
	var iDisplayLength=req.query['iDisplayLength'] || req.body['iDisplayLength'];
	var iSortCol_0=req.query['iSortCol_0'] || req.body['iSortCol_0'];
	
	//排序字符串
	var order="";
	
	//列表显示的表字段名
	var aColumns=['uName','uPhone','uExten','uDepId','id'];
	var tables=['a','b','c','d','e','f'];
	var j=1;
	var leftjoin='';
	for(var i=0;i<aColumns.length;i++){
		if(searchDb.cloums[aColumns].relation){
			
			leftjoin+=' LEFT JOIN '+searchDb.cloums[aColumns].relationdb.name+' as '+tables[j]+' ON '+tables[j]+'.id = a.'+aColumns[i];
			aColumns[i]=tables[j]+'.'+searchDb.cloums[aColumns].relationdb.rlations+aColumns[i];
		}else{
			aColumns[i]=+'a.'+aColumns[i];	
		}
	}
	
	if(iSortCol_0!=null && iSortCol_0!='' ){
		var iSortingCols=req.query['iSortingCols'] || req.body['iSortingCols'];
		var sOrder = '';
		
		for ( var i=0 ; i<iSortingCols ; i++ )
		{
			var iSortCol=req.query['iSortCol_'+i]||req.body['iSortCol_'+i];
			var bSortable=req.query['bSortable_'+iSortCol] || req.body['bSortable_'+iSortCol];
			
			if ( bSortable == "true" && sOrder==''  )
			{
				var sSortDir=req.query['sSortDir_'+i]||req.body['sSortDir_'+i];
				
				sOrder += aColumns[iSortCol]+" "+(sSortDir==='asc' ? 'asc' : 'desc');
			}
			if ( bSortable == "true" && sOrder!=''  )
			{
				var sSortDir=req.query['sSortDir_'+i]||req.body['sSortDir_'+i];
				
				sOrder += ","+aColumns[iSortCol]+" "+(sSortDir==='asc' ? 'asc' : 'desc');
			}
			
		}
		order=sOrder;
	}
	
	if(order==null || order=='')
		order='id DESC';
	
	var where={};
	var sSearch=req.query['sSearch'] || req.body['sSearch'];
	if(sSearch && sSearch!='' ){
		for ( var i=0 ; i<aColumns.length ; i++ )
		{
			where[aColumns[i]]={like:sSearch};
			/*if(where=='' || where==null)
				where='WHERE `'+aColumns[i]+"` LIKE '%"+sSearch.replace(';','')+"%'";
			else
			where+='OR `'+aColumns[i]+"` LIKE '%"+sSearch.replace(';','')+"%'";*/
		}
	}
	
	
	var output ={};
	searchDb.count(
		where
			,function(err,count){
			  //console.log("COUNT:");
			 // console.log(count);
				if(count<1){
					res.send(output);
					}
				else{
				where.useor=true;
				searchDb.all(
						{
						where:where,
						order:order,
						skip:iDisplayStart,
						limit:iDisplayLength
						},function(err,dbs){
						output.iTotalRecords=count;
						output.sEcho=req.query['sEcho'] || req.body['sEcho'];
						output.iTotalDisplayRecords=count;
						var redata=[];
						for(var i=0;i<dbs.length;i++){
							var tmppnj={};
							for(var j=0;j<aColumns.length;j++){
								
								tmppnj[aColumns[j]]=dbs[i][aColumns[j]];
								//tmppnj[j]=dbs[i][aColumns[j]];
								
							}
							redata[i]=tmppnj;	
						}
						//console.log(redata);
						output.aaData=redata;
						res.send(output);
						}		
				);
				}
			});
			

}
