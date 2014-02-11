  var soap = require('soap');
  var fs = require('fs');
  var util = require('util');
  var wcfurl = 'http://127.0.0.1:8088/JzyService.svc?wsdl';

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
    var keywords = req.body["KeyWords"] || req.query["KeyWords"];
    var dostate = req.body["DoState"] || req.query["DoState"] || "";
    var timefrom = req.body["TimeFrom"] || req.query["TimeFrom"];
    var timeto = req.body["TimeTo"] || req.query["TimeTo"];
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
      } else {
        client.getCalls({
          keywords: keywords,
          card_id: card_id,
          dostate: dostate,
          timefrom: timefrom,
          timeto: timeto

        }, function(err, result, body) {
          //client.getCustom({tel:"13699012676"},function(err, result,body){
          if (err) {
            console.log("getCalls err", util.inspect(err, null, null));
            res.send("getCalls err:" + util.inspect(err, null, null));
          } else {
            console.log("getCalls", result['getCallsResult']);
            if (Object.prototype.toString.call(result['getCallsResult'].CallRecords) === '[object Array]') {
              jieguo.aaData = result['getCallsResult'].CallRecords;
            } else if (result['getCallsResult'].CallRecords) {
              jieguo.aaData = [];
              jieguo.aaData.push(result['getCallsResult'].CallRecords);
            } else
              jieguo.aaData = [];
            res.send(jieguo);

          }


        });
      }

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
    //console.log(soap);
    soap.createClient(wcfurl, function(err, client) {
      // console.log(client);
      if (err) {
        console.log("连接服务发生异常！", err);
        res.send("连接服务发生异常！", util.inspect(err, null, null));
      }

      if (!client) {
        console.log("无法正常连接服务！");
        res.send("无法正常连接服务！");
      } else {
        client.getCustoms({
          cunit: cunit,
          cardnum: cardnum,
          jbr: jbr
        }, function(err, result, body) {
          //client.getCustom({tel:"13699012676"},function(err, result,body){
          if (err) {
            console.log("getCustoms err", util.inspect(err, null, null));
            res.send("getCustoms err:" + util.inspect(err, null, null));
          } else {
            console.log("getCustoms", result['getCustomsResult']);

            if (Object.prototype.toString.call(result['getCustomsResult'].CustomInfo) === '[object Array]') {
              jieguo.aaData = result['getCustomsResult'].CustomInfo;
            } else if (result['getCustomsResult'].CustomInfo) {
              jieguo.aaData = [];
              jieguo.aaData.push(result['getCustomsResult'].CustomInfo);
            } else
              jieguo.aaData = [];
            res.send(jieguo);

          }


        });
      }

    });



  }

  //根据会员卡号获取客户信息，唯一的
  exports.getCustomById = function(req, res) {
    var card_id = req.body["id"] || req.query['id'] || '';

    soap.createClient(wcfurl, function(err, client) {
      if (err) {
        console.log("连接服务发生异常！", err);
        res.send("连接服务发生异常！", util.inspect(err, null, null));
      }

      if (!client) {
        console.log("无法正常连接服务！");
        res.send("无法正常连接服务！");
      }
      client.getCustomById({
        cardid: card_id
      }, function(err, result, body) {

        if (err) {
          console.log("getCustomById err:", util.inspect(err, null, null));
          res.send({});

        } else {
          console.log("getCustomById:", result['getCustomByIdResult']);
          res.send(result['getCustomByIdResult']);
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
    var ItemName = req.body["ItemName"] || req.query["ItemName"] || "";
    var Price = req.body["Price"] || req.query["Price"] || "";
    var Itemrem = req.body["Itemrem"] || req.query["Itemrem"] || "";
    var tiaocode = req.body["tiaocode"] || req.query["tiaocode"] || "";
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
      } else {
        client.getShopItems({
          itemname: ItemName,
          price: Price,
          rembercode: Itemrem,
          tiaocode: tiaocode
        }, function(err, result, body) {
          //client.getCustom({tel:"13699012676"},function(err, result,body){
          if (err) {
            console.log("getShopItems err", util.inspect(err, null, null));
            res.send("getShopItems err:" + util.inspect(err, null, null));
          } else {
            console.log("getShopItems", result['getShopItemsResult']);
            if (Object.prototype.toString.call(result['getShopItemsResult'].shopItemInfo) === '[object Array]') {
              jieguo.aaData = result['getShopItemsResult'].shopItemInfo;
            } else if (result['getShopItemsResult'].shopItemInfo) {
              jieguo.aaData = [];
              jieguo.aaData.push(result['getShopItemsResult'].shopItemInfo);
            } else
              jieguo.aaData = [];
            res.send(jieguo);

          }


        });
      }

    });

  }

  exports.getYgIndex=function(req,res){
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
  exports.getYGItems=function(req,res){
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
      } else {
        client.getYgItems({
          keywords: keywords,
          card_id: card_id,
          timefrom: timefrom,
          timeto: timeto
        }, function(err, result, body) {
          if (err) {
            console.log("getYgItems err", util.inspect(err, null, null));
            res.send("getYgItems err:" + util.inspect(err, null, null));
          } else {
            console.log("getYgItems", result['getYgItemsResult']);
            if (Object.prototype.toString.call(result['getYgItemsResult'].YGous) === '[object Array]') {
              jieguo.aaData = result['getYgItemsResult'].YGous;
            } else if (result['getYgItemsResult'].YGous) {
              jieguo.aaData = [];
              jieguo.aaData.push(result['getYgItemsResult'].YGous);
            } else
              jieguo.aaData = [];
            res.send(jieguo);

          }


        });
      }

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
          res.render('jzycustominfo/screenpop.html', {
            inst: null,
            phone: phone,
            error: err,
            callmsg: callmsg
          });
        } else {
          console.log("getCustom:", result['getCustomResult']);
          res.render('jzycustominfo/screenpop.html', {
            inst: result['getCustomResult'],
            phone: phone,
            error: null,
            callmsg: callmsg
          });

        }


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
    var thjlstatus = req.body['thjlstatus'] || req.query['thjlstatus'] || 0;

    // custom.Jbr = req.body['Jbr'] || req.query['Jbr']||'';


    soap.createClient(wcfurl, function(err, client) {
      if (err) {
        console.log("连接服务发生异常！", err);
        res.send("连接服务发生异常！", util.inspect(err, null, null));
      }

      if (!client) {
        console.log("无法正常连接服务！");
        res.send("无法正常连接服务！");
      }
      client.insertCustom(custom, function(err, result, body) {
        if (err) {
          console.log("insertCustom err:", util.inspect(err, null, null));
          res.send({});
        } else {
          console.log("insertCustom:", result['insertCustomResult']);
          // res.send(result['insertCustomResult']);
          if (thjlstatus == 0) {
            createpostThjlInsert(req, res);
          } else {
            createpostThjlUpdate(req, res);
          }


        }


      });

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
    var thjlstatus = req.body['thjlstatus'] || req.query['thjlstatus'] || 0;

    // custom.Jbr = req.body['Jbr'] || req.query['Jbr']||'';
    soap.createClient(wcfurl, function(err, client) {
      if (err) {
        console.log("连接服务发生异常！", err);
        res.send("连接服务发生异常！", util.inspect(err, null, null));
      }

      if (!client) {
        console.log("无法正常连接服务！");
        res.send("无法正常连接服务！");
      }
      client.updateCustom(custom, function(err, result, body) {
        if (err) {
          console.log("updateCustom err:", util.inspect(err, null, null));
          res.send({});
        } else {
          console.log("updateCustom:", result['updateCustomResult']);
          //res.send(result['updateCustomResult']);
          if (thjlstatus == 0) {
            createpostThjlInsert(req, res);
          } else {
            createpostThjlUpdate(req, res);
          }


        }


      });

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
    var phone=req.body["phone"] || req.query["phone"] || '';
    var content = req.body["content"] || req.query["content"] || '';
    var dostate = req.body["dostate"] || req.query["dostate"] || '';
    var donesth = req.body["donesth"] || req.query["donesth"] || '';

    var exten = req.session.exten;
    var agentname = req.session.username;
    var inst = {};
    inst.Unid = unitid;
    inst.Cid = cid;
    inst.Phone=phone;
    inst.Content = content;
    inst.DoState = dostate;
    inst.DoneSth = donesth;
    inst.AgentName = agentname;
    inst.Exten = exten;

    soap.createClient(wcfurl, function(err, client) {
      if (err) {
        console.log("连接服务发生异常！", err);
        res.send("连接服务发生异常！", util.inspect(err, null, null));
      }

      if (!client) {
        console.log("无法正常连接服务！");
        res.send("连接服务发生异常！");
      }

      client.insertCalls(inst, function(err, result, body) {
        if (err) {
          console.log("insertCalls err:", util.inspect(err, null, null));
          res.send("连接服务发生异常！", util.inspect(err, null, null));
        } else {
          console.log("insertCalls:", result['insertCallsResult']);
          res.send(result['insertCallsResult']);


        }


      });

    });


  }

  var createpostThjlUpdate = function(req, res) {
    var unitid = req.body["unid"] || req.query["unid"] || '';
    var phone=req.body["phone"] || req.query["phone"] || '';
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

    soap.createClient(wcfurl, function(err, client) {
      if (err) {
        console.log("连接服务发生异常！", err);
        res.send("连接服务发生异常！", util.inspect(err, null, null));
      }

      if (!client) {
        console.log("无法正常连接服务！");
        res.send("连接服务发生异常！");
      }

      client.updateCalls(inst, function(err, result, body) {
        if (err) {
          console.log("updateCalls err:", util.inspect(err, null, null));
          res.send("连接服务发生异常！", util.inspect(err, null, null));
        } else {
          console.log("updateCalls:", result['updateCallsResult']);
          res.send(result['updateCallsResult']);


        }


      });

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

    //console.log(inst);
    soap.createClient(wcfurl, function(err, client) {
      if (err) {
        console.log("连接服务发生异常！", err);
        res.render('jzycustominfo/createThjl.html', {
          title: '通话记录',
          msg: err,
          inst: null
        });
        //res.send("连接服务发生异常！", util.inspect(err, null, null));
      }

      if (!client) {
        console.log("无法正常连接服务！");
        res.render('jzycustominfo/createThjl.html', {
          title: '通话记录',
          msg: "无法正常连接服务！",
          inst: null
        });
      }
      client.insertCalls(inst, function(err, result, body) {
        if (err) {
          console.log("insertCalls err:", util.inspect(err, null, null));
          res.render('jzycustominfo/createThjl.html', {
            title: '通话记录',
            msg: err,
            inst: null
          });
        } else {
          console.log("insertCalls:", result['insertCallsResult']);
          //res.send(result['updateCustomResult']);
          res.redirect('/jzy/listThjl?cid=' + cid);

        }


      });

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

    soap.createClient(wcfurl, function(err, client) {
      if (err) {
        console.log("连接服务发生异常！", err);
        res.render('jzycustominfo/indexThjl.html', {
          title: '通话记录列表',
          cid: cid,
          where: where
        });
        //res.send("连接服务发生异常！", util.inspect(err, null, null));
      }

      if (!client) {
        console.log("无法正常连接服务！");
        res.render('jzycustominfo/indexThjl.html', {
          title: '通话记录列表',
          cid: cid,
          where: where
        });
      }
      client.findCalls({
        id: id
      }, function(err, result, body) {
        if (err) {
          console.log("findCalls err:", util.inspect(err, null, null));
          res.render('jzycustominfo/indexThjl.html', {
            title: '通话记录列表',
            cid: cid,
            where: where
          });
        } else {
          console.log("findCalls:", result['findCallsResult']);
          var inst = {};
          inst.id = result['findCallsResult'].Id;
          inst.unid = result['findCallsResult'].Unid;
          inst.card_id = result['findCallsResult'].Cid
          inst.vipname = result['findCallsResult'].Vip_name || '';
          inst.content = result['findCallsResult'].Content || '';
          inst.dostate = result['findCallsResult'].DoState;
          inst.donesth = result['findCallsResult'].DoneSth || '';
          inst.exten = result['findCallsResult'].Exten || '';
          inst.agentname = result['findCallsResult'].AgentName || '';

          console.log("INST:", inst);

          res.render('jzycustominfo/editThjl.html', {
            title: '通话记录',
            msg: null,
            DoState:dostate,
            inst: inst
          });

        }


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

    console.log("UPDATE CALLS：",inst);
    soap.createClient(wcfurl, function(err, client) {
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
        Cid:cid,
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
          res.redirect('/jzy/listThjl?cid=' + cid+'&DoState='+dostate);

        }


      });

    });



  }