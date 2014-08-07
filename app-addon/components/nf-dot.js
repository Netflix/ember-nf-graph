import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import { property } from '../utils/computed-property-helpers';

export default Ember.Component.extend(HasGraphParent, {
	tagName: 'circle',

	attributeBindings: ['r', 'cy', 'cx'],

	x: null,
	
	y: null,
	
	r: 2.5,

	cx: property('x', 'graph.xScale', function(x, xScale) {
		return !isNaN(x) && xScale ? xScale(x) : -1;
	}),

	cy: property('y', 'graph.yScale', function(y, yScale) {
		return !isNaN(y) && yScale ? yScale(y) : -1;
	}),

	isVisible: property('x', 'y', function(x, y) {
		return !(isNaN(x) || isNaN(y));
	}),
});