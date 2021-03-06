var syslog = require('../common/syslog');
var util = require('util');

exports.all = function(req, res) {
	var tbname = req.query['tbname'] || req.body['tbname'];
	var groupby = req.query['groupby'] || req.body['groupby'];
	var groupdb = req.query['groupdb'] || req.body['groupdb'];
	var where = req.query['where'] || req.body['where'] || {};
	//var key=req.body['key'];
	//var value=req.body['value'];
	var TB = require('../modules/' + tbname);
	var inld = new Array();
	for (var key in TB.relations) {
		inld.push(key);
	}
	TB.all({
		include: inld,
		where: where
	}, function(err, dbs) {
		if (err) {
			syslog.add(req, res, 'sql', err);
			res.send({
				success: false,
				msg: err,
				dbs: []
			});
		} else {

			if (groupby && groupdb && groupby != '' && groupdb != '') {
				var dbss = {};
				for (var i = 0; i < dbs.length; i++) {
					//console.log('groupdb:',groupdb);
					//console.log('groupby:',groupby);
					var dbsskey = dbs[i].__cachedRelations[groupdb][groupby];
					//console.log('dbsskey is array',dbss[dbsskey]);
					//Object.prototype.toString.call(obj) === '[object Array]';   			
					if (dbss[dbsskey] && dbss[dbsskey].length > 0) {

						dbss[dbsskey].push(dbs[i]);
					} else {
						dbss[dbsskey] = [];
						dbss[dbsskey].push(dbs[i]);
					}
				}

				res.send({
					success: true,
					msg: '获取成功',
					data: dbss
				});
			} else {
				res.send({
					success: true,
					msg: '获取成功',
					data: dbs
				});
			}
		}
	});
}

exports.pagingsearch = function(req, res) {
	var dbname = req.query['dbname'] || req.body['dbname'];
	var searchDb = require('../modules/' + dbname);
	var serverfn = {};

	for (var cl in searchDb.cloums) {
		var inputype = searchDb.cloums[cl].input.type;
		if (inputype == 'radios' || inputype == 'selects' || inputype == 'checkboxes') {
			var tmp = searchDb.cloums[cl][inputype];
			//console.log(tmp);
			createfn(cl, tmp);
		}

	}

	function createfn(cl, tmp) {
		serverfn["get_" + cl] = function(value) {


			for (var tmtm in tmp) {
				//console.log('old：',tmp[tmtm].value);
				//console.log('new：',value);
				if (tmp[tmtm].value == value) {
					return tmp[tmtm].name;
				}
			}
			return '--';

		}
	}

	//查询起始页面，第一页是0
	var iDisplayStart = req.query['iDisplayStart'] || req.body['iDisplayStart'];
	//每页长度
	var iDisplayLength = req.query['iDisplayLength'] || req.body['iDisplayLength'];
	var iSortCol_0 = req.query['iSortCol_0'] || req.body['iSortCol_0'];

	//排序字符串
	var order = "";

	//列表显示的表字段名
	var cls = req.query['cls'] || req.body['cls'];
	var aColumns = cls.split('___');
	//var aColumns=['uName','uPhone','uExten','uDepId','id'];

	//aColumns.push('id');
	//console.log('aColumns:',aColumns);
	if (iSortCol_0 != null && iSortCol_0 != '') {
		var iSortingCols = req.query['iSortingCols'] || req.body['iSortingCols'];
		var sOrder = '';

		for (var i = 0; i < iSortingCols; i++) {
			var iSortCol = req.query['iSortCol_' + i] || req.body['iSortCol_' + i];
			var bSortable = req.query['bSortable_' + iSortCol] || req.body['bSortable_' + iSortCol];

			if (bSortable == "true" && sOrder == '') {
				var sSortDir = req.query['sSortDir_' + i] || req.body['sSortDir_' + i];

				sOrder += aColumns[iSortCol] + " " + (sSortDir === 'asc' ? 'asc' : 'desc');
			}
			if (bSortable == "true" && sOrder != '') {
				var sSortDir = req.query['sSortDir_' + i] || req.body['sSortDir_' + i];

				sOrder += "," + aColumns[iSortCol] + " " + (sSortDir === 'asc' ? 'asc' : 'desc');
			}

		}
		order = sOrder;
	}

	if (order == null || order == '')
		order = 'id DESC';

	var where = {};
	var sSearch = req.query['sSearch'] || req.body['sSearch'];
	if (sSearch && sSearch != '') {
		for (var i = 0; i < aColumns.length; i++) {
			//where[aColumns[i]]={like:sSearch};
			/*if(where=='' || where==null)
				where='WHERE `'+aColumns[i]+"` LIKE '%"+sSearch.replace(';','')+"%'";
			else
			where+='OR `'+aColumns[i]+"` LIKE '%"+sSearch.replace(';','')+"%'";*/
		}
	}
	var wherestr = req.query['where'] || '';
	if (wherestr != '') {
		var tmp0 = wherestr.split(',,,,,');
		for (var i = 0; i < tmp0.length; i++) {
			if (tmp0[i] === '' || tmp0[i] == undefined || tmp0[i] === 'undefined')
				continue;
			var tmp1 = tmp0[i].split(':::::');
			if (tmp1[1] === 'undefined' || tmp1[1] == undefined || tmp1[1] == -1 || tmp1[1] == '') {
				continue;
			}
			var tmp2 = tmp1[1].split('|||||');
			if (tmp2[1] === 'undefined' || tmp2[1] == undefined || tmp2[1] == -1 || tmp2[1] == '') {
				if (tmp2[0] == 'like' || tmp2[0] == 'inq' || tmp2[0] == 'nin' || tmp2[0] == 'gt' || tmp2[0] == 'gte' || tmp2[0] == 'lt' || tmp2[0] == 'lte' || tmp2[0] == 'between' || tmp2[0] == 'neq') {} else {
					where[tmp1[0]] = tmp2[0];
				}
			} else {
				where[tmp1[0]] = {};
				if (tmp2[0] == 'between') {

					console.log(tmp2[1]);
					where[tmp1[0]][tmp2[0]] = tmp2[1].split('=====');
				} else
					where[tmp1[0]][tmp2[0]] = tmp2[1];

			}
		}
	}

	//where.useor=true;
	var output = {};

	var inld = new Array();
	for (var key in searchDb.relations) {
		inld.push(key);
	}
	console.log('WHERE:', where);
	searchDb.count({
			where: where
		},
		function(err, counts) {
			if (err)
				syslog.add(req, res, 'sql', err);
			var count = counts; //counts.length;
			//console.log("COUNT:");
			//console.log(count);
			if (count < 1) {
				output.iTotalRecords = count;
				output.iTotalDisplayRecords = count;
				res.send(output);
			} else {

				searchDb.all({
					include: inld,
					where: where,
					order: order,
					skip: iDisplayStart,
					limit: iDisplayLength
				}, function(err, dbs) {

					if (err)
						syslog.add(req, res, 'sql', err);

					output.iTotalRecords = count;
					output.sEcho = req.query['sEcho'] || req.body['sEcho'];
					output.iTotalDisplayRecords = count;
					var redata = [];
					for (var i = 0; i < dbs.length; i++) {
						var tmppnj = {};
						for (var j = 0; j < aColumns.length; j++) {
							//console.log(aColumns[j]);
							//if(!searchDb.cloums[aColumns[j]] || searchDb.cloums[aColumns[j]]==null)
							//console.log(aColumns[j]);
							if (aColumns[j] != 'id' && searchDb.cloums[aColumns[j]].input.type == 'selectdb') {
								var finddb = searchDb.cloums[aColumns[j]].selectdb.dbname.split("/");
								var dbname = finddb[finddb.length - 1];
								if (searchDb.cloums[aColumns[j]].selectdb && searchDb.cloums[aColumns[j]].selectdb.as !== undefined) {
									dbname = searchDb.cloums[aColumns[j]].selectdb.as
								}
								var dbcl = searchDb.cloums[aColumns[j]].selectdb.value;
								//console.log(dbs[i]);
								if (!dbs[i].__cachedRelations[dbname] || dbs[i].__cachedRelations[dbname] == null) {
									tmppnj[aColumns[j]] = '--';
								} else {
									//tmppnj[aColumns[j]]=dbs[i].__cachedRelations[dbname][dbcl];
									tmppnj[aColumns[j]] = dbs[i].__cachedRelations[dbname];
								}

							} else if (aColumns[j] != 'id' && searchDb.cloums[aColumns[j]].input.type == 'selectdbGroup') {
								var finddb = searchDb.cloums[aColumns[j]].selectdbGroup.dbname.split("/");
								var dbname = finddb[finddb.length - 1];
								if (searchDb.cloums[aColumns[j]].selectdbGroup && searchDb.cloums[aColumns[j]].selectdbGroup.as !== undefined) {
									dbname = searchDb.cloums[aColumns[j]].selectdbGroup.as
								}
								var dbcl = searchDb.cloums[aColumns[j]].selectdbGroup.value;
								//console.log(dbs[i]);

								if (!dbs[i].__cachedRelations[dbname] || dbs[i].__cachedRelations[dbname] == null) {
									tmppnj[aColumns[j]] = '--';
								} else {
									//tmppnj[aColumns[j]]=dbs[i].__cachedRelations[dbname][dbcl];
									tmppnj[aColumns[j]] = dbs[i].__cachedRelations[dbname];
								}



							} else if (aColumns[j] != 'id' && (searchDb.cloums[aColumns[j]].input.type == 'radios' || searchDb.cloums[aColumns[j]].input.type == 'selects' || searchDb.cloums[aColumns[j]].input.type == 'checkboxes')) {

								tmppnj[aColumns[j]] = serverfn["get_" + aColumns[j]](dbs[i][aColumns[j]]);


								//console.log(aColumns[j],dbs[i]);
							} else {
								tmppnj[aColumns[j]] = dbs[i][aColumns[j]];
								//console.log(aColumns[j],dbs[i]);
							}
							//tmppnj[j]=dbs[i][aColumns[j]];

						}
						redata[i] = tmppnj;
					}
					//console.log(redata);
					output.aaData = redata;
					res.send(output);
				});
			}
		} //count
	);


}

exports.pagingsearch2 = function(req, res) {
	var dbname = req.query['dbname'] || req.body['dbname'];
	var searchDb = require('../modules/' + dbname);
	//表关系
	var inld = new Array();
	for (var key in searchDb.relations) {
		inld.push(key);
	}

	//查询起始页面，第一页是0
	var iDisplayStart = req.query['iDisplayStart'] || req.body['iDisplayStart'];
	//每页长度
	var iDisplayLength = req.query['iDisplayLength'] || req.body['iDisplayLength'];
	var iSortCol_0 = req.query['iSortCol_0'] || req.body['iSortCol_0'];

	//排序字符串
	var order = "";

	//列表显示的表字段名
	var aColumns = ['uName', 'uPhone', 'uExten', 'uDepId', 'id'];
	var tables = ['a', 'b', 'c', 'd', 'e', 'f'];
	var j = 1;
	var leftjoin = '';
	for (var i = 0; i < aColumns.length; i++) {
		if (searchDb.cloums[aColumns].relation) {

			leftjoin += ' LEFT JOIN ' + searchDb.cloums[aColumns].relationdb.name + ' as ' + tables[j] + ' ON ' + tables[j] + '.id = a.' + aColumns[i];
			aColumns[i] = tables[j] + '.' + searchDb.cloums[aColumns].relationdb.rlations + aColumns[i];
		} else {
			aColumns[i] = +'a.' + aColumns[i];
		}
	}

	if (iSortCol_0 != null && iSortCol_0 != '') {
		var iSortingCols = req.query['iSortingCols'] || req.body['iSortingCols'];
		var sOrder = '';

		for (var i = 0; i < iSortingCols; i++) {
			var iSortCol = req.query['iSortCol_' + i] || req.body['iSortCol_' + i];
			var bSortable = req.query['bSortable_' + iSortCol] || req.body['bSortable_' + iSortCol];

			if (bSortable == "true" && sOrder == '') {
				var sSortDir = req.query['sSortDir_' + i] || req.body['sSortDir_' + i];

				sOrder += aColumns[iSortCol] + " " + (sSortDir === 'asc' ? 'asc' : 'desc');
			}
			if (bSortable == "true" && sOrder != '') {
				var sSortDir = req.query['sSortDir_' + i] || req.body['sSortDir_' + i];

				sOrder += "," + aColumns[iSortCol] + " " + (sSortDir === 'asc' ? 'asc' : 'desc');
			}

		}
		order = sOrder;
	}

	if (order == null || order == '')
		order = 'id DESC';

	var where = {};
	var sSearch = req.query['sSearch'] || req.body['sSearch'];
	if (sSearch && sSearch != '') {
		for (var i = 0; i < aColumns.length; i++) {
			where[aColumns[i]] = {
				like: sSearch
			};
			/*if(where=='' || where==null)
				where='WHERE `'+aColumns[i]+"` LIKE '%"+sSearch.replace(';','')+"%'";
			else
			where+='OR `'+aColumns[i]+"` LIKE '%"+sSearch.replace(';','')+"%'";*/
		}
	}


	var output = {};
	searchDb.count(
		where, function(err, count) {
			//console.log("COUNT:");
			// console.log(count);
			if (count < 1) {
				res.send(output);
			} else {
				where.useor = true;
				searchDb.all({
					where: where,
					order: order,
					skip: iDisplayStart,
					limit: iDisplayLength
				}, function(err, dbs) {
					output.iTotalRecords = count;
					output.sEcho = req.query['sEcho'] || req.body['sEcho'];
					output.iTotalDisplayRecords = count;
					var redata = [];
					for (var i = 0; i < dbs.length; i++) {
						var tmppnj = {};
						for (var j = 0; j < aColumns.length; j++) {

							tmppnj[aColumns[j]] = dbs[i][aColumns[j]];
							//tmppnj[j]=dbs[i][aColumns[j]];

						}
						redata[i] = tmppnj;
					}
					//console.log(redata);
					output.aaData = redata;
					res.send(output);
				});
			}
		});


}

exports.orderchart = function(req, res) {
	var tjtype = req.query['tjtype'] || req.body['tjtype'];
	var tjvalue = req.query['tjvalue'] || req.body['tjvalue'];
	var Orders = require('../modules/crm/OrderRecords.js');
	var output = {};
	var now = new Date(); //当前日期 
	var nowYear = now.getFullYear(); //当前年 

	if (tjtype == 1) {

		var kaishijieshu = mm(nowYear, tjvalue);
		var sql = "SELECT count(*) as number,DepId,WEEKDAY(date(orderTime)) as week  FROM `OrderRecords` where 1=1 ";
		sql += " and orderTime > '" + kaishijieshu.first + " 00:00:00' and orderTime < '" + kaishijieshu.end + " 23:59:59'  group by DepId,WEEKDAY(date(orderTime)) order by WEEKDAY(date(orderTime)) asc";
		Orders.query(sql, function(err, dbs) {
			if (err) {
				res.send({
					success: false,
					msg: '数据库查询发生错误：！' + util.inspect(err, false, null)
				});
			} else {
				var redata = [];
				var weekcn = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日', '总计'];
				for (var j = 0; j < weekcn.length; j++) {
					var tmp = {};
					tmp.tags = weekcn[j];
					tmp.wxjl = 0;
					tmp.shbxjl = 0;
					tmp.sjsjl = 0;
					tmp.ecgsjl = 0;
					tmp.jck = 0;
					tmp.yys = 0;
					tmp.szk = 0;
					tmp.zj = 0;
					redata[j] = tmp;
				}
				for (var i = 0; i < dbs.length; i++) {

					if (dbs[i].DepId == 1) {
						redata[dbs[i].week].wxjl = dbs[i].number;
						redata[dbs[i].week].zj += dbs[i].number;
						redata[7].wxjl += dbs[i].number;
						redata[7].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 3) {
						redata[dbs[i].week].shbxjl = dbs[i].number;
						redata[dbs[i].week].zj += dbs[i].number;
						redata[7].shbxjl += dbs[i].number;
						redata[7].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 7) {
						redata[dbs[i].week].sjsjl = dbs[i].number;
						redata[dbs[i].week].zj += dbs[i].number;
						redata[7].sjsjl += dbs[i].number;
						redata[7].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 8) {
						redata[dbs[i].week].ecgsjl = dbs[i].number;
						redata[dbs[i].week].zj += dbs[i].number;
						redata[7].ecgsjl += dbs[i].number;
						redata[7].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 6) {
						redata[dbs[i].week].jck = dbs[i].number;
						redata[dbs[i].week].zj += dbs[i].number;
						redata[7].jck += dbs[i].number;
						redata[7].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 5) {
						redata[dbs[i].week].yys = dbs[i].number;
						redata[dbs[i].week].zj += dbs[i].number;
						redata[7].yys += dbs[i].number;
						redata[7].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 11) {
						redata[dbs[i].week].szk = dbs[i].number;
						redata[dbs[i].week].zj += dbs[i].number;
						redata[7].szk += dbs[i].number;
						redata[7].zj += dbs[i].number;
					}



				}
				output.iTotalRecords = 8;
				output.sEcho = req.query['sEcho'] || req.body['sEcho'];
				output.iTotalDisplayRecords = 8;
				output.aaData = redata;
				res.send(output);
			}
		});

	} else if (tjtype == 2) {
		var firstday = formatDate(new Date(nowYear, tjvalue - 1, 1));
		var eryuedays = (nowYear % 4 == 0) && (nowYear % 100 != 0) || nowYear % 400 == 0 ? 29 : 28;
		var monthdays = [31, eryuedays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var days = monthdays[tjvalue - 1];
		var endday = formatDate(new Date(nowYear, tjvalue - 1, days));

		var sql = "SELECT count(*) as number,DepId,DAYOFMONTH(date(orderTime)) as week  FROM `OrderRecords` where 1=1 ";
		sql += " and orderTime > '" + firstday + " 00:00:00' and orderTime < '" + endday + " 23:59:59'  group by DepId,DAYOFMONTH(orderTime) order by DAYOFMONTH(date(orderTime)) asc";

		Orders.query(sql, function(err, dbs) {
			if (err) {
				res.send({
					success: false,
					msg: '数据库查询发生错误：！' + util.inspect(err, false, null)
				});
			} else {

				var redata = [];

				for (var j = 0; j <= days; j++) {
					var tmp = {};
					if (j == days)
						tmp.tags = '总计';
					else {
						var day1111 = j + 1;
						tmp.tags = nowYear + '-' + tjvalue + '-' + day1111;
					}
					tmp.wxjl = 0;
					tmp.shbxjl = 0;
					tmp.sjsjl = 0;
					tmp.ecgsjl = 0;
					tmp.jck = 0;
					tmp.yys = 0;
					tmp.szk = 0;
					tmp.zj = 0;
					redata[j] = tmp;
				}
				for (var i = 0; i < dbs.length; i++) {

					if (dbs[i].DepId == 1) {
						redata[dbs[i].week - 1].wxjl = dbs[i].number;
						redata[dbs[i].week - 1].zj += dbs[i].number;
						redata[days].wxjl += dbs[i].number;
						redata[days].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 3) {
						redata[dbs[i].week - 1].shbxjl = dbs[i].number;
						redata[dbs[i].week - 1].zj += dbs[i].number;
						redata[days].shbxjl += dbs[i].number;
						redata[days].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 7) {
						redata[dbs[i].week - 1].sjsjl = dbs[i].number;
						redata[dbs[i].week - 1].zj += dbs[i].number;
						redata[days].sjsjl += dbs[i].number;
						redata[days].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 8) {
						redata[dbs[i].week - 1].ecgsjl = dbs[i].number;
						redata[dbs[i].week - 1].zj += dbs[i].number;
						redata[days].ecgsjl += dbs[i].number;
						redata[days].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 6) {
						redata[dbs[i].week - 1].jck = dbs[i].number;
						redata[dbs[i].week - 1].zj += dbs[i].number;
						redata[days].jck += dbs[i].number;
						redata[days].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 5) {
						redata[dbs[i].week - 1].yys = dbs[i].number;
						redata[dbs[i].week - 1].zj += dbs[i].number;
						redata[days].yys += dbs[i].number;
						redata[days].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 11) {
						redata[dbs[i].week - 1].szk = dbs[i].number;
						redata[dbs[i].week - 1].zj += dbs[i].number;
						redata[days].szk += dbs[i].number;
						redata[days].zj += dbs[i].number;
					}



				}
				output.iTotalRecords = days;
				output.sEcho = req.query['sEcho'] || req.body['sEcho'];
				output.iTotalDisplayRecords = days;
				output.aaData = redata;
				res.send(output);
			}

		});

	}
	//end 2
	else if (tjtype == 3) {
		var firstday = formatDate(new Date(tjvalue, 0, 1));
		var endday = formatDate(new Date(tjvalue, 11, 31));
		var sql = "SELECT count(*) as number,DepId,MONTH(date(orderTime)) as week  FROM `OrderRecords` where 1=1 ";
		sql += " and orderTime > '" + firstday + " 00:00:00' and orderTime < '" + endday + " 23:59:59'  group by DepId,MONTH(orderTime) order by MONTH(date(orderTime)) asc";
		Orders.query(sql, function(err, dbs) {
			if (err) {
				res.send({
					success: false,
					msg: '数据库查询发生错误：！' + util.inspect(err, false, null)
				});
			} else {

				var redata = [];

				for (var j = 0; j <= 12; j++) {
					var tmp = {};
					if (j == 12)
						tmp.tags = '总计';
					else {
						var month11 = j + 1;
						tmp.tags = month11 + '月';
					}
					tmp.wxjl = 0;
					tmp.shbxjl = 0;
					tmp.sjsjl = 0;
					tmp.ecgsjl = 0;
					tmp.jck = 0;
					tmp.yys = 0;
					tmp.szk = 0;
					tmp.zj = 0;
					redata[j] = tmp;
				}
				for (var i = 0; i < dbs.length; i++) {

					if (dbs[i].DepId == 1) {
						redata[dbs[i].week - 1].wxjl = dbs[i].number;
						redata[dbs[i].week - 1].zj += dbs[i].number;
						redata[12].wxjl += dbs[i].number;
						redata[12].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 3) {
						redata[dbs[i].week - 1].shbxjl = dbs[i].number;
						redata[dbs[i].week - 1].zj += dbs[i].number;
						redata[12].shbxjl += dbs[i].number;
						redata[12].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 7) {
						redata[dbs[i].week - 1].sjsjl = dbs[i].number;
						redata[dbs[i].week - 1].zj += dbs[i].number;
						redata[12].sjsjl += dbs[i].number;
						redata[12].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 8) {
						redata[dbs[i].week - 1].ecgsjl = dbs[i].number;
						redata[dbs[i].week - 1].zj += dbs[i].number;
						redata[12].ecgsjl += dbs[i].number;
						redata[12].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 6) {
						redata[dbs[i].week - 1].jck = dbs[i].number;
						redata[dbs[i].week - 1].zj += dbs[i].number;
						redata[12].jck += dbs[i].number;
						redata[12].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 5) {
						redata[dbs[i].week - 1].yys = dbs[i].number;
						redata[dbs[i].week - 1].zj += dbs[i].number;
						redata[12].yys += dbs[i].number;
						redata[12].zj += dbs[i].number;
					}

					if (dbs[i].DepId == 11) {
						redata[dbs[i].week - 1].szk = dbs[i].number;
						redata[dbs[i].week - 1].zj += dbs[i].number;
						redata[12].szk += dbs[i].number;
						redata[12].zj += dbs[i].number;
					}



				}
				output.iTotalRecords = 12;
				output.sEcho = req.query['sEcho'] || req.body['sEcho'];
				output.iTotalDisplayRecords = 12;
				output.aaData = redata;
				res.send(output);
			}

		});

	}
	//end 3

}

exports.paidanchart = function(req, res) {
	var tjvalue = req.query['tjvalue'] || req.body['tjvalue'];
	var Orders = require('../modules/crm/OrderRecords.js');
	var output = {};
	var now = new Date(); //当前日期 
	var nowYear = now.getFullYear(); //当前年 
	var kaishijieshu = mm(nowYear, tjvalue);
	var sql = "SELECT count(*) as number,DepId,OrderOptions,WEEKDAY(date(orderTime)) as week  FROM `OrderRecords` where 1=1 ";
	sql += " and orderTime > '" + kaishijieshu.first + " 00:00:00' and orderTime < '" + kaishijieshu.end + " 23:59:59'  group by DepId,OrderOptions,WEEKDAY(date(orderTime)) order by WEEKDAY(date(orderTime)) asc";
	Orders.query(sql, function(err, dbs) {
		if (err) {
			res.send({
				success: false,
				msg: '数据库查询发生错误：！' + util.inspect(err, false, null)
			});
		} else {
			var redata = [];
			var weekcn = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日', '总计'];
			for (var j = 0; j < weekcn.length; j++) {
				var tmp = {};
				tmp.tags = [weekcn[j]];
				tmp.wxjl = [0, 0, 0];
				tmp.shbxjl = [0, 0, 0];
				tmp.sjsjl = [0, 0, 0];
				tmp.ecgsjl = [0, 0, 0];
				tmp.jck = [0, 0, 0];
				tmp.yys = [0, 0, 0];
				tmp.szk = [0, 0, 0];
				tmp.zj = [0, 0, 0];
				redata[j] = tmp;
			}
			for (var i = 0; i < dbs.length; i++) {

				if (dbs[i].DepId == 1) {
					if (dbs[i].OrderOptions == 0) {
						redata[dbs[i].week].wxjl[0] = dbs[i].number;
						redata[dbs[i].week].zj[0] += dbs[i].number;
						redata[7].wxjl[0] += dbs[i].number;
						redata[7].zj[0] += dbs[i].number;
					}
					if (dbs[i].OrderOptions == 1) {
						redata[dbs[i].week].wxjl[1] = dbs[i].number;
						redata[dbs[i].week].zj[1] += dbs[i].number;
						redata[7].wxjl[1] += dbs[i].number;
						redata[7].zj[1] += dbs[i].number;
					}
					if (dbs[i].OrderOptions == 2) {
						redata[dbs[i].week].wxjl[2] = dbs[i].number;
						redata[dbs[i].week].zj[2] += dbs[i].number;
						redata[7].wxjl[2] += dbs[i].number;
						redata[7].zj[2] += dbs[i].number;
					}

				}

				if (dbs[i].DepId == 3) {


					if (dbs[i].OrderOptions == 0) {
						redata[dbs[i].week].shbxjl[0] = dbs[i].number;
						redata[dbs[i].week].zj[0] += dbs[i].number;
						redata[7].shbxjl[0] += dbs[i].number;
						redata[7].zj[0] += dbs[i].number;
					}
					if (dbs[i].OrderOptions == 1) {
						redata[dbs[i].week].shbxjl[1] = dbs[i].number;
						redata[dbs[i].week].zj[1] += dbs[i].number;
						redata[7].shbxjl[1] += dbs[i].number;
						redata[7].zj[1] += dbs[i].number;
					}
					if (dbs[i].OrderOptions == 2) {
						redata[dbs[i].week].shbxjl[2] = dbs[i].number;
						redata[dbs[i].week].zj[2] += dbs[i].number;
						redata[7].shbxjl[2] += dbs[i].number;
						redata[7].zj[2] += dbs[i].number;
					}

				}

				if (dbs[i].DepId == 7) {


					if (dbs[i].OrderOptions == 0) {
						redata[dbs[i].week].sjsjl[0] = dbs[i].number;
						redata[dbs[i].week].zj[0] += dbs[i].number;
						redata[7].sjsjl[0] += dbs[i].number;
						redata[7].zj[0] += dbs[i].number;
					}
					if (dbs[i].OrderOptions == 1) {
						redata[dbs[i].week].sjsjl[1] = dbs[i].number;
						redata[dbs[i].week].zj[1] += dbs[i].number;
						redata[7].sjsjl[1] += dbs[i].number;
						redata[7].zj[1] += dbs[i].number;
					}
					if (dbs[i].OrderOptions == 2) {
						redata[dbs[i].week].sjsjl[2] = dbs[i].number;
						redata[dbs[i].week].zj[2] += dbs[i].number;
						redata[7].sjsjl[2] += dbs[i].number;
						redata[7].zj[2] += dbs[i].number;
					}

				}

				if (dbs[i].DepId == 8) {

					if (dbs[i].OrderOptions == 0) {
						redata[dbs[i].week].ecgsjl[0] = dbs[i].number;
						redata[dbs[i].week].zj[0] += dbs[i].number;
						redata[7].ecgsjl[0] += dbs[i].number;
						redata[7].zj[0] += dbs[i].number;
					}
					if (dbs[i].OrderOptions == 1) {
						redata[dbs[i].week].ecgsjl[1] = dbs[i].number;
						redata[dbs[i].week].zj[1] += dbs[i].number;
						redata[7].ecgsjl[1] += dbs[i].number;
						redata[7].zj[1] += dbs[i].number;
					}
					if (dbs[i].OrderOptions == 2) {
						redata[dbs[i].week].ecgsjl[2] = dbs[i].number;
						redata[dbs[i].week].zj[2] += dbs[i].number;
						redata[7].ecgsjl[2] += dbs[i].number;
						redata[7].zj[2] += dbs[i].number;
					}

				}

				if (dbs[i].DepId == 6) {

					if (dbs[i].OrderOptions == 0) {
						redata[dbs[i].week].jck[0] = dbs[i].number;
						redata[dbs[i].week].zj[0] += dbs[i].number;
						redata[7].jck[0] += dbs[i].number;
						redata[7].zj[0] += dbs[i].number;
					}
					if (dbs[i].OrderOptions == 1) {
						redata[dbs[i].week].jck[1] = dbs[i].number;
						redata[dbs[i].week].zj[1] += dbs[i].number;
						redata[7].jck[1] += dbs[i].number;
						redata[7].zj[1] += dbs[i].number;
					}
					if (dbs[i].OrderOptions == 2) {
						redata[dbs[i].week].jck[2] = dbs[i].number;
						redata[dbs[i].week].zj[2] += dbs[i].number;
						redata[7].jck[2] += dbs[i].number;
						redata[7].zj[2] += dbs[i].number;
					}

				}

				if (dbs[i].DepId == 5) {

					if (dbs[i].OrderOptions == 0) {
						redata[dbs[i].week].yys[0] = dbs[i].number;
						redata[dbs[i].week].zj[0] += dbs[i].number;
						redata[7].yys[0] += dbs[i].number;
						redata[7].zj[0] += dbs[i].number;
					}
					if (dbs[i].OrderOptions == 1) {
						redata[dbs[i].week].yys[1] = dbs[i].number;
						redata[dbs[i].week].zj[1] += dbs[i].number;
						redata[7].yys[1] += dbs[i].number;
						redata[7].zj[1] += dbs[i].number;
					}
					if (dbs[i].OrderOptions == 2) {
						redata[dbs[i].week].yys[2] = dbs[i].number;
						redata[dbs[i].week].zj[2] += dbs[i].number;
						redata[7].yys[2] += dbs[i].number;
						redata[7].zj[2] += dbs[i].number;
					}

				}

				if (dbs[i].DepId == 11) {

					if (dbs[i].OrderOptions == 0) {
						redata[dbs[i].week].szk[0] = dbs[i].number;
						redata[dbs[i].week].zj[0] += dbs[i].number;
						redata[7].szk[0] += dbs[i].number;
						redata[7].zj[0] += dbs[i].number;
					}
					if (dbs[i].OrderOptions == 1) {
						redata[dbs[i].week].szk[1] = dbs[i].number;
						redata[dbs[i].week].zj[1] += dbs[i].number;
						redata[7].szk[1] += dbs[i].number;
						redata[7].zj[1] += dbs[i].number;
					}
					if (dbs[i].OrderOptions == 2) {
						redata[dbs[i].week].szk[2] = dbs[i].number;
						redata[dbs[i].week].zj[2] += dbs[i].number;
						redata[7].szk[2] += dbs[i].number;
						redata[7].zj[2] += dbs[i].number;
					}

				}



			}
			output.iTotalRecords = 8;
			output.sEcho = req.query['sEcho'] || req.body['sEcho'];
			output.iTotalDisplayRecords = 8;
			output.aaData = redata;
			res.send(output);
		}
	});
}

//格局化日期：yyyy-MM-dd 

function formatDate(date) {
	var myyear = date.getFullYear();
	var mymonth = date.getMonth() + 1;
	var myweekday = date.getDate();

	if (mymonth < 10) {
		mymonth = "0" + mymonth;
	}
	if (myweekday < 10) {
		myweekday = "0" + myweekday;
	}
	return (myyear + "-" + mymonth + "-" + myweekday);
}


function mm(year, week) {
	if (year == "" || week == "") return;
	var d = new Date(year, 0, 1);
	var currentDay = d.getDay();

	if (currentDay == 0) {
		currentDay = 7
	}
	d.setDate(currentDay == 1 ? ((week - 1) * 7 + currentday) : (7 - currentDay + 2 + (week - 1) * 7));
	var fe = getFirstAndEnd(d);
	var first = '',
		end = '';
	first = formatDate(fe.first);
	end = formatDate(fe.end);
	return {
		week: week,
		first: first,
		end: end
	};
}


function getFirstAndEnd(d) {
	var w = d.getDay(),
		n = 24 * 60 * 60 * 1000;
	if (w == 0) w = 7;
	var first = new Date(d.getTime() - (w - 1) * n);
	var end = new Date(d.getTime() + (7 - w) * n);
	return {
		first: first,
		end: end
	};
}