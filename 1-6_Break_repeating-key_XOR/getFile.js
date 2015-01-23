'use strict'

var Promise = require('promise');

exports.getFile = function(host, path) {
  return new Promise(function(resolve, reject) {
    var http = require('http');

    var options = {
      hostname: 'cryptopals.com',
      port: 80,
      path: '/static/challenge-data/6.txt',
      method: 'GET'
    };

    var req = http.request(options, function(res) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      }).on('end', function() {
        resolve(body);
      });
    }).on('error', function(e) {
      reject(e);
    }).end();
  });
}
