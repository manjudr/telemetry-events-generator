const cliArgs = process.argv.slice(2);
ecount = cliArgs[0] || 1;
eid = cliArgs[1] || 'IMPRESSION';
events = []

console.log("Generating", ecount, eid, "event(s)")

for (let index = 1; index <= ecount; index++) {
    let TService = require("./TelemetryService")
    var eventData = TService.generateEvents(eid)
    events.push(JSON.stringify(eventData))
}

console.log(events.join("\n"))

