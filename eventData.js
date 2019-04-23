var faker = require('faker')
var EventData = {
    "start": {
        "type": faker.random.arrayElement(["app", "session", "editor", "player", "workflow", "assessment"]),
        "dspec": "",
        "uaspec": "",
        "loc": "",
        "mode": faker.random.arrayElement(["play", "edit", "preview"]),
        "duration": (faker.random.number({ min: 1, max: 9 }) * 1000),
        "pageid": ""
    },
    "end": {

    },
    "impression": {

    },
    "interact": {

    }

}
module.exports = EventData