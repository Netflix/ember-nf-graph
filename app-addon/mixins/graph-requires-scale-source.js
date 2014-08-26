import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';

var scaleProperty = function(xScaleKey, zoomKey, offsetKey){
	return property(xScaleKey, zoomKey, offsetKey, function(scale, zoom, offset) {
		if(zoom === 1 && offset === 0) {
			return scale;
		}

		var copy = scale.copy();
		var domain = copy.domain();
		copy.domain([domain[0] / zoom, domain[1] / zoom]);

		var range = copy.range();
		copy.range([range[0] - offset, range[1] - offset]);

		return copy;
	});
};

export default Ember.Mixin.create({
	xScale: scaleProperty('scaleSource.xScale', 'scaleZoomX', 'scaleOffsetX'),
	
	yScale: scaleProperty('scaleSource.yScale', 'scaleZoomY', 'scaleOffsetY'),

	_scaleOffsetX: 0,

	_scaleOffsetY: 0,

	_scaleZoomX: 1,

	_scaleZoomY: 1,

	scaleZoomX: function(key, value) {
		if(arguments.length > 1) {
			this._scaleZoomX = +value;
		}
		return this._scaleZoomX || 1;
	}.property(),

	scaleZoomY: function(key, value) {
		if(arguments.length > 1) {
			this._scaleZoomY = +value;
		}
		return this._scaleZoomY || 1;
	}.property(),

	scaleOffsetX: function(key, value) {
		if(arguments.length > 1) {
			this._scaleOffsetX = +value;
		}
		return this._scaleOffsetX || 0;
	}.property(),

	scaleOffsetY: function(key, value) {
		if(arguments.length > 1) {
			this._scaleOffsetY = +value;
		}
		return this._scaleOffsetY || 0;
	}.property(),

	_getScales: function(){
		var scaleSource = this.nearestWithProperty('isScaleSource');
		this.set('scaleSource', scaleSource);
	}.on('init'),
});