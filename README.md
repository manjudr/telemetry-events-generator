# Sunbird Telemetry Events Generation Utility

This utility allows generation of sample telemetry events based on the Sunbird Telemetry Specification. Useful for generating sample events for writing data products.

### Installation
You will need node/npm installed before installing. 

```shell
git clone https://github.com/manjudr/telemetry-events-generator.git
cd telemetry-events-generator
npm i
```

### Usage
Right now, a single generate.js command is available that will generate and print events to the console.

```shell
node generate.js <count> <eid>
```
`count` - the number of sample events to generate

`eid` - the type of event to generate. Currently impression, search and log event types are supported

### Example
The below command will generate 10000 IMPRESSION events and write them to the sample-events.txt file.
```shell
node generate.js 10000 IMPRESSION > sample-events.txt
```

