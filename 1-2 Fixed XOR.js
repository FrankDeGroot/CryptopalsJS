var input1 = '1c0111001f010100061a024b53535009181c';
var input2 = '686974207468652062756c6c277320657965';

var output = xor(input1, input2);
console.log(output);
console.log(output == '746865206b696420646f6e277420706c6179' ? 'yay!' : 'boo!');
function xor(input1, input2) {
  var code1, code2, output = '';
  for(var i = 0; i < input1.length; i++) {
    code1 = parseInt(input1[i], 16);
    code2 = parseInt(input2[i], 16);
    output += (code1 ^ code2).toString(16);
  }
  return output;
}
