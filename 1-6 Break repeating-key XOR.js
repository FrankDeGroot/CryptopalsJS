var string1 = 'this is a test';
var string2 = 'wokka wokka!!!';

function hamming(string1, string2) {
  var distance = 0;
  for(var i = 0; i < string1.length; i++) {
    var byte1 = string1.charCodeAt(i);
    var byte2 = string2.charCodeAt(i);
    var diff = byte1 ^ byte2;
    for(var j = 0; j < 8; j++) {
      distance += diff & 1;
      diff >>= 1;
    }
  }
  return distance;
}
console.log(hamming(string1, string2));
var http = require('http');

var options = {
  hostname: 'cryptopals.com',
  port: 80,
  path: '/static/challenge-data/6.txt',
  method: 'GET'
};

var req = http.request(options, function(res) {
  var body = '';
  res.on('data', function (chunk) {
    body += chunk;
  }).on('end', function() {
    console.log(crack(body));
  });
}).on('error', function(e) {
  console.log('problem with request: ' + e.message);
}).end();

function crack(cryptbase64) {
  var bytes = base642bytes(cryptbase64);
}

function base642bytes(base64) {
  var base64Map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  
}