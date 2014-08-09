var async = require('async');
var moment = require('moment');
var guid = require('guid');

var callsession = require('../modules/ippbx/callsession');
var recordfiles = require('../modules/ippbx/recordfiles');
var extension = require('../modules/ippbx/extension');
var callevent = require('../modules/ippbx/callevent');

var routing = function(v) {
  this.context = v.context;
  this.args = v.args;
  this.logger = v.logger;
  this.vars = v.vars;
  this.sessionnum = ""; // guid.create();
  this.ivrlevel = 0;
  this.transferlevel = 0; //防止呼叫转移死循环
  this.lastinputkey = '';
  this.activevar = {}; //用户存储用户输入的临时变量
};

module.exports = routing;

routing.prototype.router = function() {
  var self = this;
  var context = self.context;
  var logger = self.logger;
  var args = self.args;
  var vars = self.vars;
  self.routerline = args.routerline;
  self.sessionnum = vars.agi_uniqueid.replace(/\./, "");
  logger.debug("进入路由处理！");
  //self.args.called=self.args.called ||  self.vars.agi_dnid || self.vars.agi_extension;
  async.auto({
    AddCDR: function(cb) {

      var callnumber = null,
        exten = null;

      /*if (args.routerline === "1") {
        callnumber = vars.agi_callerid;
        exten = args.called;
         logger.debug("呼叫方向1：", args.routerline,callnumber,exten);
      } else {
        exten = vars.agi_callerid;
        callnumber = args.called;
        logger.debug("呼叫方向2：", args.routerline,callnumber,exten);
      }*/

      var mod = {}; // new callsession();
      mod.id = self.sessionnum;
      mod.cretime = moment().format("YYYY-MM-DD HH:mm:ss");
      mod.routerline = args.routerline;
      mod.callernumber = vars.agi_callerid;
      mod.extension = args.called;
      mod.frist_cdruniqueid = self.sessionnum; //vars.agi_uniqueid.replace(/\./,"");
      mod.accountcode = self.sessionnum;
      logger.debug("添加CDR，主叫：",vars.agi_callerid,",被叫:",args.called);
      callsession.create(mod, function(err, inst) {
        cb(err, inst);
      });
    },
    Route: ['AddCDR',
      function(cb, results) {
        var processmode = null;
        var processdefined = null;
        var match = false;
        //呼入=1
        if (args.routerline === "1") {
          self["queue"](401, 1, function(err, result) {
            cb(err, result);
          });
        }
        //呼出=2
        else {
          if (/^80\d\d/.test(args.called)) {
            self["extension"](args.called, 1, function(err, result) {
              cb(err, result);
            });

          } else {
            var called = args.called;
            if (called.length == 5 && /^9/.test(called)) {
              called = called.replace(/^9/, "");
              logger.debug("9called:", called);
            } else if (!(/^0/.test(called))) {
              called = "0" + called;
              logger.debug("0called:", called);
            }

            self["dialout"](called, function(err, result) {
              cb(err, result);
            });
          }
        }
      }
    ]
  }, function(err, results) {
    if (err) {
      logger.error(err);
      logger.debug("当前上下文状态：" + context.state + '，上下文流是否可读：' + context.stream.readable);
      if (context.stream && context.stream.readable) {
        context.hangup(function(err, rep) {});
      }

    } else {
      logger.debug("当前上下文状态：" + context.state + '，上下文流是否可读：' + context.stream.readable);
      if (context.stream && context.stream.readable) {
        context.hangup(function(err, rep) {
          logger.debug("来自自动挂机");
        });
      }
    }
  });
}


//拨打外部电话
routing.prototype.dialout = function(linenum, callback) {
  var self = this;
  var context = self.context;
  var logger = self.logger;
  var args = self.args;
  var vars = self.vars;
  async.auto({
    getdymember: function(cb, results) {
      extension.findOne({
        where: {
          accountcode: vars.agi_callerid
        }
      }, function(err, inst) {
        cb(err, inst);
      });
    },
    updateCDR: ["getdymember",
      function(cb, results) {

        callsession.findOne({
          where: {
            id: self.sessionnum
          },
          order: "cretime desc"
        }, function(err, inst) {
          if (err || inst == null) {
            logger.error("外呼更新呼叫记录发生异常:", err);
            cb("外呼更新呼叫记录发生异常！", inst);
          } else {
            var doymicaccount=vars.agi_callerid;
            if(results.getdymember && results.getdymember.doymicaccount)
              doymicaccount=results.getdymember.doymicaccount;

            inst.accountcode = doymicaccount;
           // inst.extension = vars.agi_callerid;
            callsession.updateOrCreate(inst, function(err, o) {
              cb(err, o);
            });
          }
        });


      }
    ],
    updatePopScreen: ['updateCDR',
      function(cb, results) {

        callevent.findOne({
          where: {
            extensionnumber: vars.agi_callerid
          }
        }, function(err, inst) {
          if (err || inst == null) {
            logger.error("写入弹屏数据发生异常:", err);
            cb("写入弹屏数据发生异常！", inst);
          } else {
            inst.callernumber = vars.agi_callerid;
            inst.callednumber = linenum || args.called;
            inst.routerdype = 2;
            inst.status = 'waite';
            inst.creattime = moment().format("YYYY-MM-DD HH:mm:ss");
            inst.callid = self.sessionnum;
            inst.uid = self.sessionnum;
            callevent.updateOrCreate(inst, function(err, o) {
              cb(err, o);
            });
          }
        });


      }
    ],
    automonitor: ["updateCDR",
      function(cb, results) {
        var doymicaccount=vars.agi_callerid;
            if(results.getdymember && results.getdymember.doymicaccount)
              doymicaccount=results.getdymember.doymicaccount;

           // inst.accountcode = doymicaccount;

        //var dycn = results.getdymember.doymicaccount || vars.agi_callerid;
        self.sysmonitor(doymicaccount, "caller", cb);
      }
    ],
    dial: ['automonitor',
      function(cb, results) {
        var trunkproto = "SIP";
        var trunkdevice = "siptrunk";
        var called = linenum || args.called;


        var channele = "";
        if (trunkproto === 'PRI' || trunkproto === 'FXO') {
          channele = 'DAHDI/g' + trunkdevice;
        } else {
          channele = trunkproto + '/' + trunkdevice;
        }
        //context.ChannelStatus(channele, function(err, reponse) {
        //logger.debug('线路状态：', reponse);
        context.Dial(channele + '/' + called, 60, "tr", function(err, response) {
          if (err) {
            cb(err, response);
          } else {
            context.getVariable('DIALSTATUS', function(err, response) {
              cb(null, response);
            });
          }
        });
        //});

      }
    ],
    afterdial: ['dial',
      function(cb, results) {
        var re = /(\d+)\s+\((\w+)\)/;
        var anwserstatus = null;
        if (re.test(results.dial.result)) {
          anwserstatus = RegExp.$2;
        }
        logger.debug("应答状态：", anwserstatus);
        cb(null, 1);
      }
    ]

  }, function(err, results) {
    callback(err, results);
  });
};

//拨打分机
routing.prototype.extension = function(extennum, assign, callback) {
  var self = this;
  var context = self.context;
  var logger = self.logger;

  var vars = self.vars;
  self.args.called = extennum;
  var args = self.args;
  async.auto({
    getdymember: function(cb, results) {
          extension.findOne({
              where: {
                  accountcode: extennum
              }
          }, function(err, inst) {
              cb(err, inst);
          });
      },
    automonitor: ["getdymember",
          function(cb, results) {

             var doymicaccount=vars.agi_callerid;
            if(results.getdymember && results.getdymember.doymicaccount)
              doymicaccount=results.getdymember.doymicaccount;

           // inst.accountcode = doymicaccount;

              //var dycn = results.getdymember.doymicaccount || vars.agi_callerid;
              self.sysmonitor(doymicaccount, "callee", cb);
          }
      ],
    dial:["automonitor", function(cb, resluts) {
      var extenproto = 'SIP';
      var timeout = '60';
      timeout = parseInt(timeout);
      context.Dial(extenproto + '/' + extennum, timeout, 'tr', function(err, response) {
        logger.debug("拨打分机返回结果：", response);
        if (err) {
          cb(err, response);
        } else {
          context.getVariable('DIALSTATUS', function(err, response) {
            cb(null, response);
          });
        }
      });

    }],
    afterdial: ['dial',
      function(cb, resluts) {
        var re = /(\d+)\s+\((\w+)\)/;
        var anwserstatus = null;
        if (re.test(resluts.dial.result)) {
          anwserstatus = RegExp.$2;
        }
        logger.debug("应答状态：", anwserstatus);



        if (anwserstatus !== 'ANSWER') {
          cb("应答不成功。", -1);
        } else {
          logger.debug("应答成功。");
          cb(null, 1);
        }
      }
    ]
  }, function(err, results) {
    callback(err, results);
  });
}


//发起系统录音
routing.prototype.sysmonitor = function(monitype, calltype, callback) {
  var self = this;
  var context = self.context;
  var logger = self.logger;
  var args = self.args;
  var vars = self.vars;
  if (typeof(monitype) === 'function') {
    callback = monitype;
    monitype = '';
  }
  async.auto({
    //添加一条录音记录
    addRecords: function(cb) {
      var filename = self.sessionnum;
      var extennum = calltype === 'callee' ? args.called : vars.agi_callerid;
      var callnumber = calltype === 'callee' ? vars.agi_callerid : args.called;
      //var extennum = args.called;
      //var callnumber = vars.agi_callerid;
      var mod = new recordfiles();
      mod.filename = filename;
      mod.extname = 'wav';
      mod.folder = "/var/spool/asterisk/monitor/3/";
      mod.callnumber = callnumber;
      mod.extennum = extennum;
      mod.calltype = calltype;
      mod.doymicac = monitype;
      mod.save(function(err, inst) {
        cb(err, inst);
      });
    },
    //开始录音
    monitor: ['addRecords',
      function(cb, results) {
        var path = '/var/spool/asterisk/monitor/3/';
        var filename = self.sessionnum + '.wav';
        context.MixMonitor(path + filename, 'ab', '', function(err, response) {
          if (err) {
            cb('自动录音发生异常.', err);
          } else {
            cb(null, response);
          }
        });
      }
    ]
  }, function(err, results) {
    if (err) {
      logger.error("自动录音，发生错误：", err);
      callback(null, err); //录音模块发生错误，不中断正常流程
    } else {
      callback(null, null);
    }
  });

};

//拨打队列
routing.prototype.queue = function(queuenum, assign, callback) {
  var self = this;
  var context = self.context;
  var logger = self.logger;
  var args = self.args;
  var vars = self.vars;
  async.auto({
    Answer: function(cb, results) {
      context.answer(function(err, response) {
        if (err)
          logger.error(err);

        logger.debug("Answer应答结果：", response);
        cb(err, response);
      });
    },
    // $AGI->exec('playback','./user_custom/stopwater');
    stopwater: ['Answer',
      function(cb, results) {
        context.Playback('user_custom/stopwater', function(err, response) {
          cb(err, response);
        });
      }
    ],
    queue: ['stopwater',
      function(cb, results) {
        //Queue(queuename,options,URL,announceoverride,timeout,agi,cb)
        var queuetimeout = 60;
        context.Queue(queuenum, 'tc', '', '', queuetimeout, 'agi://127.0.0.1:4574/queueAnswered?queuenum=' + queuenum + '&sessionnum=' + self.sessionnum, function(err, response) {
          logger.debug("队列拨打返回结果:", response);
          cb(err, response);
        });
      }
    ],

    getQueueStatus: ['queue',
      function(cb, results) {
        context.getVariable('QUEUESTATUS', function(err, response) {
          logger.debug("获取呼叫队列状态response：", response);

          var queueStatus = '';
          var reg = /(\d+)\s+\((.*)\)/;
          var c = null,
            id = null;
          if (reg.test(response.result)) {
            c = RegExp.$1;
            queueStatus = RegExp.$2;
          }
          logger.debug("获取呼叫队列状态：", queueStatus);
          cb(err, queueStatus);
        });
      }
    ]
  }, function(err, results) {
    callback(err, results);
  });

};

//队列中坐席应答成功
routing.prototype.queueAnswered = function() {
  var self = this;
  var context = self.context;
  var logger = self.logger;
  var args = self.args;
  var vars = self.vars;
  self.sessionnum = args.sessionnum;
  var queuenum = args.queuenum;
  logger.debug("队列被接听:", vars);
  async.auto({
    getAnswerMem: function(cb) {
      context.getVariable('MEMBERINTERFACE', function(err, response) {
        var member = '';
        var reg = /(\d+)\s+\((.*)\)/;
        var c = null,
          id = null;
        if (reg.test(response.result)) {
          c = RegExp.$1;
          member = RegExp.$2;
        }
        if (/\/(\d+)/.test(member)) {
          member = RegExp.$1;
        }
        logger.debug("当前应答坐席：", member);
        self.args.called = member;
        cb(err, member);
      });
    },
    getdymember: ['getAnswerMem',
      function(cb, results) {
        extension.findOne({
          where: {
            accountcode: results.getAnswerMem
          }
        }, function(err, inst) {
          cb(err, inst);
        });
      }
    ],
    //更新CDR应答状态和被叫坐席
    updateCDR: ['getdymember',
      function(cb, results) {
        callsession.findOne({
          where: {
            frist_cdruniqueid: self.sessionnum
          },
          order: "cretime desc"
        }, function(err, inst) {
          if (err || inst == null) {
            logger.error("队列中更新呼叫记录发生异常:", err);
            cb("队列中更新呼叫记录发生异常！", inst);
          } else {
            inst.accountcode = results.getdymember.doymicaccount || results.getAnswerMem;
            inst.extension = results.getAnswerMem;
            callsession.updateOrCreate(inst, function(err, o) {
              cb(err, o);
            });
          }
        });
      }
    ],
    //写入弹屏数据
    updatePop: ['getAnswerMem',
      function(cb, results) {
        callevent.findOne({
          where: {
            extensionnumber: results.getAnswerMem
          }
        }, function(err, inst) {
          if (err || inst == null) {
            logger.error("写入弹屏数据发生异常:", err);
            cb("写入弹屏数据发生异常！", inst);
          } else {
            inst.callernumber = vars.agi_callerid;
            inst.callednumber = results.getAnswerMem;
            inst.routerdype = 1;
            inst.status = 'waite';
            inst.creattime = moment().format("YYYY-MM-DD HH:mm:ss");
            inst.callid = self.sessionnum;
            inst.uid = self.sessionnum;
            callevent.updateOrCreate(inst, function(err, o) {
              cb(err, o);
            });
          }
        });
      }
    ],
    automonitor: ['getdymember',
      function(cb, results) {
        var dynumber = results.getdymember.doymicaccount || results.getAnswerMem;
        self.sysmonitor(dynumber, 'callee', cb);
      }
    ]
  }, function(err, results) {
    context.end();
  });

}

//拨打队列分机
routing.prototype.findqueuemember = function() {
  var self = this;
  var context = self.context;
  var logger = self.logger;
  var args = self.args;
  var vars = self.vars;
  var extennum = args.localnum;
  async.auto({
    findLocal: function(cb) {
      extension.findOne({
        where: {
          accountcode: extennum
        }
      }, function(err, inst) {
        if (err)
          cb(err, inst);
        if (inst != null && inst.dndinfo == "off") {
          cb(null, inst);
        } else {
          cb("在本地号码中没有找到队列成员号码，或分机示忙中！", null);
        }

      });
    },
    dial: ['findLocal',
      function(cb, resluts) {
        var extenproto = 'SIP';
        var timeout = '60';
        timeout = parseInt(timeout);
        context.Dial(extenproto + '/' + extennum, timeout, 'tr', function(err, response) {
          logger.debug("拨打队列分机返回结果：", response);
          if (err) {
            cb(err, response);
          } else {
            context.getVariable('DIALSTATUS', function(err, response) {
              cb(null, response);
            });
          }
        });

      }
    ],
    afterdial: ['dial',
      function(cb, resluts) {
        var re = /(\d+)\s+\((\w+)\)/;
        var anwserstatus = null;
        if (re.test(resluts.dial.result)) {
          anwserstatus = RegExp.$2;
        }
        logger.debug("拨打队列分机应答状态：", anwserstatus);
        if (anwserstatus !== 'ANSWER') {
          cb("拨打队列分机应答不成功！", -1);
        } else {
          logger.debug("拨打队列分机应答成功。");
          cb(null, 1);
        }
      }
    ]
  }, function(err, results) {
    if (err)
      logger.error(err);

    logger.debug("拨打队列分机结束。");
    context.end();
  });
}