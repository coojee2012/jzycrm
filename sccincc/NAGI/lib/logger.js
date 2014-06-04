var log4js = require('log4js');
var conf = require('node-conf');
var logconf=conf.load('log4js');
log4js.configure(logconf);

exports.logger=function(name){
  var logger = log4js.getLogger(name);
  logger.setLevel('INFO');
  return logger;
};

/**
log4js的输出级别6个: trace, debug, info, warn, error, fatal
logger.trace(‘Entering cheese testing’);
logger.debug(‘Got cheese.’);
logger.info(‘Cheese is Gouda.’);
logger.warn(‘Cheese is quite smelly.’);
logger.error(‘Cheese is too ripe!’);
logger.fatal(‘Cheese was breeding ground for listeria.’);
**/