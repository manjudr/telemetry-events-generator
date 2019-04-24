var http = require('http');
var TService = require("./TelemetryService")

http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
}).listen(8080);
const BATCH_SIZE = 200
const EID_LIST = ["IMPRESSION", "SEARCH", "LOG"];
const EVENT_SIZE_SPLIT = {
    "IMPRESSION": 3,
    "SEARCH": 5,
    "LOG": 7
}
const EVENTS_GENERATE_INTERVAL_TIME = 10000 // 10 sec
var events = []
var syncEvents = () => {
    if (events.length === BATCH_SIZE) {
        try {
            if (true) {
                events.splice(0, BATCH_SIZE)
            } else {
                console.error("Event sync is failed")
            }
        } catch (e) {
            console.error("Failed to sync")
        }
    }
}

function generate(eid, eventsSize) {
    for (let index = 1; index <= eventsSize; index++) {
        var eventData = TService.generateEvents(eid)
        events.push(eventData)
        syncEvents(events)
    }
}
setInterval(() => {
    generate(EID_LIST[0], EVENT_SIZE_SPLIT[EID_LIST[0]])
    generate(EID_LIST[1], EVENT_SIZE_SPLIT[EID_LIST[1]])
    generate(EID_LIST[2], EVENT_SIZE_SPLIT[EID_LIST[2]])
}, EVENTS_GENERATE_INTERVAL_TIME)

// var timer = setInterval(() => {
//     var eventData = TService.generateEvents(eventName)
//     events.push(eventData)
//     if (events.length == BATCH_SIZE) {
//         syncEvents(events)
//     }
// }, eventsSize);