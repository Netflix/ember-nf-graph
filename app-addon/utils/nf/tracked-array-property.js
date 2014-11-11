import Ember from 'ember';

var get = Ember.get;

function trackedArrayProperty(arraySourceProp, trackByProp, backingField) {
	var arraySourceDependency = arraySourceProp + '.[]';

	backingField = backingField || '_%@_trackBy_%@'.fmt(arraySourceProp, trackByProp);

	return function(){
		var array = this.get(backingField);

		if(!Ember.isArray(array)){
			array = Ember.A();
		}

		var trackBy = trackByProp ? this.get(trackByProp) : null;
		var keyFn = !trackBy ? function(d, i) {
			return i;
		} : function(d) {
			return get(d, trackBy);
		};

		var source = this.get(arraySourceProp);

		if(!Ember.isArray(source) || source.length === 0) {
			array = Ember.A();
		} else {
			var sourceKeys = [];
			source.forEach(function(d, i) {
				var key = keyFn(d, i);
				sourceKeys.pushObject(key);
				
				var found = array.find(function(x) {
					return keyFn(x) === key;
				});
				
				Ember.set(d, '__meta__trackedKey', key);

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

		this.set(backingField, array);
		
		return array;
	}.property(arraySourceDependency);
}

export default trackedArrayProperty;