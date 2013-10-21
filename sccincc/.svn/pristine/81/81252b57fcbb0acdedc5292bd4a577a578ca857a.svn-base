var easySoap    = require('easySoap');

//soap client params
var clientParams = {

    //set soap connection data (mandatory values)
    host    : 'localhost:8732',
    path    : '/Design_Time_Addresses/WcfServiceLibrary/Service1/',
    wsdl    : '/Design_Time_Addresses/WcfServiceLibrary/Service1/',

    //set soap header (optional)
    header  : [{
        'name'      : 'item_name',
        'value'     : 'item_value',
        'namespace' : 'item_namespace'
    }]
};

//soap client options
var clientOptions = {
    secure : false //is https or http
};

//create new soap client
var SoapClient = new easySoap.Client(clientParams, clientOptions);
    SoapClient.once('initialized', function() {

        //successful initialized
        SoapClient.once('Add', function(data, header) {
            //soap response
            console.log(data);
        });

        SoapClient.call({
            'method' : 'Add',
            'params' : {
                'x' : 1,
                'y':2
            }
        });
    });

    //initialize soap client
    SoapClient.init();
    console.log(SoapClient);