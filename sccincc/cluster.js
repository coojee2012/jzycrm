var cluster = require('cluster');
var os = require('os');
// 获取CPU 的数量
var numCPUs = os.cpus().length;
var workers = {};
//require('./monitor.js');
/*if(process.argv.length>1) {//这个if肯定会成立，其作用是为了把内部的变量的作用范围和外部分离开来，避免冲突 
	  var newArgv = [];// 
	  var ifChild = false; 
	  process.argv.forEach(function (val, index, array) { 
	    if(val=='-run_in_child') { 
	      ifChild = true; 
	    } 
	    else if(index>0)newArgv.push(val);//第0个元素是命令/程序路径 
	  }); 
	  if(!ifChild) { 
	    newArgv.push('-run_in_child');//子进程需要一个命令标志：run_in_child 
	    start(); 
	    function start() 
	    { 
	      //console.dir(newArgv); 
	      console.log('master process is running.'); 
	      var cp = require('child_process').spawn(process.argv[0], newArgv); 
	      cp.stdout.pipe(process.stdout); 
	      cp.stderr.pipe(process.stderr); 
	      cp.on('exit', function (code) 
	      { 
	         if(code==0){ 
	             //正常退出进程 
	             process.exit(0); 
	             return; 
	         } 
	        //可以在此添加进程意外退出的处理逻辑 
	        delete(cp); 
	        console.log('child process exited with code ' + code); 
	        setTimeout(start,5000); 
	      }); 
	    } 
	    return; 
	  } 
	} */


yybs();
// 当主进程被终止时，关闭所有工作进程
process.on('SIGTERM', function() {
	console.log('主进程死亡！');
	for (var pid in workers) {
		process.kill(pid);
	}

	process.exit(0);

});


/*process.on('exit',function(){
	//yybs();	
});
*/

function yybs() {
	if (cluster.isMaster) {
		console.log(' MASTER ' + "启动主进程...");
		// 初始开启与CPU 数量相同的工作进程
		for (var i = 0; i < numCPUs; i++) {
			var worker = cluster.fork();
			workers[worker.pid] = worker;
			worker.on('exit', function(code, signal) {
				if (signal) {
					console.log("worker was killed by signal: " + signal);
				} else if (code !== 0) {
					console.log("worker exited with error code: " + code);
				} else {
					console.log("worker success!");
				}
			});

			//worker.send(' MASTER ' + '创建子进程：' + worker.id);
		}

		cluster.on('fork', function(worker) {
			console.log(' MASTER ' + 'fork: worker' + worker.id);
		});

		cluster.on('online', function(worker) {
			console.log(' MASTER ' + 'online: worker' + worker.id);
			//worker.send(' MASTER ' + '子进程：' + worker.id+'运行成功！');

		});

		cluster.on('listening', function(worker, address) {
			console.log(' MASTER ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
		});

		cluster.on('disconnect', function(worker) {
			console.log(' MASTER ' + 'disconnect: worker' + worker.id);
		});


		cluster.on('exit', function(worker, code, signal) {
			console.log(' MASTER ' + 'exit worker' + worker.id + ' died');
			var exitCode = worker.process.exitCode;
			console.log(' MASTER ' + 'worker ' + worker.process.pid + ' died (' + exitCode + '). restarting...');
			delete workers[worker.pid];
			worker = cluster.fork();
			workers[worker.pid] = worker;
			worker.on('exit', function(code, signal) {
				if (signal) {
					console.log("worker was killed by signal: " + signal);
				} else if (code !== 0) {
					console.log("worker exited with error code: " + code);
				} else {
					console.log("worker success!");
				}
			});

		});


		/**
		// 主进程分支
		cluster.on('death', function(worker) {
			// 当一个工作进程结束时，重启工作进程
				delete workers[worker.pid];
				worker = cluster.fork();
				workers[worker.pid] = worker;
			});
	**/

		/**
	//主进程和分支进程间通信
	 function eachWorker(callback) {
        for (var id in cluster.workers) {
            callback(cluster.workers[id]);
        }
    }

    setTimeout(function () {
        eachWorker(function (worker) {
            worker.send(' MASTER ' + 'send message to worker' + worker.id);
        });
    }, 3000);

    Object.keys(cluster.workers).forEach(function(id) {
        cluster.workers[id].on('message', function(msg){
            console.log(' MASTER ' + 'message ' + msg);
        });
    });
    
		**/

		var normal = require('child_process').fork(__dirname + '/motherboom.js');
		normal.on('exit', function(code, signal) {
			console.log('奶妈程序退出了：' + code);
		});
		normal.on('error', function(err) {
			console.log('奶妈程序发生异常：' + err);
		});

	} else if (cluster.isWorker) {
		console.log(' WORKER ' + "start worker ..." + cluster.worker.id);

		process.on('message', function(msg) {
			console.log(' WORKER ' + msg);
			process.send(' WORKER worker' + cluster.worker.id + ' received!');
		});

		// 工作进程分支，启动服务器
		var app = require('./app');
		app.listen(80);
	} else {}
}