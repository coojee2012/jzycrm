var Nami=require("nami").Nami;
//var Action=require("nami").Action;

var namiConfig = {
    host: "192.168.1.115",
    port: 5038,
    username: "admin",
    secret: "admin"
};
var nami = new Nami(namiConfig);
nami.on('namiEvent', function (event) {
//console.log(event);	
});
nami.on('namiEventDial', function (event) {
	
});
nami.on('namiEventVarSet', function (event) { 
	
});
nami.on('namiEventHangup', function (event) {
	
});
nami.open();
exports.nami=nami;