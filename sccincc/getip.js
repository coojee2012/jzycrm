var http = require('http');
var commonfun = {};
commonfun.getPort = function(url) {
	var hostPattern = /\w+:\/\/([^\/]+)(\/)?/i;
	var domain = url.match(hostPattern);

	var pos = domain[1].indexOf(":");
	if (pos !== -1) {
		domain[1] = domain[1].substr(pos + 1);
		return parseInt(domain[1]);
	} else if (url.toLowerCase().substr(0, 5) === "https") return 443;
	else return 80;
}

//Parse the url,get the host name
//e.g. http://www.google.com/path/another -> www.google.com

commonfun.getHost = function(url) {
	var hostPattern = /\w+:\/\/([^\/]+)(\/)?/i;
	var domain = url.match(hostPattern);

	var pos = domain[1].indexOf(":");
	if (pos !== -1) {
		domain[1] = domain[1].substring(0, pos);
	}
	return domain[1];
}

commonfun.getPath = function(url) {
	var pathPattern = /\w+:\/\/([^\/]+)(\/.+)(\/$)?/i;
	var fullPath = url.match(pathPattern);
	return fullPath ? fullPath[2] : '/';
}

var url = "http://125.64.213.31/Admin/GetIp.aspx?save=save&id=101&name=JZY";
var options = {
	host: commonfun.getHost(url),
	port: commonfun.getPort(url),
	path: commonfun.getPath(url),
	headers: {
		"Content-Type": 'text/html'
	},
	method: "get"
};

//console.log(options);
var datas = {};
//datas.save = "save";
//datas.id = "101";
//datas.name = "JZY";


datas = JSON.stringify(datas);
//console.log(datas);
var t = setInterval(function() {
		var req = http.request(options, function(res) {
			var retval = "";
			//console.log('STATUS: ' + res.statusCode);
			//console.log('HEADERS: ' + JSON.stringify(res.headers));
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				//logger.debug('获取到返回数据：', retval);
				retval += chunk
			});
			res.on('end', function() {
				//console.log('执行了getData！', retval);
				//cb1(null, retval);
			});
		});

		req.on('error', function(e) {
			//logger.debug('problem with request: ' + e.message);
			//cb1('error', null);
		});
		req.setTimeout(30 * 1000, function() {
			req.end();
			//cb1('timeout', null);
		});
		req.write(datas + '\n');
		req.end();
	},60000);