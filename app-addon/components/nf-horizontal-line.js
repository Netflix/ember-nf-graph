import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';
import HasGraphParent from '../mixins/graph-has-graph-parent';

export default Ember.Component.extend(HasGraphParent, {
	tagName: 'line',

	attributeBindings: ['lineY:y1', 'lineY:y2', 'x1', 'x2'],

	classNames: ['nf-horizontal-line'],

	y: null,

	lineY: property('y', 'graph.yScale', function(y, yScale) {
		return yScale ? yScale(y) : -1;
	}),

	x1: 0,

	x2: Ember.computed.alias('graph.graphWidth'),
});