var fs = require('fs');
var async = require('async');
var moment = require("moment");
var path = "/var/spool/asterisk/monitor/3/";
var npath = "/var/spool/asterisk/monitor/3b/";
var daysago = moment().subtract('days', 30).toDate().valueOf();
var DbMode = require('./modules/ippbx/recordfiles');

var t = setInterval(function() {
	async.auto({
		findFiles: function(cb) {
			fs.readdir(path, function(err, files) {
				cb(err, files);
			});
		},
		mvFiles: ["findFiles",
			function(cb, results) {
				if (results.findFiles.length > 0) {
					var lasttime = 0;
					var lastfile = "";
					var lastsize = 0;
					async.eachSeries(results.findFiles, function(file, callback) {
						fs.stat(path + file, function(err, stats) {
							//console.log(stats);
							var mtime = stats.mtime.valueOf();
							var filesize = stats.size;
							if (mtime > lasttime) {
								lastfile = file;
								lasttime = mtime;
								lastsize = filesize;
							}

							if (mtime < daysago) {
								var oldPath = path + file;
								var newPath = npath + file;
								fs.rename(oldPath, newPath, function() {
									console.log("将文件:" + oldPath + ",移动到:" + newPath);
								});
							}
							//console.log(daysago, mtime, lasttime);
							callback();
						});
					}, function(err) {
						cb(err, {
							lastfile: lastfile,
							lastsize: lastsize
						});
					});


				} else {
					cb(null, null);
				}
			}
		],
		upsize: ["mvFiles",
			function(cb, results) {
				if (results.mvFiles !== null) {
					var filesize = results.mvFiles.lastsize / 1024;
					var filename = results.mvFiles.lastfile.split('.')[0];

					DbMode.findOne({
						where: {
							filename: filename
						}
					}, function(err, inst) {
						if (err || inst == null) {
							cb(err, inst);
						} else {
							inst.filesize = filesize;
							DbMode.updateOrCreate(inst, function(err, o) {
								console.log("更新完毕！");
								cb(err, o);
							});
						}
					});


				} else {
					cb(null, null);
				}
			}
		]/*,
		delnull: ["upsize",
			function(cb, results) {
				var thisdate = moment().format("YYYY-MM-DD");
				var sql = "delete from recordfiles where filesize is null and cretime < '" + thisdate + " 00:00:00'";
				DbMode.query(sql, function(err, dbs) {
					cb(err, null);
				});
			}
		]*/

	}, function(err, results) {

		if (err)
			console.log(err);
		else {
			console.log("所有步骤执行完毕！");

		}
	});
}, 5000);