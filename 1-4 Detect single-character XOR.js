var http = require('http');

var options = {
  hostname: 'cryptopals.com',
  port: 80,
  path: '/static/challenge-data/4.txt',
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

function crack(body) {
  var lines = body.split('\n'),
      cracked = {},
      candidates = [];
  for(var i = 0; i < lines.length; i++) {
    cracked = crackLine(lines[i]);
    if (cracked.key !== 0) {
      candidates.push(cracked);
    }
  }
  candidates.sort(function(a, b) {
    return b.text - a.text;
  });
  return candidates[0];
}

function hex2bytes(cryptext) {
  var bytes = [];
  for(var i = 0; i < cryptext.length; i += 2) {
    bytes.push(parseInt(cryptext.slice(i, i + 2), 16));
  }
  return bytes;
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

function count(plaintext, char) {
  var count = 0;
  for(var i = 0; i < plaintext.length; i++) {
    if (plaintext[i].toUpperCase() === char) {
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

function crackLine(cryptext) {
  var cryptBytes = hex2bytes(cryptext),
      counts = [];
  for (var key = 0; key < 256; key++) {
    var plaintext = decode(decrypt(cryptBytes, key));
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
