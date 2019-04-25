var http = require('http');
const TService = require("./TelemetryService")
var traceEvents = require("./traceEvents")
const createCsvWriter = require('csv-writer').createObjectCsvWriter
var TRACE_LIMIT_SIZE = 1000000
var isPushed = false;
http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
}).listen(8080);
var TOTAL_EVENTS_COUNT = 0;
const BATCH_SIZE = 20
const EID_LIST = ["IMPRESSION", "SEARCH", "LOG"];
const EVENT_SIZE_SPLIT = {
    "IMPRESSION": 3,
    "SEARCH": 8,
    "LOG": 2
}
const EVENTS_GENERATE_INTERVAL_TIME = 5000 // 15 sec
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
        var target = []
        const targetEvents = Object.assign(target, events);
        var telemetryEvents = targetEvents.splice(0, BATCH_SIZE)
            // Trace Event log

        // if (TOTAL_EVENTS_COUNT >= TRACE_LIMIT_SIZE) {
        //     telemetryEvents = telemetryEvents.concat(traceEvents)
        //     console.log("telemetryEvents" + telemetryEvents)
        // }
        var req = http.request(options, function(res) {
            var chunks = [];
            res.on("data", function(chunk) {
                chunks.push(chunk);
            });
            res.on("end", function() {
                var body = Buffer.concat(chunks);
                events.splice(0, BATCH_SIZE)
                TOTAL_EVENTS_COUNT = TOTAL_EVENTS_COUNT + telemetryEvents.length
                console.log(TOTAL_EVENTS_COUNT + " Events are synced successfully", body.toString());
                // if (TOTAL_EVENTS_COUNT >= TRACE_LIMIT_SIZE) {
                //     process.exit(0)
                // }
            });
        });

        var data = JSON.stringify({
            id: 'ekstep.telemetry',
            ver: '3.0',
            ets: Date.now(),
            events: telemetryEvents
        })
        req.write(data);
        req.end();
    }
}

function generate(eid, eventsSize) {
    for (let index = 1; index <= eventsSize; index++) {
        var eventData = TService.generateEvents(eid)
        events.push(JSON.parse(JSON.stringify(eventData)))
        if ((TOTAL_EVENTS_COUNT >= TRACE_LIMIT_SIZE) && !isPushed) {
            //console.log("traceEvents" + JSON.stringify(traceEvents))
            events = events.concat(traceEvents)
          
            isPushed = true
        }
         console.log("telemetryEvents" + JSON.stringify(events))
        syncEvents()
    }
}

setInterval(() => {
    generate(EID_LIST[0], EVENT_SIZE_SPLIT[EID_LIST[0]])
    generate(EID_LIST[1], EVENT_SIZE_SPLIT[EID_LIST[1]])
    generate(EID_LIST[2], EVENT_SIZE_SPLIT[EID_LIST[2]])
}, EVENTS_GENERATE_INTERVAL_TIME)