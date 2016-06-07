'use strict';

const WebSocket = require('websocket').client;
const fs = require('fs');
const util = require('util');

const host = 'wss://0.0.0.0:8443/';
const dataBlob = fs.readFileSync('lorem.txt');

const ws = new WebSocket();
ws.on('connect', function(conn) {
  console.log('Connected to %s', host);

  conn.on('message', function(data) {
    console.log('Received message: %s', util.inspect(data));
    conn.sendUTF(dataBlob);
  });

  conn.on('error', function(error) {
    console.log('Error: %s', error);
  });

  conn.on('close', function(code, reason) {
    console.log('Closing connection, because: %s - %s', code, reason);
  });
});

ws.on('connectFailed', function(error) {
  console.log('Failed to connect to %s, due to error: %s', host, error);
});

const requestOptions = {
  strictSSL: false,
  rejectUnauthorized: false // Accept self-signed certificates.
};
ws.connect(host, null, null, null, requestOptions);
