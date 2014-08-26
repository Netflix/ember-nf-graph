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

/**
	Adds functionality to identify a parent control that will provide an x and
	y scale, then adds scaling properties to the component it's mixed in to.
	@namespace mixins
	@class graph-requires-scale-source
*/
export default Ember.Mixin.create({
	/**
		The x scale used by this component
		@property xScale
		@type d3.scale
		@readonly
	*/
	xScale: scaleProperty('scaleSource.xScale', 'scaleZoomX', 'scaleOffsetX'),
	
	/**
		The y scale used by this component
		@property yScale
		@type d3.scale
		@readonly
	*/
	yScale: scaleProperty('scaleSource.yScale', 'scaleZoomY', 'scaleOffsetY'),

	_scaleOffsetX: 0,

	_scaleOffsetY: 0,

	_scaleZoomX: 1,

	_scaleZoomY: 1,

	/**
		The zoom multiplier for the x scale
		@property scaleZoomX
		@type Number
		@default 1
	*/
	scaleZoomX: function(key, value) {
		if(arguments.length > 1) {
			this._scaleZoomX = +value;
		}
		return this._scaleZoomX || 1;
	}.property(),

	/**
		The zoom multiplier for the y scale
		@property scaleZoomY
		@type Number
		@default 1
	*/
	scaleZoomY: function(key, value) {
		if(arguments.length > 1) {
			this._scaleZoomY = +value;
		}
		return this._scaleZoomY || 1;
	}.property(),

	/**
		The offset, in pixels, for the x scale
		@property scaleOffsetX
		@type Number
		@default 0
	*/
	scaleOffsetX: function(key, value) {
		if(arguments.length > 1) {
			this._scaleOffsetX = +value;
		}
		return this._scaleOffsetX || 0;
	}.property(),

	/**
		The offset, in pixels, for the y scale
		@property scaleOffsetY
		@type Number
		@default 0
	*/
	scaleOffsetY: function(key, value) {
		if(arguments.length > 1) {
			this._scaleOffsetY = +value;
		}
		return this._scaleOffsetY || 0;
	}.property(),

	_getScaleSource: function(){
		var scaleSource = this.nearestWithProperty('isScaleSource');
		this.set('scaleSource', scaleSource);
	}.on('init'),
});