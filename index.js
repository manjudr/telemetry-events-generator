var http = require('http');
var TService = require("./TelemetryService")

http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World!');
}).listen(8080);
TService.generateEvents()