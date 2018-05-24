var express = require("express");
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var app= express();
var debaug = require('debug')('expressdebug: server')

// API file for interacting with MongoDB
const apihero = require('./server/routes/apihero');
const apiuser = require('./server/routes/apiuser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));
// API location
app.use('/apihero', apihero);
app.use('/apiuser', apiuser);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Set Port
const port = process.env.PORT || '4200';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));

