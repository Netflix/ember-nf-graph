import Ember from 'ember';

function trackedArrayProperty(arraySourceProp, trackBy) {
	var isTrackByIndex = !trackBy;
	var keyFn = isTrackByIndex ? function(d, i) {
		return i;
	} : function(d) {
		return d[trackBy];
	};

	var arraySourceDependency = isTrackByIndex ? 
		arraySourceProp + '.@each.' + trackBy :
		arraySourceProp + '.[]';

	var trackingHash = {};
	var array = [];

	return function(){
		var source = this.get(arraySourceProp);
		if(Ember.isArray(source)) {
			var trackedKeys = [];
			source.forEach(function(d, i) {
				var key = keyFn(d, i);
				trackedKeys.push(key);
				var tracked = trackingHash[key];
				if(!tracked) {
					array.pushObject(d);
				}
				trackingHash[key] = true;
			});

			array.forEach(function(d, i) {
				var key = keyFn(d, i);
				if(trackedKeys.indexOf(key) === -1) {
					array.removeObject(d);
					delete trackingHash[key];
				}
			});

			return array;
		}
	}.property(arraySourceDependency);
}


export default trackedArrayProperty;