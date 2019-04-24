var http = require('http');
const TService = require("./TelemetryService")
const createCsvWriter = require('csv-writer').createObjectCsvWriter

http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
}).listen(8080);

const BATCH_SIZE = 200
const EID_LIST = ["IMPRESSION", "SEARCH", "LOG"];
const EVENT_SIZE_SPLIT = {
    "IMPRESSION": 100,
    "SEARCH": 70,
    "LOG": 30
}
const EVENTS_GENERATE_INTERVAL_TIME = 15000 // 15 sec
var events = []
var syncEvents = () => {
    if (events.length >= BATCH_SIZE) {
        // var request = require("request");
        // var options = {
        //     method: 'POST',
        //     url: "http://host:9001/v1/telemetry",
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Cache-Control': 'no-cache'
        //     },
        //     body: {
        //         id: 'ekstep.telemetry',
        //         ver: '3.0',
        //         ets: Date.now(),
        //         events: events
        //     },
        //     json: true
        // };

        // request(options, function(error, response, body) {
        //     if (error) throw new Error(error);
        //     else console.info("Telemetry sync is success")
        // });
        var http = require("http");

        var options = {
            "method": "POST",
            "host": "http://28.0.1.6",
            "port": "9001",
            "path": "/v1/telemetry",
            "headers": {
                "Cache-Control": "no-cache",
                "Content-Type": "application/json",
            }
        };

        var req = http.request(options, function(res) {
            var chunks = [];

            res.on("data", function(chunk) {
                chunks.push(chunk);
            });

            res.on("end", function() {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });

        req.write(JSON.stringify({
            id: 'ekstep.telemetry',
            ver: '3.0',
            ets: Date.now(),
            events: events

        }));
        req.end();

    }
}


const csvWriter = createCsvWriter({
    path: './TelemetryEvents.csv',
    header: [
        { id: 'body', title: 'BODY' }
    ],
    append: true
});


function generate(eid, eventsSize) {
    for (let index = 1; index <= eventsSize; index++) {
        var eventData = TService.generateEvents(eid)
        events.push(eventData)
        syncEvents()
    }
}

setInterval(() => {
    generate(EID_LIST[0], EVENT_SIZE_SPLIT[EID_LIST[0]])
    generate(EID_LIST[1], EVENT_SIZE_SPLIT[EID_LIST[1]])
    generate(EID_LIST[2], EVENT_SIZE_SPLIT[EID_LIST[2]])
}, EVENTS_GENERATE_INTERVAL_TIME)