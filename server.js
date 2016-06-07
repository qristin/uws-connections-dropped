'use strict';

const fs = require('fs');
const util = require('util');
const https = require('https');
const express = require('express');
const WebSocketServer = require('uws').Server;

const privateKey = fs.readFileSync('secrets/key.pem', 'utf8');
const certificate = fs.readFileSync('secrets/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Start the webserver.
const app = express();
const server = https.createServer(credentials, app).listen(8443, function() {
  console.log('Using Node %s.', process.version); // make sure to use node 4.4
  console.log('Express server listening on port 8443');
});

const wss = new WebSocketServer({
  server: server
});

wss.on('connection', function(ws) {

  // Regularly send ping message
  setInterval(function() {
    console.log('%s - Sending message', new Date());
    ws.send('ping');
  }, 1000);

  console.log('Client connected');

  ws.on('message', function incoming(data) {
    console.log('Got message with %d bytes', Buffer.byteLength(data, 'utf8'));
  });

  ws.on('close', function close(closingCode, closingReason) {
    console.log('Client disconnected. Because %s - %s', closingCode, closingReason);
  });

  ws.on('error', function error(err) {
    console.error('Error: %s', err);
  });
});
