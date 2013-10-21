module.exports = AGI;
function AGI(obj){
	//AGI.super_.call(this);	
	this.callback= undefined;
	this.status = undefined;
	this.lastresponse = undefined;
	this.lastresult = undefined;
	this.hungup = 0;
	this.debug = 0;
	this.env = undefined;
}
AGI.prototype.ReadParse=function(fh,cb){
if(!this.env){
return this._ReallyReadParse(fh,cb);	
}	
return this.env;	
}

AGI.prototype._ReallyReadParse=function(fh,cb){
var input={};
var testinput='';
if(!fh){
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data',function(chunk){
//process.stdout.write('date:'+chunk);	
testinput+=chunk;
});
process.stdin.on('end',function(){
process.stdout.write(testinput);
cb(testinput);
});
//fh=process.stdin;	
}
}
AGI.prototype.setcallback=function(fn){
	this.callback=fn;	
}


