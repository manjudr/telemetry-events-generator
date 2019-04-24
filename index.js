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
    "SEARCH": 60,
    "LOG": 40
}
const EVENTS_GENERATE_INTERVAL_TIME = 15000 // 15 sec
var events = []
var syncEvents = () => {
    if (events.length >= BATCH_SIZE) {
        var http = require("http");
        var options = {
            "method": "POST",
            "host": "28.0.1.6",
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
                events.splice(0, BATCH_SIZE)
                console.log("Event Sync is success", body.toString());
            });
        });
        var target = []
        const targetEvents = Object.assign(target, events);
        var data = JSON.stringify({
            id: 'ekstep.telemetry',
            ver: '3.0',
            ets: Date.now(),
            events: targetEvents.splice(0, BATCH_SIZE)
        })
        req.write(data);
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
        events.push(JSON.parse(JSON.stringify(eventData)))
        syncEvents()
    }
}

setInterval(() => {
    generate(EID_LIST[0], EVENT_SIZE_SPLIT[EID_LIST[0]])
    generate(EID_LIST[1], EVENT_SIZE_SPLIT[EID_LIST[1]])
    generate(EID_LIST[2], EVENT_SIZE_SPLIT[EID_LIST[2]])
}, EVENTS_GENERATE_INTERVAL_TIME)