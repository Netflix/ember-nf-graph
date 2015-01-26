/**
  @module utils/nf/array-helpers
*/

/**
  returns whatever you pass into it.
  @method identity
  @param x {Any}
  @private
  @return {Any} x
*/
function identity(x) {
  return x;
}

/**
  Performs a binary search on the array and finds the nearest index to the value passed.
  @method nearestIndexTo
  @param arr {Array} the *sorted* array to search.
  @param val {Number} the value to find the nearest index to.
  @param mappingFn {Function} an optional function for pulling values out of the 
  array items.
*/
export function nearestIndexTo(arr, val, mappingFn) {
  mappingFn = mappingFn || identity;
  var startIndex  = 0;
  var stopIndex = arr.length - 1;
  var middle = (stopIndex + startIndex) / 2;
  var a = Math.floor(middle);
  var b = Math.floor(middle + 1);

  var getItem = function(i){
    return mappingFn(arr[i]);
  };

  var av = getItem(a);
  var bv = getItem(b);

  while(!(av <= val && val <= bv) && startIndex < stopIndex){

    if (val < av){
        stopIndex = middle - 1;
    } else if (val > av){
        startIndex = middle + 1;
    }

    middle = (stopIndex + startIndex) / 2;
    a = Math.floor(middle);
    b = Math.floor(middle + 1);
    av = getItem(a);
    bv = getItem(b);
  }

  return (Math.abs(val - av) < Math.abs(val - bv)) ? a : b;
}

var NATURAL_SORT_REGEXP = /[+-]?\d+\.?\d*|\S+/g;

/**
  breaks a string into an array of tokens in preparation for natural
  comparison and sorting.
  @method naturalTokenize
  @param item {String} the value to tokenize
  @return {Array} an array of tokens found in the item
  @private
*/
function naturalTokenize(item) {
  NATURAL_SORT_REGEXP.lastIndex = 0;
  var matches;
  var tokens = [];
  while(matches = NATURAL_SORT_REGEXP.exec(item)) {
    tokens.push(matches[0]);
  }
  return tokens;
}

/**
  A JavaScript sorting predicate for natural sorting.
  @method naturalCompare
  @param a {Any} the value to compare to b
  @param b {Any} the value to compare to a
  @return {Number} `-1`, `0` or `1` if a is less than, equal to, or
    greater than b, respectively.
*/
export function naturalCompare(a, b) {
  var aTokens = naturalTokenize(a);
  var bTokens = naturalTokenize(b);
  var i = 0, bx, ax, na, nb;

  while((ax = aTokens[i]) && (bx = bTokens[i++])) {
    na = +ax;
    nb = +bx;
  
    if(nb === nb && na === na) {
      if(na !== nb) {
         return na > nb ? 1 : -1;
      } else {
        if(ax.length !== bx.length) {
          return ax.length > bx.length ? 1 : -1;
        }
      }
    }
  
    if(ax !== bx) {
      return ax > bx ? 1 : -1;
    }
  }

  return 0;
}

/**
  Sorts the array "naturally". Meaning taking into account both
  alphabetical and numeric sorting within strings.

  @method natualSort
  @param arr {Array} the array to sort
*/
export function naturalSort(arr) {
  arr.sort(naturalCompare);
}