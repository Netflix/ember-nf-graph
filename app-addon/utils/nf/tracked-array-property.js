import Ember from 'ember';

var get = Ember.get;

function trackedArrayProperty(arraySourceProp, trackByProp) {
	var arraySourceDependency = arraySourceProp + '.[]';
	var trackingMetaProp = '__meta__tracking_%@_%@'.fmt(arraySourceProp, trackByProp);

	return function(){
		var meta = this.get(trackingMetaProp) || {};
		var array = meta.array || [];

		var trackBy = trackByProp ? this.get(trackByProp) : null;
		var isTrackByIndex = !trackBy;
		var keyFn = isTrackByIndex ? function(d, i) {
			return i;
		} : function(d) {
			return get(d, trackBy);
		};

		var source = this.get(arraySourceProp);

		if(Ember.isArray(source)) {

			var sourceKeys = [];
			source.forEach(function(d, i) {
				var key = keyFn(d, i);
				sourceKeys.push(key);
				
				var found = array.find(function(x) {
					return keyFn(x) === key;
				});
				
				d.__meta__trackedKey = key;
				
				if(found) {
					Ember.mixin(found, d);
				} else {
					array.pushObject(d);
				}
			});

			array.forEach(function(d, i) {
				var key = keyFn(d, i);
				if(sourceKeys.indexOf(key) === -1) {
					array.removeObject(d);
				}
			});
		}

		this.set(trackingMetaProp, {
			array: array,
		});

		return array;
	}.property(arraySourceDependency);
}

export default trackedArrayProperty;