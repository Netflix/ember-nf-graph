
import Ember from 'ember';

var get = Ember.get;

function createMultiSort(sorts) {
	var initialSort = function() { return 0; };
  
  return sorts.map(function(sort) {
  	var dir = 1;
  	var getProp;
  	switch(typeof sort) {
  		case 'string':
  			getProp = function(o) {
          return get(o, sort);
        };
  			break;
  		case 'object':
  			getProp = function(o) {
          return get(o, sort.by);
        };
  			dir = sort.direction;
  			break;
  		case 'function':
  			return sort;
  	}

  	return function(a, b) {
			var va = getProp(a);
			var vb = getProp(b);
			var z = va === vb ? 0 : (va > vb ? 1 : -1);
    	return z * dir;
		};
  }).reduce(function(tmp, sortFn){
    return function(a, b) {
      return tmp(a, b) || sortFn(a, b);
    };    
  }, initialSort);
}

export default function multiSort(arr, sorts) {  
  if(Array.isArray(arr) && Array.isArray(sorts) && sorts.length > 0 && arr.length > 1) {
    arr.sort(createMultiSort(sorts));
  }
}