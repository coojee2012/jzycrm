  var soap = require('soap');
  var fs = require('fs');
  var util = require('util');
  var wcfurl = 'http://localhost:8088/JzyService.svc?wsdl';

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
  //获取客户档案列表
  exports.getCustoms = function(req, res) {
    var cunit = req.body["Vip_name"] || req.query["Vip_name"] || "";
    var cardnum = req.body["Card_id"] || req.query["Card_id"] || "";
    var jbr = req.body["Jbr"] || req.query["Jbr"] || "";
    var jieguo = {};
    jieguo.iTotalRecords = 10;
    jieguo.sEcho = req.query['sEcho'] || req.body['sEcho'];
    jieguo.iTotalDisplayRecords = 10;

    soap.createClient(wcfurl, function(err, client) {
      if (err) {
        console.log("连接服务发生异常！", err);
        res.send("连接服务发生异常！", util.inspect(err, null, null));
      }

      if (!client) {
        console.log("无法正常连接服务！");
        res.send("无法正常连接服务！");
      }
      client.getCustoms({
        cunit: cunit,
        cardnum: "",
        jbr: ""
      }, function(err, result, body) {
        //client.getCustom({tel:"13699012676"},function(err, result,body){
        if (err) {
          console.log("getCustoms err", util.inspect(err, null, null));
          res.send("getCustoms err:" + util.inspect(err, null, null));
        } else {
          console.log("getCustoms", result['getCustomsResult']);

          if (result['getCustomsResult'].CustomInfo)
            jieguo.aaData = result['getCustomsResult'].CustomInfo;
          else
            jieguo.aaData = [];
          res.send(jieguo);

        }


      });

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
var ItemName=req.body["ItemName"]||req.query["ItemName"]||"";
var Price=req.body["Price"]||req.query["Price"]||"";
var Itemrem=req.body["Itemrem"]||req.query["Itemrem"]||"";
var tiaocode=req.body["tiaocode"]||req.query["tiaocode"]||"";
var jieguo = {};
    jieguo.iTotalRecords = 10;
    jieguo.sEcho = req.query['sEcho'] || req.body['sEcho'];
    jieguo.iTotalDisplayRecords = 10;
     soap.createClient(wcfurl, function(err, client) {
      if (err) {
        console.log("连接服务发生异常！", err);
        res.send("连接服务发生异常！", util.inspect(err, null, null));
      }

      if (!client) {
        console.log("无法正常连接服务！");
        res.send("无法正常连接服务！");
      }
      client.getShopItems({
        itemname: ItemName,
        price: Price,
        rembercode: Itemrem,
        tiaocode:tiaocode
      }, function(err, result, body) {
        //client.getCustom({tel:"13699012676"},function(err, result,body){
        if (err) {
          console.log("getShopItems err", util.inspect(err, null, null));
          res.send("getShopItems err:" + util.inspect(err, null, null));
        } else {
          console.log("getShopItems", result['getShopItemsResult']);

          if (result['getShopItemsResult'].shopItemInfo)
            jieguo.aaData = result['getShopItemsResult'].shopItemInfo;
          else
            jieguo.aaData = [];
          res.send(jieguo);

        }


      });

    });

  }


exports.screenPopGet=function(req,res){
var callid=req.body['callid']||req.query['callid']; 
var unid=req.body['unid']||req.query['unid']; 
var caller=req.body['caller']||req.query['caller']; 
var called=req.body['called']||req.query['called']; 
var poptype=req.body['poptype']||req.query['poptype'];
var phone=caller || called || '';
var callmsg={};
callmsg.callid=callid;
callmsg.unid=unid || -1;
callmsg.caller=caller;
callmsg.called=called;
callmsg.poptype=poptype;
 soap.createClient(wcfurl, function(err, client) {
      if (err) {
        console.log("连接服务发生异常！", err);
        res.send("连接服务发生异常！", util.inspect(err, null, null));
      }

      if (!client) {
        console.log("无法正常连接服务！");
        res.send("无法正常连接服务！");
      }
      client.getCustom({
        telnum: phone
      }, function(err, result, body) {
        //client.getCustom({tel:"13699012676"},function(err, result,body){
        if (err) {
          console.log("getCustom err:", util.inspect(err, null, null));
         res.render('jzycustominfo/screenpop.html',{inst:null,phone:phone,error:err,callmsg:callmsg});
        } else {
          console.log("getCustom:", result['getCustomResult']);
          res.render('jzycustominfo/screenpop.html',{inst:result['getCustomResult'],phone:phone,error:null,callmsg:callmsg});

        }


      });

    });


  }

  exports.screenPopPost=function(req,res){


  }

