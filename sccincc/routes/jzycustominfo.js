  //var soap = require('soap');
  var fs = require('fs');
  var util = require('util');
  var MSSQL = require('../lib/mssqltds');
  var async = require('async');
  //var wcfurl = 'http://127.0.0.1:8088/JzyService.svc?wsdl';

   /* var config = {
    server: '192.168.1.2',
    userName: 'sa',
    password: 'sa',
    options: {
      debug: {
        packet: false,
        data: false,
        payload: false,
        token: false,
        log: false
      },
      tdsVersion: '7_1',
      database: 'hbposv7' //'bjexpert' //
    }

  };*/

  var config = {
    server: '127.0.0.1',
    userName: 'sa',
    password: '123456Aa',
    options: {
      debug: {
        packet: false,
        data: false,
        payload: false,
        token: false,
        log: false
      },
      tdsVersion: '7_2',
      database: 'hbpos7' //'bjexpert' //
    }

  };


  var mssql = new MSSQL(config);


  function SafePramas(str) {
    if (!str || str == '')
      return "";
    else {
      str = str.replace(/\'/g, '’');
      str = str.replace(/"/g, '”');
      str = str.replace(/\%/g, '%');
      str = str.replace(/\!/g, '！');
      str = str.replace(/\@/g, '@');
      str = str.replace(/\;/g, '；');
      return str;
    }
  }


  //获取客户档案列表
  exports.get = function(req, res) {
    var cunit = req.body["cunit"] || req.query["cunit"] || "";
    var where = {};
    where.Vip_name = '';
    where.Card_id = '';
    where.Jbr = '';
    res.render('jzycustominfo/index.html', {
      title: '客户档案列表',
      where: where
    });

  }



  exports.post = function(req, res) {
    var where = {};
    var query = req.body;
    for (var key in query) {
      where[key] = query[key] || '';
    }
    res.render('jzycustominfo/index.html', {
      title: '客户档案列表',
      where: where
    });

  }


  exports.indexThjl = function(req, res) {
    var cid = req.body["Card_id"] || req.query["Card_id"] || "";
    var dostate = req.body["DoState"] || req.query["DoState"] || -1;
    console.log(dostate);
    var where = {};
    where.KeyWords = '';
    where.Card_id = cid;
    where.TimeFrom = '';
    where.TimeTo = '';
    where.DoState = dostate;
    res.render('jzycustominfo/indexThjl.html', {
      title: '通话记录列表',
      cid: cid,
      where: where
    });

  }

  exports.indexThjlPost = function(req, res) {
    var card_id = req.body["Card_id"] || req.query["Card_id"] || "";
    var keywords = req.body["KeyWords"] || req.query["KeyWords"] || '';
    var dostate = req.body["DoState"] || req.query["DoState"] || -1;
    var timefrom = req.body["TimeFrom"] || req.query["TimeFrom"] || '';
    var timeto = req.body["TimeTo"] || req.query["TimeTo"] || '';
    var where = {};
    where.KeyWords = keywords;
    where.Card_id = card_id;
    where.TimeFrom = timefrom;
    where.TimeTo = timeto;
    where.DoState = dostate;
    res.render('jzycustominfo/indexThjl.html', {
      title: '通话记录列表',
      cid: card_id,
      where: where
    });

  }


  //获取通话记录列表
  exports.getCalls = function(req, res) {
    var card_id = req.body["Card_id"] || req.query["Card_id"];
    var keywords = req.body["KeyWords"] || req.query["KeyWords"] || "";
    var dostate = req.body["DoState"] || req.query["DoState"] || "";
    var timefrom = req.body["TimeFrom"] || req.query["TimeFrom"] || "";
    var timeto = req.body["TimeTo"] || req.query["TimeTo"] || "";
    var jieguo = {};
    var iDisplayStart = req.query['iDisplayStart'] || req.body['iDisplayStart'] || 0;
    var iDisplayLength = req.query['iDisplayLength'] || req.body['iDisplayLength'] || 10;
    if( iDisplayLength<1 )
      iDisplayLength=10;
    jieguo.iTotalRecords = 10;
    jieguo.sEcho = req.query['sEcho'] || req.body['sEcho'];
    jieguo.iTotalDisplayRecords = 10;

    /*
   WHERE id NOT IN
          (
          SELECT TOP 页大小*(页数-1) id FROM table1 ORDER BY id
          )
ORDER BY id
   */
    var sql = "select top " + iDisplayLength + " a.*,b.vip_name,b.social_id from callrecords a left join t_rm_vip_info b on b.card_id = a.cid ";
    var where = " where 1=1 ";
    if (card_id !== '') {
      where += " and a.cid = '" + card_id + "'";
    }
    if (keywords !== '') {
      where += " and (a.content like '%" + keywords + "%' or a.donesth like '%" + keywords + "%'";
      if (card_id !== '') {
        where += " or b.vip_name like '%" + keywords + "%'";
      }
      where += ")";
    }
    if (dostate !== '' && (dostate == "0" || dostate == "1" || dostate == "2")) {
      where += " and a.dostate = " + dostate;
    }
    if (timefrom !== '') {
      where += " and a.recordtime > '" + timefrom + "'";
    }
    if (timeto !== '') {
      where += " and a.recordtime < '" + timeto + "'";
    }
    var order = " order by a.dostate asc,a.recordtime desc ";
    var skiprows = iDisplayLength * iDisplayStart;
        skiprows=iDisplayStart;
    var sql2 = "select top " + skiprows + " a.cid from callrecords a left join t_rm_vip_info b on b.card_id = a.cid ";
    sql2 += where + order;

    sql += where + ' and a.cid not in (' + sql2 + ')' + order;

    var countsql = "select count(1) as cnt from callrecords a left join t_rm_vip_info b on b.card_id = a.cid ";
    countsql += where;

    console.log(sql);
    console.log(countsql);
    mssql.exec(countsql, function(err, count) {
      console.log(count);
       jieguo.iTotalRecords=count[0].cnt;
       jieguo.iTotalDisplayRecords = count[0].cnt;
      mssql.exec(sql, function(err, dbs) {
        console.log(dbs);
        jieguo.aaData = dbs;
        res.send(jieguo);
      });
    });


    


  }
  //获取客户档案列表
  exports.getCustoms = function(req, res) {
    var cunit = req.body["Vip_name"] || req.query["Vip_name"] || "";
    var cardnum = req.body["Card_id"] || req.query["Card_id"] || "";
    var jbr = req.body["Jbr"] || req.query["Jbr"] || "";
   
     var jieguo = {};
    var iDisplayStart = req.query['iDisplayStart'] || req.body['iDisplayStart'] || 0;
    var iDisplayLength = req.query['iDisplayLength'] || req.body['iDisplayLength'] || 10;
     if( iDisplayLength<1 )
      iDisplayLength=10;
    jieguo.iTotalRecords = 10;
    jieguo.sEcho = req.query['sEcho'] || req.body['sEcho'];
    jieguo.iTotalDisplayRecords = 10;

    var sql = "select top "+iDisplayLength+"  a.card_id,a.card_type,b.type_name,b.discount,a.vip_name,a.vip_sex,a.oper_id,c.oper_name,a.social_id,a.vip_add,a.vip_email,a.vip_tel,a.company,a.duty,a.mobile from t_rm_vip_info a ";
    sql += " left join t_rm_vip_type b on b.type_id=a.card_type ";
    sql += " left join t_sys_operator c on a.oper_id = c.oper_id   ";
    var where=" where 1=1";
    if (cunit !== '') {
      where += " and a.vip_name like '%" + SafePramas(cunit) + "%' ";
    }
    if (cardnum !== '') {
      where += " and a.card_id like '%" + SafePramas(cardnum) + "%' ";
    }
    if (jbr !== '') {
      where += " and a.social_id like '%" + SafePramas(jbr) + "%' ";
    }
    var order=" order by a.card_id asc ";

    var skiprows = iDisplayStart;
    
    var sql2 = "select top "+skiprows+"  a.card_id from t_rm_vip_info a ";
    sql2 += " left join t_rm_vip_type b on b.type_id=a.card_type ";
    sql2 += " left join t_sys_operator c on a.oper_id = c.oper_id   ";
    sql2+=where;
    sql2+=order;


    sql += where + ' and a.card_id not in (' + sql2 + ')' + order;

    var countsql = "select count(1) as cnt from t_rm_vip_info a left join t_rm_vip_type b on b.type_id=a.card_type left join t_sys_operator c on a.oper_id = c.oper_id ";
    countsql += where;
console.log(sql);
    console.log(countsql);
mssql.exec(countsql, function(err, count) {
      console.log(count);
       jieguo.iTotalRecords=count[0].cnt;
       jieguo.iTotalDisplayRecords = count[0].cnt;
    mssql.exec(sql, function(err, dbs) {
      jieguo.aaData = dbs;
      res.send(jieguo);
    });
  });




  }

  //根据会员卡号获取客户信息，唯一的
  exports.getCustomById = function(req, res) {
    var card_id = req.body["id"] || req.query['id'] || '';
    var sql = "select a.card_id,a.card_type,b.type_name,b.discount,a.vip_name,a.vip_sex,a.oper_id,c.oper_name,a.social_id,a.vip_add,a.vip_email,a.vip_tel,a.company,a.duty,a.mobile from t_rm_vip_info a ";
    sql += " left join t_rm_vip_type b on b.type_id=a.card_type ";
    sql += " left join t_sys_operator c on a.oper_id = c.oper_id where 1=1  ";
    sql += " and a.card_id='" + card_id + "'";
    console.log(sql);
    mssql.exec(sql, function(err, dbs) {
      res.send(dbs[0]);
    });

  
  }

  //获取商品档案列表
  exports.getShop = function(req, res) {
    var ItemName = req.body["ItemName"] || req.query["ItemName"] || "";
    var Price = req.body["Price"] || req.query["Price"] || "";
    var Itemrem = req.body["Itemrem"] || req.query["Itemrem"] || "";
    var where = {};
    where.ItemName = '';
    where.Price = '';
    where.Itemrem = '';
    res.render('jzycustominfo/shopindex.html', {
      title: '商品档案列表',
      where: where
    });

  }

  exports.postShop = function(req, res) {
    var where = {};
    var query = req.body;
    for (var key in query) {
      where[key] = query[key] || '';
    }
    res.render('jzycustominfo/shopindex.html', {
      title: '商品档案列表',
      where: where
    });

  }

  //获取商品档案
  exports.getShopItems = function(req, res) {
    var ItemName = req.body["ItemName"] || req.query["ItemName"] || "";
    var Price = req.body["Price"] || req.query["Price"] || "";
    var Itemrem = req.body["Itemrem"] || req.query["Itemrem"] || "";
    var tiaocode = req.body["tiaocode"] || req.query["tiaocode"] || "";
    var jieguo = {};
     var iDisplayStart = req.query['iDisplayStart'] || req.body['iDisplayStart'] || 0;
    var iDisplayLength = req.query['iDisplayLength'] || req.body['iDisplayLength'] || 10;
     if( iDisplayLength<1 )
      iDisplayLength=10;
    jieguo.iTotalRecords = 10;
    jieguo.sEcho = req.query['sEcho'] || req.body['sEcho'];
    jieguo.iTotalDisplayRecords = 10;
    var sql = "select top "+iDisplayLength+" a.item_no,a.item_subno, a.item_name,a.item_subname,a.item_clsno,b.item_clsname,a.unit_no,a.price,a.sale_price,a.en_dis,a.change_price,a.main_supcust,a.item_rem,c.stock_qty from t_bd_item_info a";
    sql += " left join t_bd_item_cls b  on a.item_clsno = b.item_clsno"; //获取商品类别
    sql += " left join t_im_branch_stock c on c.item_no = a.item_no  "; //获取库存
    var where=" where 1=1 ";
    if (ItemName !== '') {
      where += " and a.item_name like '%" + SafePramas(ItemName) + "%'";
    }
    if (Price !== '') {
      where += " and a.price like '%" + Price + "%'";
    }
    if (Itemrem !== '') {
      where += " and a.item_rem like '%" + SafePramas(Itemrem) + "%'";
    }
    var order=" order by a.item_no asc ";

    var skiprows = iDisplayStart;

    var sql2 = "select top "+skiprows+" a.item_no from t_bd_item_info a";
    sql2 += " left join t_bd_item_cls b  on a.item_clsno = b.item_clsno"; //获取商品类别
    sql2 += " left join t_im_branch_stock c on c.item_no = a.item_no  "; //获取库存
    sql2+=where+order;

    sql+= where + ' and a.item_no not in (' + sql2 + ')' + order;
var countsql = "select count(1) as cnt from t_bd_item_info a left join t_bd_item_cls b  on a.item_clsno = b.item_clsno left join t_im_branch_stock c on c.item_no = a.item_no ";
    countsql += where;

mssql.exec(countsql, function(err, count) {
      console.log(count);
       jieguo.iTotalRecords=count[0].cnt;
       jieguo.iTotalDisplayRecords = count[0].cnt;
    mssql.exec(sql, function(err, dbs) {
      jieguo.aaData = dbs;
      res.send(jieguo);
    });
  });

  

  }

  exports.getYgIndex = function(req, res) {
    var card_id = req.body["Card_id"] || req.query["Card_id"] || "";
    var keywords = req.body["KeyWords"] || req.query["KeyWords"] || '';
    var timefrom = req.body["TimeFrom"] || req.query["TimeFrom"] || '';
    var timeto = req.body["TimeTo"] || req.query["TimeTo"] || '';
    var where = {};
    where.KeyWords = keywords;
    where.Card_id = card_id;
    where.TimeFrom = timefrom;
    where.TimeTo = timeto;
    res.render('jzycustominfo/ygshop.html', {
      title: '已购商品列表',
      where: where
    });
  }
  //获取已购商品
  exports.getYGItems = function(req, res) {
    var card_id = req.body["Card_id"] || req.query["Card_id"] || "";
    var keywords = req.body["KeyWords"] || req.query["KeyWords"] || '';
    var timefrom = req.body["TimeFrom"] || req.query["TimeFrom"] || '';
    var timeto = req.body["TimeTo"] || req.query["TimeTo"] || '';
    var where = {};
    where.KeyWords = keywords;
    where.Card_id = card_id;
    where.TimeFrom = timefrom;
    where.TimeTo = timeto;
    var jieguo = {};
      var iDisplayStart = req.query['iDisplayStart'] || req.body['iDisplayStart'] || 0;
    var iDisplayLength = req.query['iDisplayLength'] || req.body['iDisplayLength'] || 10;
     if( iDisplayLength<1 )
      iDisplayLength=10;
    jieguo.iTotalRecords = 10;
    jieguo.sEcho = req.query['sEcho'] || req.body['sEcho'];
    jieguo.iTotalDisplayRecords = 10;

    var sql = " select top "+iDisplayLength+" a.flow_no,a.oper_date,b.sale_qnty,b.sale_money,c.item_no,c.item_name,c.item_rem from t_rm_payflow a ";
    sql += " left join t_rm_saleflow b on a.flow_no = b.flow_no";
    sql += " left join t_bd_item_info c on c.item_no=b.item_no";
    var where = " where 1=1";
    if (card_id !== '') {
      where += " and a.vip_no = '" + card_id + "'";
    }
    if (keywords !== '') {
      where += " and (c.item_name like '%" + keywords + "%' or c.item_rem like '%" + keywords + "%'";

      where += ")";
    }

    if (timefrom !== '') {
      where += " and a.oper_date > '" + timefrom + "'";
    }
    if (timeto !== '') {
      where += " and a.oper_date < '" + timeto + "'";
    }
    var order = " order by a.oper_date desc  ";
     var skiprows = iDisplayStart;

 var sql2 = " select top "+skiprows+" a.flow_no from t_rm_payflow a ";
    sql2 += " left join t_rm_saleflow b on a.flow_no = b.flow_no";
    sql2 += " left join t_bd_item_info c on c.item_no=b.item_no";

sql+= where + ' and a.flow_no not in (' + sql2 + ')' + order;

var countsql = "select count(1) as cnt from t_rm_payflow a  left join t_rm_saleflow b on a.flow_no = b.flow_no  left join t_bd_item_info c on c.item_no=b.item_no ";
    countsql += where;
mssql.exec(countsql, function(err, count) {
      console.log(count);
       jieguo.iTotalRecords=count[0].cnt;
       jieguo.iTotalDisplayRecords = count[0].cnt;
    mssql.exec(sql, function(err, dbs) {
      jieguo.aaData = dbs;
      res.send(jieguo);
    });
});
    
  }


  exports.screenPopGet = function(req, res) {
    var callid = req.body['callid'] || req.query['callid'];
    var unid = req.body['unid'] || req.query['unid'];
    var caller = req.body['caller'] || req.query['caller'];
    var called = req.body['called'] || req.query['called'];
    var poptype = req.body['poptype'] || req.query['poptype'];
    var phone = caller || called || '';
    var callmsg = {};
    callmsg.callid = callid;
    callmsg.unid = unid || -1;
    callmsg.caller = caller;
    callmsg.called = called;
    callmsg.poptype = poptype;

    var sql = "select a.card_id,a.card_type,b.type_name,b.discount,a.vip_name,a.vip_sex,a.oper_id,c.oper_name,a.social_id,a.vip_add,a.vip_email,a.vip_tel,a.company,a.duty,a.mobile from t_rm_vip_info a ";
    sql += " left join t_rm_vip_type b on b.type_id=a.card_type ";
    sql += " left join t_sys_operator c on a.oper_id = c.oper_id where 1=1  ";
    sql += " and a.vip_tel='" + phone + "' or a.mobile='" + phone + "'";
console.log(sql);

    var sql2="select type_id,discount,type_name from t_rm_vip_type";

     mssql.exec(sql2, function(err2, dbs2) {
      console.log(dbs2);
      var dddd={};
      for(var i=0;i<dbs2.length;i++){
        var tmpkey=dbs2[i].type_id.replace(/\s+/g,"");
        dddd["id_"+tmpkey]=dbs2[i].discount;
      }
      console.log(dddd);
        mssql.exec(sql, function(err, dbs) {
      res.render('jzycustominfo/screenpop.html', {
        inst: dbs[0],
        cardtype:util.inspect(dddd),
        cardtype2:dbs2,
        phone: phone,
        error: null,
        callmsg: callmsg
      });
    });

     });
  



  }

  exports.screenPopInsert = function(req, res) {
    var custom = {};
    custom.Vip_name = req.body['Vip_name'] || req.query['Vip_name'] || '';
    custom.Card_id = req.body['Card_id'] || req.query['Card_id'] || '';
    custom.Vip_sex = req.body['Vip_sex'] || req.query['Vip_sex'] || '';
    custom.Card_type = req.body['Card_type'] || req.query['Card_type'] || '';
    custom.Vip_tel = req.body['Vip_tel'] || req.query['Vip_tel'] || '';
    custom.Mobile = req.body['Mobile'] || req.query['Mobile'] || '';
    custom.Company = req.body['Company'] || req.query['Company'] || '';
    custom.Vip_add = req.body['Vip_add'] || req.query['Vip_add'] || '';
    custom.Jbr=req.body['Jbr'] || req.query['Jbr'] || '';
    var thjlstatus = req.body['thjlstatus'] || req.query['thjlstatus'] || 0;

    // custom.Jbr = req.body['Jbr'] || req.query['Jbr']||'';

    var sql = "insert into t_rm_vip_info (vip_name,card_id,vip_sex,card_type,card_status,oper_id,oper_date,vip_tel,mobile,company,vip_add,social_id) values('" + SafePramas(custom.Vip_name);

    sql += "','" + SafePramas(custom.Card_id);

    sql += "','" + SafePramas(custom.Vip_sex);
    sql += "'," + SafePramas(custom.Card_type);

    sql += ",0,'2001',GETDATE(),'" + SafePramas(custom.Vip_tel);

    sql += "','" + SafePramas(custom.Mobile);

    sql += "','" + SafePramas(custom.Company);

    sql += "','" + SafePramas(custom.Vip_add);

      sql += "','" + SafePramas(custom.Jbr);

    sql += "')";

console.log(sql);
    mssql.exec(sql, function(err, dbs) {

      if (thjlstatus == 0) {
        createpostThjlInsert(req, res);
      } else {
        createpostThjlUpdate(req, res);
      }

    });



  }

  exports.screenPopUpdate = function(req, res) {

    var custom = {};
    custom.Vip_name = req.body['Vip_name'] || req.query['Vip_name'] || '';
    custom.Card_id = req.body['Card_id'] || req.query['Card_id'] || '';
    custom.Vip_sex = req.body['Vip_sex'] || req.query['Vip_sex'] || '';
    custom.Card_type = req.body['Card_type'] || req.query['Card_type'] || '';
    custom.Vip_tel = req.body['Vip_tel'] || req.query['Vip_tel'] || '';
    custom.Mobile = req.body['Mobile'] || req.query['Mobile'] || '';
    custom.Company = req.body['Company'] || req.query['Company'] || '';
    custom.Vip_add = req.body['Vip_add'] || req.query['Vip_add'] || '';

    custom.Jbr=req.body['Jbr'] || req.query['Jbr'] || '';

    var thjlstatus = req.body['thjlstatus'] || req.query['thjlstatus'] || 0;

    var sql = "update t_rm_vip_info set vip_name='" + SafePramas(custom.Vip_name);


    if (custom.Vip_sex !== '')
      sql += "',vip_sex='" + SafePramas(custom.Vip_sex);
    sql += "',card_type='" + SafePramas(custom.Card_type);
    if (custom.Vip_tel !== '')
      sql += "',vip_tel='" + SafePramas(custom.Vip_tel);
    if (custom.Mobile !== '')
      sql += "',mobile='" + SafePramas(custom.Mobile);
    if (custom.Company !== '')
      sql += "',company='" + SafePramas(custom.Company);
    if (custom.Vip_add !== '')
      sql += "',vip_add='" + SafePramas(custom.Vip_add);
    if(custom.Jbr!=="")
      sql += "',social_id='" + SafePramas(custom.Jbr);

    sql += "' where card_id='" + SafePramas(custom.Card_id) + "'";
console.log(sql);
    mssql.exec(sql, function(err, dbs) {
      if (thjlstatus == 0) {
        createpostThjlInsert(req, res);
      } else {
        createpostThjlUpdate(req, res);
      }
    });


   
  }

  exports.createThjlGet = function(req, res) {
    var unitid = req.body["unid"] || req.query["unid"] || '';
    var cid = req.body["customid"] || req.query["customid"] || '';
    var vipname = req.body["vipname"] || req.query["vipname"] || '';
    var inst = {};
    inst.unid = unitid;
    inst.card_id = cid;
    inst.vipname = vipname;
    inst.content = '';
    inst.dostate = -1;
    inst.donesth = '';
    inst.exten = req.session.exten;
    inst.agentname = req.session.username;
    console.log("exten:", req.session.exten, "username:", req.session.username);

    res.render('jzycustominfo/createThjl.html', {
      title: '通话记录',
      msg: null,
      inst: inst
    });
  }

  var createpostThjlInsert = function(req, res) {

    var unitid = req.body["unid"] || req.query["unid"] || '';
    var cid = req.body['Card_id'] || req.query['Card_id'] || '';
    var phone = req.body["phone"] || req.query["phone"] || '';
    var content = req.body["content"] || req.query["content"] || '';
    var dostate = req.body["dostate"] || req.query["dostate"] || '';
    var donesth = req.body["donesth"] || req.query["donesth"] || '';

    var exten = req.session.exten;
    var agentname = req.session.username;
    var inst = {};
    inst.Unid = unitid;
    inst.Cid = cid;
    inst.Phone = phone;
    inst.Content = content;
    inst.DoState = dostate;
    inst.DoneSth = donesth;
    inst.AgentName = agentname;
    inst.Exten = exten;

    var sql = "insert into callrecords (unid,cid,phone,content,dostate,donesth,agentname,exten,recordtime,updatetime) values('" + SafePramas(inst.Unid);

    sql += "','" + SafePramas(inst.Cid);
    sql += "','" + SafePramas(inst.Phone);
    sql += "','" + SafePramas(inst.Content);
    sql += "'," + inst.DoState;
    sql += ",'" + SafePramas(inst.DoneSth);
    sql += "','" + SafePramas(inst.AgentName);
    sql += "','" + SafePramas(inst.Exten);
    sql += "',GETDATE(),GETDATE()";
    sql += ")";
console.log(sql);
    mssql.exec(sql, function(err, dbs) {
       res.send({Code:1,Message:"新增成功！"});
    });

  }

  var createpostThjlUpdate = function(req, res) {
    var unitid = req.body["unid"] || req.query["unid"] || '';
    var phone = req.body["phone"] || req.query["phone"] || '';
    var cid = req.body['Card_id'] || req.query['Card_id'] || '';
    var content = req.body["content"] || req.query["content"] || '';
    var dostate = req.body["dostate"] || req.query["dostate"] || '';
    var donesth = req.body["donesth"] || req.query["donesth"] || '';

    // var exten = req.session.exten;
    // var agentname = req.session.username;
    var inst = {};
    inst.Unid = unitid;
    inst.Cid = cid;
    inst.Content = content;
    inst.DoState = dostate;
    inst.DoneSth = donesth;
    // inst.AgentName = agentname;
    // inst.Exten = exten;

    var sql = "update callrecords set updatetime=GETDATE() ";


    if (inst.Content !== '')
      sql += ",content='" + SafePramas(inst.Content) + "'";

    sql += ",dostate=" + inst.DoState;

    if (inst.DoneSth !== '')
      sql += ",donesth='" + SafePramas(inst.DoneSth) + "'";


    sql += " where unid='" + inst.Unid + "' and cid='" + inst.Cid + "'";

console.log(sql);
    mssql.exec(sql, function(err, dbs) {
      res.send({Code:1,Message:"修改成功！"});
    });

  }


  exports.createThjlPost = function(req, res) {
    var unitid = req.body["unid"] || req.query["unid"] || '';
    var cid = req.body["card_id"] || req.query["card_id"] || '';
    var content = req.body["content"] || req.query["content"] || '';
    var dostate = req.body["dostate"] || req.query["dostate"] || '';
    var donesth = req.body["donesth"] || req.query["donesth"] || '';
    var exten = req.body["exten"] || req.query["exten"] || '';
    var agentname = req.body["agentname"] || req.query["agentname"] || '';
    var inst = {};
    inst.Unid = unitid;
    inst.Cid = cid;
    //inst.vipname=vipname;
    inst.Content = content;
    inst.DoState = dostate;
    inst.DoneSth = donesth;
    inst.AgentName = agentname;
    inst.Exten = exten;


    var sql = "insert into callrecords (unid,cid,phone,content,dostate,donesth,agentname,exten,recordtime,updatetime) values('" + SafePramas(Unid);

    sql += "','" + SafePramas(inst.Cid);
    sql += "','" + SafePramas(inst.Phone);
    sql += "','" + SafePramas(inst.Content);
    sql += "'," + inst.DoState;
    sql += ",'" + SafePramas(inst.DoneSth);
    sql += "','" + SafePramas(inst.AgentName);
    sql += "','" + SafePramas(inst.Exten);
    sql += "',GETDATE(),GETDATE()";
    sql += ")";
console.log(sql);
    mssql.exec(sql, function(err, dbs) {
      res.send({Code:1,Message:"新增成功！"});
    });




  }


  exports.editThjlGet = function(req, res) {
    var id = req.body["id"] || req.query["id"] || '';
    var cid = req.body["cid"] || req.query["cid"] || '-1';
    var dostate = req.body["DoState"] || req.query["DoState"] || -1;
    var where = {};
    where.KeyWords = '';
    where.Card_id = cid;
    where.TimeFrom = '';
    where.TimeTo = '';
    where.DoState = 0;

    var sql = "select a.*,b.vip_name from callrecords a left join t_rm_vip_info b on b.card_id = a.cid where 1=1 ";
    sql += " and a.id = " + id + "";
    mssql.exec(sql, function(err, dbs) {
      res.render('jzycustominfo/editThjl.html', {
        title: '通话记录',
        msg: null,
        DoState: dostate,
        inst: dbs[0]
      });
    });


  



  }


  exports.editThjlPost = function(req, res) {
    var id = req.body["id"] || req.query["id"] || '';
    var unitid = req.body["unid"] || req.query["unid"] || '';
    var cid = req.body["card_id"] || req.query["card_id"] || '';
    var content = req.body["content"] || req.query["content"] || '';
    var dostate = req.body["dostate"] || req.query["dostate"] || '';
    var donesth = req.body["donesth"] || req.query["donesth"] || '';
    var exten = req.body["exten"] || req.query["exten"] || '';
    var agentname = req.body["agentname"] || req.query["agentname"] || '';
    var inst = {};
    inst.Id = id;
    inst.Unid = unitid;
    inst.Cid = cid;
    //inst.vipname=vipname;
    inst.Content = content;
    inst.DoState = dostate;
    inst.DoneSth = donesth;
    inst.AgentName = agentname;
    inst.Exten = exten;

    console.log("UPDATE CALLS：", inst);

    var sql = "update callrecords set updatetime=GETDATE() ";


    if (inst.Content !== '')
      sql += ",content='" + SafePramas(inst.Content) + "'";

    sql += ",dostate=" + inst.DoState;

    if (inst.DoneSth !== '')
      sql += ",donesth='" + SafePramas(inst.DoneSth) + "'";


    sql += " where unid='" + inst.Unid + "' and cid='" + inst.Cid + "'";
console.log(sql);
    mssql.exec(sql, function(err, dbs) {
      //res.send({Code:1,Message:"保存成功！"});
      res.redirect('/jzy/listThjl?cid=' + cid + '&DoState=' + dostate);
    });

    /* soap.createClient(wcfurl, function(err, client) {
      if (err) {
        console.log("连接服务发生异常！", err);
        res.render('jzycustominfo/editThjl.html', {
          title: '通话记录',
          msg: err,
          inst: inst
        });
        //res.send("连接服务发生异常！", util.inspect(err, null, null));
      }

      if (!client) {
        console.log("无法正常连接服务！");
        res.render('jzycustominfo/editThjl.html', {
          title: '通话记录',
          msg: "无法正常连接服务！",
          inst: inst
        });
      }
      client.updateCalls({
        Unid: unitid,
        Cid: cid,
        Content: content,
        DoState: dostate,
        DoneSth: donesth
      }, function(err, result, body) {
        if (err) {
          console.log("updateCalls err:", util.inspect(err, null, null));
          res.render('jzycustominfo/editThjl.html', {
            title: '通话记录',
            msg: err,
            inst: inst
          });
        } else {
          console.log("updateCalls:", result['updateCallsResult']);
          //res.send(result['updateCustomResult']);
          res.redirect('/jzy/listThjl?cid=' + cid + '&DoState=' + dostate);

        }


      });

    });*/



  }