var input = '49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d';
var expected = 'SSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29t';
var result = convert(input);
console.log(result);
console.log(expected);
console.log(result === expected ? 'yay!' : 'boo!');
function convert(hexChars) {
  var base64Map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var base64Codes = '';
  var hexCodes = [];
  var hexBits = '';
  var base64Bits = '';
  var hexCode = 0;
  var binCode = '';
  var base64Code1 = 0;
  var base64Code2 = 0;
  for(var i = 0; i < hexChars.length; i++) {
    hexCode = parseInt(hexChars[i], 16);
    binCode = hexCode.toString(2);
    hexCodes.push(hexCode);
    hexBits += '|' + ('000' + binCode).slice(-4);
    if (i % 3 === 2) {
      base64Code1 = (hexCodes[i - 2] << 2) + (hexCodes[i - 1] >> 2);
      base64Code2 = ((hexCodes[i - 1] & 3) << 4) + hexCodes[i];
      base64Bits += '|' + ('00000' + base64Code1.toString(2)).slice(-6) + '|' + ('00000' + base64Code2.toString(2)).slice(-6);
      base64Codes += base64Map[base64Code1] + base64Map[base64Code2];
    }
  }
  console.log(hexBits.slice(0, 70));
  console.log(base64Bits.slice(0, 56));
  return base64Codes;
}
