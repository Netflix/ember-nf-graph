export default function parsePropertyExpression(expr) {
  var c, i;
  var isIndex = false;
  var token = '';
  var tokens = [];
  var addToken = function(){
    if(token === '') {
      return;
    }
    if(isIndex) {
      token = +token;
    }
    tokens.push(token);
    token = '';
    isIndex = c === '[';    
  };
  
  for(i = 0; i < expr.length; i++) {
    c = expr[i];
    if('[].'.indexOf(c) >= 0) {
      addToken();
    } else {
      token += c;
    }
  }
  
  addToken();
  
  return function(obj){
    var i, next;
    var result = obj[tokens[0]];
    for(i = 1; i < tokens.length; i++) {
      next = result[tokens[i]];
      if(typeof next !== 'object') {
        return next;
      }
      result = next;
    }
    return result;
  };
}