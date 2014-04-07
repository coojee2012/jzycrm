var util = require('util');
var EventProxy = require('eventproxy');
//var soap = require('soap');
var fs = require('fs');
//var wcfurl = 'http://127.0.0.1:8088/JzyService.svc?wsdl';
  var MSSQL = require('../lib/mssqltds');
var config = {
    server: '127.0.0.1',
    userName: 'sa',
    password: '123',
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

   /*var config = {
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

  };
*/

  var mssql = new MSSQL(config);
exports.get = function(req, res) {
  var ep = new EventProxy();
  ep.all('gd', function(gd) {
    // 在所有指定的事件触发后，将会被调用执行
    // 参数对应各自的事件名
    var tonum = {
      gd: gd
    };
    res.render('RemindReacords/index.html', {
      inst: tonum,
      error: null,
      callmsg: null
    });
  });

  var sql = "select  *  from callrecords  ";
    mssql.exec(sql, function(err, dbs) {
      var jieguo={};
      jieguo.aaData = dbs;
      var count = jieguo.aaData.length;
      var notdo = 0;
      var waitdo = 0;
      for (var i = 0; i < jieguo.aaData.length; i++) {
        if (jieguo.aaData[i].dostate == 0) {
          notdo += 1;
        }
        if (jieguo.aaData[i].dostate == 1) {
          waitdo += 1;
        }

      }
      ep.emit('gd', {
        count: count,
        notdo: notdo,
        waitdo: waitdo
      });
    
    });


}

exports.jsonget = function(req, res) {
  var ep = new EventProxy();
  ep.all('gd', function(gd) {
    // 在所有指定的事件触发后，将会被调用执行
    // 参数对应各自的事件名
    var tonum = {
      gd: gd
    };
    res.send({
      success: true,
      inst: tonum,
      error: null,
      callmsg: null
    });
  });

  var sql = "select  *  from callrecords  ";
    mssql.exec(sql, function(err, dbs) {
      var jieguo={};
      jieguo.aaData = dbs;
      var count = jieguo.aaData.length;
      var notdo = 0;
      var waitdo = 0;
      for (var i = 0; i < jieguo.aaData.length; i++) {
        if (jieguo.aaData[i].dostate == 0) {
          notdo += 1;
        }
        if (jieguo.aaData[i].dostate == 1) {
          waitdo += 1;
        }

      }
      ep.emit('gd', {
        count: count,
        notdo: notdo,
        waitdo: waitdo
      });
    
    });

}



exports.post = function(req, res) {
  res.render('RemindReacords/index.html', {
    inst: null,
    error: null,
    callmsg: null
  });
}