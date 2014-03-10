var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var async = require('async');
var MSSQL = function(config) {
  this.config = config;
  this.connected = false;
  this.connection = null;
  this.connect(function() {
    console.log('连接数据库成功！');
  });
};

MSSQL.prototype.connect = function(callback) {
  var self = this;
  self.connection = new Connection(self.config);
  self.connection.on('connect', function(err) {
    if (err) {
      console.log('连接错误:', err);
    } else {
      self.connected = true;
      callback();
    }
  });
  self.connection.on('end', function(err) {
    console.log('Connection closed');
    process.exit(0);
  });
  self.connection.on('debug', function(message) {
     console.log(message);
  });
}

MSSQL.prototype.exec = function(sql, callback) {
  var self = this;
  var dbs = [];
  sql = sql.toString();
  request = new Request(sql, function(err, rowCount) {
    if (err) {
      console.log('Statement failed: ' + err);
    } else {
      console.log('执行完毕，共影响:' + rowCount + ' 行！');
      callback(null, dbs);
    }
  });

  request.on('columnMetadata', function(columnsMetadata) {
    columnsMetadata.forEach(function(column) {
      console.log(column);
    });
  });
  request.on('row', function(columns) {
    var row = {};
    columns.forEach(function(column) {
      if (column.value === null) {
        row[column.metadata.colName] = "";
      } else {
        row[column.metadata.colName] = column.value;
      }

    });
    dbs.push(row);
  });

  request.on('done', function(rowCount, more) {
    // console.log('执行完毕，共影响:' + rowCount + ' 行！');
    // callback(null, dbs);
  });

  if (!self.connected) {
    self.connect(function(err) {
      self.exec(sql, callback);
    });
  } else {
    if (self.config && self.config.options && self.config.options.tdsVersion === '7_1') {
      console.log('当前使用的是sqlserver2000');
      self.connection.execSqlBatch(request);
    } else {
       console.log('当前使用的是sqlserver2000++');
      self.connection.execSql(request);
    }
  }

}

MSSQL.prototype.end=function(){
  var self=this;
  if(self.connected){
    self.connected=false;
    self.connection.close();
  }else{
    console.log('连接已断开！');
  }
}
module.exports = MSSQL;

/*var config = {
  server: '192.168.7.234',
  userName: 'sa',
  password: '123456Aa',
  options: {
    debug: {
      packet: true,
      data: true,
      payload: true,
      token: false,
      log: true
    },
    tdsVersion: '7_2',
    database: 'bjexpert' //hbposv7'
  }

};*/

/*var mssql = new MSSQL(config);

mssql.exec('select * from ContinueContractMessage', function(err, dbs) {
  console.log('获取到的结果：', dbs);
});*/