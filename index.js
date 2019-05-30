var AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1" });
require('dotenv').config();
const xlsx = require('node-xlsx');

var sns = new AWS.SNS({ apiVersion: '2010-03-31' });
var setTransactionalSMSParams = {
    attributes: {
        DefaultSMSType: "Transactional",
    },
}
console.log('hey')
sns.setSMSAttributes(setTransactionalSMSParams, function (err, data) {
    if (err) {
        console.log("SNS set sms type to transactional failed");
        console.log(err);
    }
    else {
        console.log("SNS set sms type to transactional success")
        console.log(data);
        importNumbers();
    }
})

function subscribe(params) {
    sns.subscribe(params, function (err, data) {
        if (err)
            console.log(err);
        else
            console.log(data);
    })
}

async function importNumbers() 
{
    var obj = xlsx.parse(__dirname + '/data.xlsx'); // parses a file
    console.log(obj[0].data[0][0]);
    console.log(obj[0].data.length);
    // console.log(obj[0].data[1][0].toString().length);
    for (var i = 0; i < obj[0].data.length; i++) {
        if (obj[0].data[i][0] && obj[0].data[i][0].toString().length > 10) {
            obj[0].data[i][0] = obj[0].data[i][0].toString().replace(/\s/g, '')
            if (obj[0].data[i][0].toString().length == 11) {
                obj[0].data[i][0] = obj[0].data[i][0].toString().substr(1);
            }
            if (obj[0].data[i][0].toString().length == 12) {
                obj[0].data[i][0] = obj[0].data[i][0].toString().substr(2);
            }
            if (obj[0].data[i][0].toString().length == 13) {
                obj[0].data[i][0] = obj[0].data[i][0].toString().substr(3);
            }
            if (obj[0].data[i][0].toString().length == 14) {
                obj[0].data[i][0] = obj[0].data[i][0].toString().substr(4);
            }

        }
    }
    var arn = 'arn:aws:sns:us-east-1:477733643569:Delhi';
    var params = {
        TopicArn: arn,
        Protocol: 'sms',
        ReturnSubscriptionArn: true,
        Endpoint: '+919818245168'
    }

    for (var i = 0; i < obj[0].data.length; i++) {
        if (obj[0].data[i][0] && obj[0].data[i][0].toString().length == 10) {
            params.Endpoint = '+91' + obj[0].data[i][0].toString();
            await subscribe(params);
            console.log(params.Endpoint);
        }
    }
}

