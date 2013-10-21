  var soap = require('soap');
  var fs=require('fs');
  var util=require('util');
  //var url = 'http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl';
  //var url='http://localhost:8732/Design_Time_Addresses/WcfServiceLibrary/Service1/?wsdl';
  var url='http://192.168.0.134:8008/SMSService.svc?wsdl';
 // var url='http://ztbsms.sccin.com/SMSService.svc?wsdl';
  //var args = {phone:"13568853415",msg:"Everyone should take action with a dream and be strong with a reason ."};
  var args = {phone:"018620674166",msg:"建设网测试短信."};
  //var args = {phone:"15680893379",msg:"Everyone should take action with a dream and be strong with a reason ."};
  
  soap.createClient(url, function(err, client) {
	debugger;
	
	if(err){
	console.log(err);	
	}
	  
    if(!client)
	 {
		  console.log("无法正常连接服务！11");
		  return;
	 }
	 
	  
	 debugger;
    /* client.SendSMS(args, function(err1, result,body) {
    	 if(err1){
    		
    	 }
    	 else{
        
        console.log(result['SendSMSResult']);
        fs.writeFile('test.log',util.inspect(result),'utf8',function(err){
    		
    	});
    	 }
      });*/
     
	 client.GetJsonResult({name:'林勇',address:'22',phone:'33'},function(err,result,body){
		if(err){}
		else{
			console.log(result['GetJsonResultResult'].Name);	
			
		}
		 
	 });
	 
	 client.GetJsons({name:'林勇',address:'22',phone:'33'},function(err,result,body){
			if(err){}
			else{
				console.log(result['GetJsonsResult']);	
				
			}
			 
		 });
	 
     client.GetCustomerIP({},function(err1, result,body){
    	 if(err1){
     		
    	 }
    	 else{
        console.log(result['GetCustomerIPResult']);
        fs.writeFile('test.log',util.inspect(result),'utf8',function(err){
    		
    	});
    	 } 
    	 
     });
      
	  
  });