var Schema = require('jugglingdb').Schema;
var conf = require('node-conf');
var mysqlconfig=conf.load('mysql');
var schema = new Schema('mysql', mysqlconfig);
schema.isActual(function(err, actual) {
    if (!actual) {
        schema.autoupdate();
    }
});
exports.schema = schema;