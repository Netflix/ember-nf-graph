import Ember from 'ember';


function trackedArrayProperty(arraySourceProp, trackByProp) {
	var arraySourceDependency = arraySourceProp + '.[]';

	var trackingHash = {};
	var keys = [];
	var array = [];

	return function(){
		var trackBy = trackByProp ? this.get(trackByProp) : null;
		var isTrackByIndex = !trackBy;
		var keyFn = isTrackByIndex ? function(d, i) {
			return i;
		} : function(d) {
			return d[trackBy];
		};

		var source = this.get(arraySourceProp);
		if(Ember.isArray(source)) {

			var sourceKeys = [];
			source.forEach(function(d, i) {
				var key = keyFn(d, i);
				sourceKeys.push(key);

				var tracked = trackingHash[key];
				
				if(typeof tracked !== 'undefined') {
					Ember.mixin(array[tracked], d);
				} else {
					var copy = {};
					Ember.mixin(copy, d);
					copy.$$trackedKey = key;
					array.pushObject(copy);
					keys.push(key);
					trackingHash[key] = array.length - 1;					
				}
			});

			array.forEach(function(d, i) {
				var key = keyFn(d, i);
				if(sourceKeys.indexOf(key) === -1) {
					var index = trackingHash[key];
					for(var j = index; j < keys.length; j++) {
						var updateKey = keys[j];
						trackingHash[updateKey]--;
					}
					array.removeObject(d);
					delete trackingHash[key];
				}
			});

			return array;
		}
	}.property(arraySourceDependency);
}


export default trackedArrayProperty;