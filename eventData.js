var faker = require('faker')

var EventDataService = {
    getData(eid) {
        var EventData = {
            "start": {
                "type": faker.random.arrayElement(["app", "session", "editor", "player", "workflow", "assessment"]),
                "dspec": "",
                "uaspec": faker.random.arrayElement([
                    "Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; SCH-I535 Build/KOT49H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
                    "Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36",
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1",
                    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9"
                ]),
                "loc": "",
                "mode": faker.random.arrayElement(["play", "edit", "preview"]),
                "duration": (faker.random.number({ min: 1, max: 9 }) * 1000),
                "pageid": ""
            },
            "end": {
                "type": faker.random.arrayElement(["app", "session", "editor", "player", "workflow", "assessment"]),
                "mode": faker.random.arrayElement(["play", "edit", "preview"]),
                "duration": (faker.random.number({ min: 1, max: 200 })),
                "pageid": faker.random.uuid(),
                "summary": []
        
            },
            "impression": {
                "type": faker.random.arrayElement(["list", "detail", "view", "edit", "workflow", "search"]),
                "subtype": faker.random.arrayElement(["Paginate", "Scroll"]),
                "pageid": faker.random.uuid(),
                "uri": faker.random.arrayElement(["/home", "/resources", "/learn", "/signup", "/workspace/content/create", "/explore"]),
                "duration": (faker.random.number({ min: 1, max: 60 })),
                "visits": [{
                    "objid": faker.random.arrayElement(
                        ["do_21271780182595993616932",
                            "do_21274813398450176015065",
                            "do_21273327871526502413924",
                            "do_21274109254696140814898",
                            "do_21273610197362278414264",
                            "do_21270182445096140811457",
                            "do_312469507013812224118164",
                            "do_312466405614305280216635",
                            "do_312593229238837248123109",
                            "do_312470914624577536218447",
                            "do_2127270883650600961273"
                        ]),
                    "objtype": faker.random.arrayElement(["Resource", "Course", "TextBook"]),
                    "objver": (faker.random.number({ min: 0, max: 1 })).toString(),
                    "section": faker.random.arrayElement(["Popular Books", "My Course", "My Resource"]),
                    "index": (faker.random.number({ min: 1, max: 2 })),
                }]
            },
            "interact": {
                "type": "",
                "subtype": "",
                "id": "",
                "pageid": "",
                "target": "",
                "duration": "",
                "plugin": "",
                "extra": {
                    "pos": [{}],
                    "values": []
                }
            },
            "log": {
                "type": "api_access", // Required. Type of log (system, process, api_access, api_call, job, app_update etc)
                "level": faker.random.arrayElement(["INFO", "FATAL", "WARN", "ERROR", "DEBUG"]), // Required. Level of the log. TRACE, DEBUG, INFO, WARN, ERROR, FATAL
                "message": faker.random.arrayElement(["TelemetryServiceImpl sync@SyncServiceImpl", "UserProfileServiceImpl getUserProfileDetails@UserProfileServiceImpl", "ContentServiceImpl searchSunbirdContent@ContentServiceImpl"]),
                "pageid": faker.random.uuid(),
                "params": [{ "service": "UserProfileServiceImpl" }, { "method": "getUserProfileDetails@UserProfileServiceImpl" }, { "mode": "MDATA" },
                    {
                        "request": {
                            "logLevel": "2",
                            "request": { "refreshUserProfileDetails": false, "returnRefreshedUserProfileDetails": false, "userId": "8ac9ee6e-e622-422d-969d-b87d64704ad4" }
                        }
                    }
                ]
            },
            "search": {
                "type": faker.random.arrayElement(["all", "content", "org"]),
                "query": faker.random.word(),
                "filters": {
                    "dialcodes": faker.random.arrayElement(["FGGWGM", "71EHR5", "KP9I3J", "ETINEA"]),
                    "channel": {
                        "ne": ["0124433024890224640", "0124446042259128320", "0124487522476933120", "0125840271570288640"]
                    }
                },
                "sort": {},
                "correlationid": "",
                "size": faker.random.number({ min: 10, max: 50 }),
                "topn": [{ "identifier": faker.random.arrayElement(["do_312469516571246592118169", "do_312469516571246592118169", "do_21271780182595993616932", "do_312473754833977344219585"]) }] // Required. top N (configurable) results with their score
            }
        
        
        }

        return EventData[eid];
    }
}

module.exports = EventDataService