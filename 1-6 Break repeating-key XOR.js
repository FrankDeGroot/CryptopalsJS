var string1 = 'this is a test';
var string2 = 'wokka wokka!!!';

function hamming(byte1, byte2) {
  var distance = 0;
  for(var i = 0; i < string1.length; i++) {
    //var byte1 = string1.charCodeAt(i);
    //var byte2 = string2.charCodeAt(i);
    var diff = byte1 ^ byte2;
    for(var j = 0; j < 8; j++) {
      distance += diff & 1;
      diff >>= 1;
    }
  }
  return distance;
}

function getFile() {
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
}

function crack(cryptbase64) {
  var bytes = new Buffer(cryptbase64, 'base64');
  var diffs = [];
  for (var keysize = 2; keysize < 40; keysize++) {
    var firstBytes = bytes.slice(0, keysize);
    var secondBytes = bytes.slice(keysize, 2 * keysize);
    var diff = 0;
    for (var i = 0; i < keysize; i++) {
      diff += hamming(firstBytes.readUInt8(i), secondBytes.readUInt8(i));
    }
    diffs.push({keysize: keysize, diff: Math.ceil(diff / keysize)});
  }
  diffs.sort(function (a, b) { return a.diff - b.diff; });
  console.log(diffs.slice(0, 3));
  return bytes;
}

getFile();
