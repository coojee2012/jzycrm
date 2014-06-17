
var async = require('async');
var DbMode = require('../modules/ippbx/recordfiles');

var t = setInterval(function() {
	async.auto({
		
		delnull: function(cb, results) {
				var sql = "select * from recordfiles limit 0,1";
				DbMode.query(sql, function(err, dbs) {
					cb(err, null);
				});
			}
		

	}, function(err, results) {

		if (err)
			console.log(err);
		else {
			console.log("所有步骤执行完毕！");

		}
	});
}, 5000);