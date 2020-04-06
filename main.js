var moment = require('moment');
var request = require('request');
var fs = require('fs');

var DNI = ''
var CUPS = ''
var TOKEN = '';

var start = '2019-01-01T00:00:00.000';
var end = '2019-01-11T00:00:00.000';

var _start = moment(start);
var _end = moment(end);

var results = [];

async function main(){

    while(moment().diff(_end, 'seconds') > 0){
        var startDate = _start.format('DD-MM-YYYY');
        var endDate = _end.format('DD-MM-YYYY');
        await callRequest(startDate, endDate);
        console.log(startDate + ' ' + endDate);
        _start = _start.add(10,'days');
        _end = _end.add(10,'days');
    }

    fs.writeFileSync('./sta.json', JSON.stringify(results));
}

main();

function callRequest(startDate, endDate){
    var url = 'https://api.ufd.es/ufd/v1.0/consumptions?filter=nif::' + DNI + '%7Ccups::' + CUPS + '%7CstartDate::' + startDate + '%7CendDate::' + endDate + '%7Cgranularity::H%7Cunit::K%7Cgenerator::0%7CisDelegate::N%7CmeasurementSystem::O'

    var options = {
        'method': 'GET',
        'url': url,
        'headers': {
            'Authorization': 'Bearer ' + TOKEN
        }
    };

    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            body = JSON.parse(body);
            body.items.forEach((item) => {
                var day = {
                    "date": item.periodStartDate,
                    "maxConsumption": item.maxConsumption,
                    "minConsumption": item.minConsumption,
                    "totalConsumption": item.totalConsumption,
                };
                results.push(day);
            });
            resolve();
        });
    });
}





