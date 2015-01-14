var cryptext = '1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736';
var cryptBytes = function () {
  var bytes = [];
  for(var i = 0; i < cryptext.length; i += 2) {
    bytes.push(parseInt(cryptext.slice(i, i + 2), 16));
  }
  return bytes;
}();
//console.log(bytes);
function decrypt(cryptBytes, key) {
  var plainBytes = [];
  for(var i = 0; i < cryptBytes.length; i++) {
    plainBytes.push(cryptBytes[i] ^ key);
  }
  return plainBytes;
}
function count(plainBytes, char) {
  var count = 0;
  for(var i = 0; i < plainBytes.length; i++) {
    if (String.fromCharCode(plainBytes[i]).toUpperCase() === char) {
      count++;
    }
  }
  return count;
}
function decode(plainBytes) {
  var text = '';
  for(var i = 0; i < plainBytes.length; i++) {
    text += String.fromCharCode(plainBytes[i]);
  }
  return text;
}
function frequencies(plainBytes) {
  var topUsed = "ETAOINSHRDLU",
  frequencies = {},
  char = '';
  for(var i = 0; i < topUsed.length; i++) {
    char = topUsed[i];
    frequencies[char] = count(plainBytes, char);
  }
  return frequencies;
}
var counts = [];
for (var key = 0; key < 256; key++) {
  var plainBytes = decrypt(cryptBytes, key);
  counts.push({ key: key, frequencies: frequencies(plainBytes), plaintext: decode(plainBytes)});
}
counts.sort(function (a, b) {
  return b.frequencies.E - a.frequencies.E;
});
console.log(counts.slice(0, 15));
