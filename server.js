var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/legend.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/legend.js'));
});

app.get('/dataselector.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/dataselector.js'));
});

app.get('/styling.css', function(req, res) {
    res.sendFile(path.join(__dirname + '/styling.css'));
});

app.get('/app.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/app.js'));
});

app.get('/data', function(req, res) {
    res.sendFile(path.join(__dirname + '/whocovid19.csv'));
});

app.get('/worldTopoData', function(req, res) {
    res.sendFile(path.join(__dirname + '/worldTopoData.json'));
});

app.listen(8080);

