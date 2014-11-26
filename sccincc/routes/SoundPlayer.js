exports.SoundPlayer=function(req,res){
    var recordfiles=require('../modules/ippbx/recordfiles');
	var filename=req.query['filename'] ||req.body['filename']||'我';
    var exten=req.query['exten'] ||	req.body['exten'];
    
    var where={filename:filename,extennum:exten};
   // var where={associate:filename};
    var hostname=req.protocol+'://'+req.host;
    var port=req.app.get('port');

    var moment = require("moment");
    var path = "/var/spool/asterisk/monitor/3/";
    var npath = "/var/spool/asterisk/monitor/3b/";

    var daysago = moment().subtract('days', 30).toDate().valueOf();
    recordfiles.findOne({where:where},function(err,db){
    if(err || db==null){
        res.send(err || "没有数据！");
    }
    else{
    	var myfile=filename;
        var sounds='sounds';
    	if(db!=null)
    		myfile=db.filename;
        var cretime=moment(db.cretime).toDate().valueOf();
        console.log("cretime:",cretime);
        if(cretime<daysago)
        sounds='soundsbck';
    	res.render('SoundPlayer/index.html', { hostname:hostname,port:port,sounds:sounds,myfilename:myfile});
    }
    });
    

}