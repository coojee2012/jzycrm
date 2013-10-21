#!/usr/bin/env node
var AGI=require(__dirname+'/agi/lib/index.js');
AGI.createServer(function(context) {
	  //context is a new instance of agi.Context for each new agi session
	  //immedately after asterisk connects to the node process
	  
	  context.on('variables', function(vars) {
		  console.log(context.msg);
		console.log(vars);
	    console.log('received new call from: ' + vars.agi_callerid + ' with uniqueid: ' + vars.agi_uniqueid);
	    context.getVariable('callerid',function(num){
	    	console.log('Get the callNum:'+num);
	    	context.send('noop "call noop" \n',function(err){
	    		console.log(err);
	    		context.hangup(function(){
		 	    	console.log('Hang up the calls');
		 	    });	
	    		
	    	});
	    	 
	    });
	   
	  });
	  
	  context.on('hangup',function(){
		  context.end();  
	  });
	 
	  context.on('response',function(response){
		  console.log('response:');  
		  console.log(response);  
	  });
	 
	}).listen(3000);