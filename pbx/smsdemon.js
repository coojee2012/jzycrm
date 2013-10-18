var http = require('http'); 
var url = require('url');
var fs = require('fs');
var xml =require('xml');
var qs=require('querystring');

var intervalId = setInterval(sendSms,10000);
function sendSms(){
console.log("SEND SMS....");	
//xmlsend();
hyyp();
}
function xmlsend(){
	var sys = require('util');
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		sys.puts("State: " + this.readyState);
		//console.log("State: " + this.readyState);
		if (this.readyState == 4) {
			sys.puts("Complete.\nBody length: " + this.responseText.length);
			//console.log("Complete.\nBody length: " + this.responseText.length);
			sys.puts("Body:\n" + this.responseText);
			//console.log("Body:\n" + this.responseText);
		}
		
	};
	var message=new MtNewMessage("",'15308908290','测试短信',"","");
	/**
	输入说明	message参数xml格式如下：
    <?xml version="1.0" encoding="UTF-8"?>
    <message>
	<account>admin</account>
	<password>bb43a2c4081bec02fca7b72f38e63021</password>
	<msgid>2c92825934837c4d0134837dcba00150</msgid>
	<phones>13111111111,13222222222,13333333333</phones>
	<content>短信内容</content>
     <sign>短信签名</sign>
	<subcode>5555</subcode>
	<sendtime>201101011230</sendtime>
    </message>
    字段说明：
    account ：用户账号
    password：账号密码，需采用MD5加密(小写)，如：456.com加密后为bb43a2c4081bec02fca7b72f38e63021
    msgid：该批短信编号，需保证唯一，可空，建议为空
    phones：接收手机号码，多个手机号码用英文逗号分隔，最多500，不能为空
    content：短信内容，最多500汉字，不能为空
    sign：短信签名，该签名有服务端告知客户端，不可修改。为空时使用默认值
    subcode：扩展子号码，可空
    sendtime：发送时间,格式yyyyMMddHHmm,可空

	**/
	var dataxml=[{message:[{account:'dh1114'},
	                       {password:'5225ffd0431235d9dcf06cba1b5a9b4d'},
	                       {msgid:''},
	                       {phones:'15308098290'},
	                       {isPhoneSubcodeType:0},
	                       {content:'测试短信'},
	                       {sign:''},
	                       {subcode:''},
	                       {sendtime:''}]
	                       }];
	
   // var data=setSendData("sendSms",new Array("account","password","message"),new Array("dh1114","5225ffd0431235d9dcf06cba1b5a9b4d",message),"urn:SmsNewOperator")
	var data='<?xml version="1.0" encoding="UTF-8"?>';
	    data+=xml(dataxml);
	    console.log(data);
    //xhr.open("POST", "http://3tong.cn:8082/ema_new/services/SmsNewOperator");
	xhr.open('POST', 'http://www.10690300.com/http/sms/Submit');
   // xhr.setRequestHeader("SOAPAction", "urn:SmsNewOperator" + "POST");
	xhr.send(data);	
} 


/**
method:"sendSms", 
variable:new Array("account","password","message"),
value:new Array("837049","6edc2c95798bf769eb94f66d373ec441",message),
url:"http://3tong.cn:8082/ema_new/services/SmsNewOperator",
_Namespace:"urn:SmsNewOperator")
**/
function setSendData(method,variable,value,_Namespace){
	var data;
	data = '<?xml version="1.0" encoding="utf-8"?>';
	data = data
			+ '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	data = data + '<soap:Body>';
	data = data + '<' + method + ' xmlns="' + _Namespace + '">';
	for (var i = 0; i < variable.length; i++) {
		if(!(value[i] instanceof Array))
		{
		if(typeof((value[i]))== "object")
				data = data + '<' + variable[i] + '><content>' + value[i].content
						+ '</content><phoneNumber>' + value[i].phoneNumbe
						+ '</phoneNumber></' + variable[i]+ '>';
		else 
		data = data + '<' + variable[i] + '>' + value[i] + '</' + variable[i]+ '>';		
		}
		if(value[i] instanceof Array)
		{
			data = data + '<' + variable[i] + '>'
			for (var j = 0; j < value[i].length; j++) {
				data = data + '<' + variable[i] + '><smsId>' + value[i][j].smsId
						+ '</smsId><phoneNumber>' + value[i][j].phoneNumbe
						+ '</phoneNumber></' + variable[i]+ '>';
			}
			data = data +  '</' + variable[i]+ '>';
		}
	}
	

	data = data + '</' + method + '>';
	data = data + '</soap:Body>';
	data = data + '</soap:Envelope>';
	return data;
}

//自定义类，类属性名称需要与接口中自定义类名称一致
function MtNewMessage(smsId, phoneNumbe, content, wapPushUrl,scheduleTime)
 {
	var mtnewmessage = MtNewMessage.prototype;
	mtnewmessage.smsId = smsId;
	mtnewmessage.phoneNumbe = phoneNumbe;
	mtnewmessage.content = content;
	mtnewmessage.wapPushUrl = wapPushUrl;
	mtnewmessage.scheduleTime = scheduleTime;
	mtnewmessage.getSmsId = function() {
		return mtnewmessage.smsId;
	}
	mtnewmessage.getSmsId = function() {
		return mtnewmessage.smsId;
	}
	mtnewmessage.getPhoneNumbe = function() {
		return mtnewmessage.phoneNumbe;
	}
	mtnewmessage.getContent = function() {
		return mtnewmessage.content;
	}
	mtnewmessage.getWapPushUrl = function() {
		return mtnewmessage.wapPushUrl;
	}
	mtnewmessage.getScheduleTime = function() {
		return mtnewmessage.scheduleTime;
	}
}

function hyyp(){
var urlencode = require('urlencode');
var dataPost={Account:'dh1114',
		Password:'5225ffd0431235d9dcf06cba1b5a9b4d',
//msgid:'',
Phone:'15308098290',
//isPhoneSubcodeType:0,
Content:urlencode('测试短信','utf8'),
//sign:'',
SubCode:'',
Wappushurl:'',
charset:'utf8',
SendTime:''};
//console.log(qs);
var content=qs.stringify(dataPost);
console.log("content:",content);
var url='http://www.10690300.com/http/SendSms';
    //url='http://125.64.213.31/';
var parse_u=require('url').parse(url,true);
var isHttp=parse_u.protocol=='http:';
var options = {
		  host:parse_u.hostname,
          port:parse_u.port||(isHttp?80:443),
          path:parse_u.path,
		  method: 'POST',
		  headers:{
		        //'accept': '*/*',
		       // 'content-type': "application/atom+xml",
		        //  'Content-Type': "text/html",
		        'Content-Type':'application/x-www-form-urlencoded',
		        //'accept-encoding': 'gzip, deflate',
		        //'accept-language': 'en-US,en;q=0.9',
		        //'authorization': _auth,
		        'Content-Length':content.length,
		        'user-agent': 'nodejs rest client'
		    }
		};
console.log(options);
var req = require(isHttp?'http':'https').request(options, function(res) {
		  console.log('STATUS: ' + res.statusCode);
		  console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.setEncoding('utf8');
		  res.on('data', function (chunk) {
		    console.log('BODY: ' + chunk);
		  });
		
		  res.on('end', function() {
			  console.log('request end! ');
			});
		});

  req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

		// write data to request body
  //req.write('data\n');
  //req.write('data\n');
  req.write(content);
  req.end();
}