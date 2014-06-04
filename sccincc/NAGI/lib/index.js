var Context = require('./context');

var agi = {
  state: require('./state'),
  Context: Context,
  createServer: function(handler) {
    return require('net').createServer(function(stream) {
     console.log("AGI服务已启动....");
      var context = new Context(stream);
      handler(context);
    });
  }
};

module.exports = agi;
