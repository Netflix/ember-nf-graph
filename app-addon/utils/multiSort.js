function multiSort(arr, sorts) {  
  var prev = function(a,b) { return 0; };
  
  sorts.forEach(function(sort){
    var by = sort.by;
    var dir = sort.direction || 1;
    var tmp = prev;
    var curr = function(a, b) {
      var p = tmp(a, b);
      var va = a[by];
      var vb = b[by]; 
      var z = va === vb ? 0 : (va > vb ? 1 : -1);
      return p || z * dir;
    };    
    prev = curr;
  });
  
  arr.sort(prev);
}