import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';
import HasGraphParent from '../mixins/graph-has-graph-parent';

export default Ember.Component.extend(HasGraphParent, {
	tagName: 'line',

	classNames: ['nf-vertical-line'],

	attributeBindings: ['lineX:x1', 'lineX:x2', 'y1', 'y2'],

	y1: 0,

	y2: Ember.computed.alias('graph.graphHeight'),

	x: null,

	lineX: property('x', 'graph.xScale', function(x, xScale) {
		return xScale ? xScale(x) : -1;
	}),
});