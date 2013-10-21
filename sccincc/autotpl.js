var fs=require('fs');
var dirname=__dirname;
var path=dirname+'/modules/';
var ejs = require('ejs');
var util=require('util');
var moment = require('moment');

readmodels(path,'/');
function readmodels(mypath,dir){
console.log("正在读取目录："+mypath);
fs.readdir(mypath,function(err,files){
if(err){
	console.log(err);
	return;
	}	
for(var i in files){

var file=mypath+files[i];
var tmpdir=dir+files[i]+'/';
var stats=fs.statSync(file);
if(stats && stats.isDirectory()){
	console.log("开始读取子目录："+file);
	readmodels(file+'/',tmpdir);	
}else{
	var mod=require(file);
	if(mod.autotpl){
	createIndex(mod,dir);
	createCreate(mod,dir);
	createEdit(mod,dir);
	createDetail(mod,dir);
	createRoute(mod,dir);
	updateRouting(mod,dir);
	}	
}




}//end for	
});
}

function createIndex(mod,file){
var tpl=dirname+'/autotpl/'+'index.html';
fs.readFile(tpl,function(err,data){
	if(err){
		console.log(err);
		return;
		}

var tpldir=dirname+'/views/'+mod.views.name;
var str=data.toString();
//console.log(mod.cloums);
var ret=ejs.render(str,{
colums:mod.cloums,
views:mod.views,
util:util,
tag:'%',
filename:tpldir+'/index.html'
});



fs.exists(tpldir,function(exist){
	if(!exist){
		console.log("创建目录："+tpldir+"\r\n");
		fs.mkdir(tpldir,0777,function(err){
			if(err){
				fs.writeFile(tpldir+'/index.html',ret,'utf8',function(err){
				if(err)
				console.log("创建文件发生错误："+err)	
				});//fwrite		
			}else{
				fs.writeFile(tpldir+'/index.html',ret,'utf8',function(err){
					if(err)
						console.log("创建文件发生错误："+err)		
				});//fwrite	
			}
		});
	}
	else{
		fs.writeFile(tpldir+'/index.html',ret,'utf8',function(err){
			if(err)
				console.log("创建文件发生错误："+err)		
		});//fwrite	
	}
	
	});//dir exists

});//readfile
}

function createCreate(mod,file){
	var tpl=dirname+'/autotpl/'+'create.html';
	fs.readFile(tpl,function(err,data){
		if(err){
			console.log(err);
			return;
			}

	var tpldir=dirname+'/views/'+mod.views.name;
	var str=data.toString();
	console.log(mod.cloums);
	var ret=ejs.render(str,{
	mod:mod,
	tag:'%',
	util:util,
	filename:tpldir+'/create.html'
	});



	fs.exists(tpldir,function(exist){
	if(!exist){
		console.log("创建目录："+tpldir+"\r\n");
		fs.mkdir(tpldir,0777,function(err){
			if(err){
				fs.writeFile(tpldir+'/create.html',ret,'utf8',function(err){
				if(err)
				console.log("创建文件发生错误："+err)	
				});//fwrite		
			}else{
				fs.writeFile(tpldir+'/create.html',ret,'utf8',function(err){
					if(err)
						console.log("创建文件发生错误："+err)		
				});//fwrite	
			}
		});
	}
	else{
		fs.writeFile(tpldir+'/create.html',ret,'utf8',function(err){
			if(err)
				console.log("创建文件发生错误："+err)		
		});//fwrite	
	}
	
	});//dir exists

	});//readfile	
}
function createEdit(mod,file){
	var tpl=dirname+'/autotpl/'+'edit.html';
	fs.readFile(tpl,function(err,data){
		if(err){
			console.log(err);
			return;
			}

	var tpldir=dirname+'/views/'+mod.views.name;
	var str=data.toString();
	var ret=ejs.render(str,{
	mod:mod,
	tag:'%',
	filename:tpldir+'/edit.html'
	});



	fs.exists(tpldir,function(exist){
		if(!exist){
			console.log("创建目录："+tpldir+"\r\n");
			fs.mkdir(tpldir,0777,function(err){
				if(err){
					fs.writeFile(tpldir+'/edit.html',ret,'utf8',function(err){
					if(err)
					console.log("创建文件发生错误："+err)	
					});//fwrite		
				}else{
					fs.writeFile(tpldir+'/edit.html',ret,'utf8',function(err){
						if(err)
							console.log("创建文件发生错误："+err)		
					});//fwrite	
				}
			});
		}
		else{
			fs.writeFile(tpldir+'/edit.html',ret,'utf8',function(err){
				if(err)
					console.log("创建文件发生错误："+err)		
			});//fwrite	
		}
		
		});//dir exists

	});//readfile	
	
}
function createDetail(mod,file){
	var tpl=dirname+'/autotpl/'+'detail.html';
	fs.readFile(tpl,function(err,data){
		if(err){
			console.log(err);
			return;
			}

	var tpldir=dirname+'/views/'+mod.views.name;
	var str=data.toString();
	var ret=ejs.render(str,{
	mod:mod,
	tag:'%',
	filename:tpldir+'/detail.html'
	});


	fs.exists(tpldir,function(exist){
		if(!exist){
			console.log("创建目录："+tpldir+"\r\n");
			fs.mkdir(tpldir,0777,function(err){
				if(err){
					fs.writeFile(tpldir+'/detail.html',ret,'utf8',function(err){
					if(err)
					console.log("创建文件发生错误："+err)	
					});//fwrite		
				}else{
					fs.writeFile(tpldir+'/detail.html',ret,'utf8',function(err){
						if(err)
							console.log("创建文件发生错误："+err)		
					});//fwrite	
				}
			});
		}
		else{
			fs.writeFile(tpldir+'/detail.html',ret,'utf8',function(err){
				if(err)
					console.log("创建文件发生错误："+err)		
			});//fwrite	
		}
		
		});//dir exists

	});//readfile	
}
function createRoute(mod,file){
	var tpl=dirname+'/autotpl/'+'route.html';
	fs.readFile(tpl,function(err,data){
		if(err){
			console.log(err);
			return;
			}

	var tplfile=dirname+'/routes/'+mod.views.name+'.js';
	var str=data.toString();
	
	var ret=ejs.render(str,{
	mod:mod,
	util:util,
	tag:'%',
	file:file,
	filename:tplfile
	});



	

	fs.writeFile(tplfile,ret,'utf8',function(err){
		
	});//fwrite
	
	});//readfile		
}
function updateRouting(mod,file){
var filename='./routes/routing.js';	
fs.open(filename,'a+',function(err,fd){
	 if(err) {
		 console.log(err);
		 return;
		 }
var strarr=[];
//var date=new Date();

strarr.push("\r\n"+'//自动添加于：'+moment().format("YYYY-MM-DD HH:mm:ss"));
strarr.push('routes.'+mod.Name+'=[');
strarr.push(" {urlreg:'/"+mod.Name+"',file:'/routes/"+mod.Name+"',method:'get',fn:'get'},");
strarr.push(" {urlreg:'/"+mod.Name+"',file:'/routes/"+mod.Name+"',method:'post',fn:'post'},");
strarr.push(" {urlreg:'/"+mod.Name+"/edit',file:'/routes/"+mod.Name+"',method:'post',fn:'editpost'},");
strarr.push(" {urlreg:'/"+mod.Name+"/edit',file:'/routes/"+mod.Name+"',method:'get',fn:'editget'},");
strarr.push(" {urlreg:'/"+mod.Name+"/detail',file:'/routes/"+mod.Name+"',method:'get',fn:'detail'},");
strarr.push(" {urlreg:'/"+mod.Name+"/del',file:'/routes/"+mod.Name+"',method:'post',fn:'del'},");
strarr.push(" {urlreg:'/"+mod.Name+"/create',file:'/routes/"+mod.Name+"',method:'post',fn:'createpost'},");
strarr.push(" {urlreg:'/"+mod.Name+"/create',file:'/routes/"+mod.Name+"',method:'get',fn:'createget'}];");
var str = strarr.join("\r\n");
fs.write(fd,str,0,'utf8',function(e){
	        if(e) throw e;
	        fs.closeSync(fd);
	    }); 
	
});
}