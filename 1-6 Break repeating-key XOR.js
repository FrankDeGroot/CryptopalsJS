'use strict';

getFile();

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
  var bytes = new Buffer(cryptbase64, 'base64'),
    keysize = guessKeysize(bytes),
    buckets = split(createBuckets(keysize), bytes),
    crackedBuckets = [];
  for(var k = 0; k < keysize; k++) {
    crackedBuckets.push(crackSingleByteXOR(buckets[k]));
  }
  return reassemble(bytes.length, crackedBuckets);
}

function createBuckets(keysize) {
  var buckets = [];
  for(var i = 0; i < keysize; i++) {
    buckets.push([]);
  }
  return buckets;
}

function split(buckets, bytes) {
  for(var j = 0; j < bytes.length; j++) {
    buckets[j % buckets.length].push(bytes.readUInt8(j));
  }
  return buckets;
}

function reassemble(length, crackedBuckets) {
  var crackedText = '',
    keysize = crackedBuckets.length,
    max = Math.floor(length / keysize);
  for(var m = 0; m < max; m++) {
    for(var l = 0; l < keysize; l++) {
      crackedText += crackedBuckets[l].plaintext[m];
    }
  }
  for(var n = 0; n < length % max; n++) {
    crackedText += crackedBuckets[n].plaintext[max];
  }
  return crackedText;
}

function guessKeysize(bytes) {
  var diff, diffs = [];
  for (var keysize = 2; keysize < 40; keysize++) {
    diff = 0;
    for (var blockIndex = 0; blockIndex < Math.floor(bytes.length / keysize) - 1; blockIndex++) {
      for (var byteIndex = 0; byteIndex < keysize; byteIndex++) {
        diff += hamming(bytes.readUInt8(blockIndex * keysize + byteIndex), bytes.readUInt8((blockIndex + 1) * keysize + byteIndex));
      }
    }
    diffs.push({keysize: keysize, diff: diff / (keysize * blockIndex)});
  }
  diffs.sort(function (a, b) { return a.diff - b.diff; });
  return diffs[0].keysize;
}

function hamming(byte1, byte2) {
  var distance = 0, diff = byte1 ^ byte2;
  while (diff) {
    distance += diff & 1;
    diff >>= 1;
  }
  return distance;
}

function crackSingleByteXOR(bytes) {
  var counts = [];
  for (var key = 0; key < 256; key++) {
    var plaintext = decode(decrypt(bytes, key));
    counts.push({ key: key, text: countText(plaintext), frequencies: frequencies(plaintext), plaintext: plaintext});
  }
  counts.sort(function (a, b) {
    var diff = b.text - a.text;
    for (var i = 0; i < frequencies.length; i++) {
      diff = diff || b.frequencies[i] - a.frequencies[i];
    }
    return diff;
  });
  return counts[0];
}

function decrypt(cryptBytes, key) {
  var plainBytes = [];
  for(var i = 0; i < cryptBytes.length; i++) {
    plainBytes.push(cryptBytes[i] ^ key);
  }
  return plainBytes;
}

function decode(plainBytes) {
  var plaintext = '';
  for(var i = 0; i < plainBytes.length; i++) {
    plaintext += String.fromCharCode(plainBytes[i]);
  }
  return plaintext;
}

function countText(plaintext) {
  var count = 0;
  for(var i = 0; i < plaintext.length; i++) {
    if(plaintext[i].match(/[A-Za-z ]/)) {
      count++;
    }
  }
  return count;
}

function frequencies(plaintext) {
  var topUsed = "ETAOINSHRDLU",
  frequencies = {},
  char = '';
  for(var i = 0; i < topUsed.length; i++) {
    char = topUsed[i];
    frequencies[char] = count(plaintext, char);
  }
  return frequencies;
}

function count(plaintext, char) {
  var count = 0;
  for(var i = 0; i < plaintext.length; i++) {
    if (plaintext[i].toUpperCase() === char) {
      count++;
    }
  }
  return count;
}
