var http = require('http');
var faker = require('faker')
const TService = require("./TelemetryService")
const createCsvWriter = require('csv-writer').createObjectCsvWriter
var traceEvents = require("./tracerEvents")
var TRACE_LIMIT_SIZE = 30
var isPushed = false;
var TOTAL_EVENTS_COUNT = 0;
http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
}).listen(8080);

const BATCH_SIZE = 40
const EID_LIST = ["IMPRESSION", "SEARCH", "LOG"];
const EVENT_SIZE_SPLIT = {
    "IMPRESSION": 10,
    "SEARCH": 12,
    "LOG": 10
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

        var req = http.request(options, function(res) {
            var chunks = [];
            res.on("data", function(chunk) {
                chunks.push(chunk);
            });
            res.on("end", function() {
                var body = Buffer.concat(chunks);
                events.splice(0, BATCH_SIZE)
                TOTAL_EVENTS_COUNT = TOTAL_EVENTS_COUNT + BATCH_SIZE
                console.log(TOTAL_EVENTS_COUNT + " Events are synced", body.toString());
            });
        });
        var target = []
        var targetEvents = Object.assign(target, events);
        if ((TOTAL_EVENTS_COUNT >= TRACE_LIMIT_SIZE) && !isPushed) {
            console.log("Tracer events are pushed..")
            updatedTracerEvents = []
            traceEvents.forEach(function(e, index) {
                e.mid = "LOAD_TEST_" + faker.random.uuid() + "_TRACE" + index
                e.ets = new Date().getTime()
                e.did = faker.random.uuid()
                updatedTracerEvents.push(JSON.parse(JSON.stringify(e)))
            })
            targetEvents = updatedTracerEvents;
            //console.log("trace Events " + JSON.stringify(events))
            isPushed = true
        }
        var data = JSON.stringify({
                id: 'ekstep.telemetry',
                ver: '3.0',
                ets: Date.now(),
                events: targetEvents.splice(0, BATCH_SIZE)
            })
            //console.log("events" + data)
        req.write(data);
        req.end();
    }
}




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