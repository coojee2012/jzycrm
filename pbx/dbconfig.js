var Schema = require('jugglingdb').Schema;
var schema = new Schema('mysql', {
	host: '127.0.0.1',
	port: '3306',
	database: 'callcenter',
	username: 'root',
	password: '12345678',
	socketPath: '/var/lib/mysql/mysql.sock',
	insecureAuth: true, 
	debug:false
});
schema.isActual(function(err, actual) {
    if (!actual) {
        schema.autoupdate();
    }
});
exports.schema = schema;