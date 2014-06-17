var Schema = require('jugglingdb').Schema;
var conf = require('node-conf');
var mysqlconfig = conf.load('mysql');
var schema = new Schema('mysql', mysqlconfig);

schema.on("error", function(err) {
	console.log("连接断开，自动重新连接");
	if (err.code === 'PROTOCOL_CONNECTION_LOST') {
		schema.connect(function(err) {
			if (err)
				console.log("数据重新库连接失败:", err);

			else
				console.log("数据重新库连接成功！");
		});
	} else {
		console.error(err.stack || err);
	}
});

schema.on("connected", function() {
	console.log("数据库连接成功！");
	schema.isActual(function(err, actual) {
		if (!actual) {
			schema.autoupdate();
		}
	});

});
exports.schema = schema;