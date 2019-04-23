var faker = require('faker')

const EID_LIST = ["START", "END", "IMPRESSION", "INTERACT", "ASSESS", "RESPONSE", "INTERRUPT", "FEEDBACK", "SHARE", "AUDIT", "ERROR", "HEARTBEAT", "LOG", "SEARCH", "METRICS"];
const ACTOR_TYPE = ["User", "System"]
const CONTEXT_ENV = ["contentplayer", "home", "workspace", "explore", "public", "library", "course", "user"]
const PDATA_PID = ["sunbird-portal", "sunbird-portal.contentplayer", "sunbird.app", "sunbird-portal.contenteditor", "sunbird-portal.collectioneditor", "sunbird-portal.collectioneditor.contentplayer"]
const PDATA_ID = ["sunbird-portal", "sunbird.app"]
const OBJECT_TYPE = ["Content", "Community", "User"]
const OBJECT_IDENTIFIER = ["do_9584365784369", "do_87982865874867"]
const ETS_GENERATION_DATE_RANGE = { from: "2015-01-01", to: "2022-12-31" }
var TelemetryService = {
    generateEvents() {
        var eid = faker.random.arrayElement(EID_LIST)
        var eData = this.getEventData(eid)
        this.updateEventEnvelop(eData, eid)
    },

    getEventData(eid) {
        const eventData = require('./eventData')
        return eventData[eid.toLowerCase()]
    },
    updateEventEnvelop(eData, eid) {
        const eventEnvelop = require('./envelop.js')
        eventEnvelop.eData = eData
        eventEnvelop.eid = eid
        eventEnvelop.ets = faker.date.between(ETS_GENERATION_DATE_RANGE.from, ETS_GENERATION_DATE_RANGE.to).getTime()
        eventEnvelop.mid = faker.random.uuid()
            // update actor object
        eventEnvelop.actor.type = faker.random.arrayElement(ACTOR_TYPE)
            // Update context object 
        eventEnvelop.context.channel = faker.random.uuid()
        eventEnvelop.context.did = faker.random.uuid()
        eventEnvelop.context.env = faker.random.arrayElement(CONTEXT_ENV)
        eventEnvelop.context.sid = faker.random.uuid()
            //update context pdata object 
        eventEnvelop.context.pdata.pid = faker.random.arrayElement(PDATA_PID)
        eventEnvelop.context.pdata.id = faker.random.arrayElement(PDATA_ID)
        eventEnvelop.context.pdata.ver = faker.random.number({ min: 1, max: 10 })
        eventEnvelop.context.rollup.l1 = faker.random.arrayElement(OBJECT_IDENTIFIER)
        eventEnvelop.context.rollup.l2 = "do_" + faker.random.uuid()
        eventEnvelop.context.rollup.l3 = "do_" + faker.random.uuid()
        eventEnvelop.context.rollup.l4 = "do_" + faker.random.uuid()



        // update object data
        eventEnvelop.object.id = faker.random.arrayElement(OBJECT_IDENTIFIER)
        eventEnvelop.object.ver = faker.random.number({ min: 1, max: 4 })
        eventEnvelop.object.type = faker.random.arrayElement(OBJECT_TYPE)
        eventEnvelop.object.rollup.l1 = faker.random.arrayElement(OBJECT_IDENTIFIER)
        eventEnvelop.object.rollup.l2 = faker.random.arrayElement(OBJECT_IDENTIFIER)
        eventEnvelop.object.rollup.l3 = faker.random.arrayElement(OBJECT_IDENTIFIER)
        eventEnvelop.object.rollup.l4 = faker.random.arrayElement(OBJECT_IDENTIFIER)

        // update tags
        eventEnvelop.tags = faker.random.uuid()



        console.log("Telemetry Event: " + JSON.stringify(eventEnvelop))

    }
}
module.exports = TelemetryService