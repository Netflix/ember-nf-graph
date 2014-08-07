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