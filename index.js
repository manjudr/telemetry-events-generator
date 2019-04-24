var http = require('http');
const TService = require("./TelemetryService")
const createCsvWriter = require('csv-writer').createObjectCsvWriter

http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
}).listen(8080);

const BATCH_SIZE = 10
const EID_LIST = ["IMPRESSION", "SEARCH", "LOG"];
const EVENT_SIZE_SPLIT = {
    "IMPRESSION": 1,
    "SEARCH": 1,
    "LOG": 1
}
const EVENTS_GENERATE_INTERVAL_TIME = 10000 // 10 sec
var events = []
var syncEvents = () => {
    console.log("Sync in progress===")
    if (events.length === BATCH_SIZE) {
        var request = require('request');
        var telemetryObj = {
            'id': 'ekstep.telemetry',
            'ver': '3.0',
            'ets': Date.now(),
            'events': events
        }
        const apiPath = "v1/telemetry"
        var options = {
            url: apiPath,
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            json: true,
            body: telemetryObj
        }
        request(options, function(err, res, body) {
            if (err) {
                console.error("Telemetry Sync is failed due to" + err)
            } else {
                events.splice(0, BATCH_SIZE)
                console.info("Telemetry Sync is Success")
            }
        })

        // try {
        //     if (true) {
        //         events.splice(0, BATCH_SIZE)
        //     } else {
        //         console.error("Event sync is failed")
        //     }
        // } catch (e) {
        //     console.error("Failed to sync")
        // }
    }
}


const csvWriter = createCsvWriter({
    path: './TelemetryEvents.csv',
    header: [
        { id: 'body', title: 'BODY' }
    ],
    append: true
});

// csvWriter.writeRecords(records)
//     .then(() => {
//         console.log('...Done');
//     });

function generate(eid, eventsSize) {
    for (let index = 1; index <= eventsSize; index++) {
        var eventData = TService.generateEvents(eid)
        events.push(eventData)
        syncEvents()
            // events.push({ "body": eventData })
            // if (events.length >= BATCH_SIZE) {
            //     csvWriter.writeRecords(events)
            //         .then(() => {
            //             console.log('...Done');
            //         }).catch((e) => {
            //             console.error("Fails to write to csv" + e)
            //         })
            // }

        //syncEvents(events)
    }
}

setInterval(() => {
    generate(EID_LIST[0], EVENT_SIZE_SPLIT[EID_LIST[0]])
    generate(EID_LIST[1], EVENT_SIZE_SPLIT[EID_LIST[1]])
    generate(EID_LIST[2], EVENT_SIZE_SPLIT[EID_LIST[2]])
}, EVENTS_GENERATE_INTERVAL_TIME)