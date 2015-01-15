var cryptext = '1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736';
var cryptBytes = hex2bytes(cryptext);
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
function crack() {
  var counts = [];
  for (var key = 0; key < 256; key++) {
    var plaintext = decode(decrypt(cryptBytes, key));
    counts.push({ key: key, text: countText(plaintext), frequencies: frequencies(plaintext), plaintext: plaintext});
  }
  counts.sort(function (a, b) {
    return b.text - a.text;
  });
  console.log(counts.slice(0, 1));
}
crack();