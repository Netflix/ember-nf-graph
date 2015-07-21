export var max = function(array) {
  if(!Array.isArray(array)) {
    return array;
  }
  var test = array.filter(item => !isNaN(item));
  var result = Math.max.apply(null, test);
  return result;
};

export var min = function(array) {
  if(!Array.isArray(array)) {
    return array;
  }
  var test = array.filter(item => !isNaN(item));
  var result = Math.min.apply(null, test);
  return result;
};
