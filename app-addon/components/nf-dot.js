import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import { property } from '../utils/computed-property-helpers';

export default Ember.Component.extend(HasGraphParent, {
	tagName: 'circle',

	attributeBindings: ['r', 'cy', 'cx'],

	x: -1,
	
	y: -1,
	
	r: 2.5,

	cx: property('x', 'graph.xScale', function(x, xScale) {
		return xScale ? xScale(x) : -1;
	}),

	cy: property('y', 'graph.yScale', function(y, yScale) {
		return yScale ? yScale(y) : -1;
	}),

	isVisible: property('cx', 'cy', function(cx, cy) {
		return cx !== -1 && cy !== -1;
	}),
});