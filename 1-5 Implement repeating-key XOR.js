var plaintext = "Burning 'em, if you ain't quick and nimble\nI go crazy when I hear a cymbal";
var key = "ICE";
function encrypt(plaintext, key) {
  var crypthexes = '';
  for(var i = 0; i < plaintext.length; i++) {
    var char = plaintext[i];
    var byte = char.charCodeAt();
    var keybyte = key.charCodeAt(i % key.length);
    var cryptbyte = byte ^ keybyte;
    var crypthex = '0' + cryptbyte.toString(16);
    crypthexes += ('0' + crypthex).substr(-2);
  }
  return crypthexes;
}
console.log(encrypt(plaintext, key) === '0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f');