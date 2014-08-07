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
  'use strict';
  
  var min = 0;
  var max = arr.length - 1;
  var i;
  var curr;

  mappingFn = mappingFn || identity;

  while (min <= max) {
    i = (min + max) / 2 || 0;
    curr = mappingFn(arr[Math.floor(i)]);
    if (curr < val) {
      min = i + 1;
    }
    else if (curr > val) {
      max = i - 1;
    }
    else {
      i = i - 1;
      break;
    }
  }
  var a = Math.floor(i);
  var b = Math.ceil(i);
  var av = mappingFn(arr[a]);
  var bv = mappingFn(arr[b]);
  if(Math.abs(av - val) <= Math.abs(bv - val)) {
    return a;
  } else {
    return b;
  }
}

