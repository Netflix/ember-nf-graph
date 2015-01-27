/**
  A function that will parse a path expression into a "getter" function that
  can retrieve a value from that path off of any object when called.

  ### Example
        
        import parsePropertyExpr from 'utils/parse-property-expr';

        var test = { foo: { bar: ['apple', 'banana'] } };
        var getFooBar1 = parsePropertyExpr('foo.bar[1]');
        var result = getFooBar1(test);
        console.log(result); // "banana"

  ### Notes

  Will return `undefined` if the nothing is at the end of the path, or the
  path cannot be reached.

  @namespace utils
  @class parse-property-expression
*/


/**  
  @method default
  @param expr {String} the expression to parse
  @return {Function} a function that when called with an object,
  will locate the value at the end of the expressed path.
*/
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
    if(result) {
      for(i = 1; i < tokens.length; i++) {
        next = result[tokens[i]];
        if(typeof next !== 'object') {
          return next;
        }
        result = next;
      }
    }
    return result;
  };
}