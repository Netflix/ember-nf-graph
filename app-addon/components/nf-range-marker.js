import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import { property } from '../utils/computed-property-helpers';

export default Ember.Component.extend(HasGraphParent, {
	tagName: 'g',
	isRangeMarkerContainer: true,

	orient: 'bottom',
	markerMargin: 10,

	markers: property(function(){
		return [];
	}),

	registerMarker: function(marker) {
		var markers = this.get('markers');
		var prevMarker = markers[markers.length - 1];
		
		if(prevMarker) {
			prevMarker.nextMarker = marker;
			marker.prevMarker = prevMarker;
		}
	}
});