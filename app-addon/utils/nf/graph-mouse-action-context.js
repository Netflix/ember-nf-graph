import Ember from 'ember';
import { getMousePoint } from './svg-dom';
import { property } from '../computed-property-helpers';

export default Ember.Object.extend({
	originalEvent: null,

	container: null,

	graph: null,

	mousePoint: property('container.element', 'originalEvent', function(containerElement, e) {
		if(containerElement && e) {
			return getMousePoint(containerElement, e);
		}
	}),

	mouseX: Ember.computed.alias('mousePoint.x'),

	mouseY: Ember.computed.alias('mousePoint.y'),

	x: property('xScale', 'mouseX', function(scale, mouse) {
		return scale && scale.invert ? scale.invert(mouse) : NaN;
	}),

	y: property('yScale', 'mouseY', function(scale, mouse) {
		return scale && scale.invert ? scale.invert(mouse) : NaN;
	}),

	xScale: Ember.computed.alias('container.xScale'),
});