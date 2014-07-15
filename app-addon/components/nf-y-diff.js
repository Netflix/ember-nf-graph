import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import { property, observer } from '../utils/computed-property-helpers';

export default Ember.Component.extend(HasGraphParent, {
	tagName: 'g',
  // templateName: 'ember-cli-ember-dvc/components/graph-y-diff',

	classNameBindings: ['positive', 'negative', 'orientRight'],

	classNames: ['nf-y-diff'],

	a: null,
	b: null,
	textPadding: 5,
	transition: 500,

	diff: property('a', 'b', function(a, b){
		return b - a;
	}),

	positive: Ember.computed.gte('diff', 0),

	negative: Ember.computed.lt('diff', 0),

	x: Ember.computed.alias('graph.yAxis.x'),
	
	orientRight: function(){
		return this.get('graph.yAxis.orient') === 'right';
	}.property('graph.yAxis.orient'),

	y: property('a', 'b', 'graph.yScale', 'graph.graphY', function(a, b, yScale, graphY){
		return Math.min(yScale(a), yScale(b)) + graphY;
	}),

	width: Ember.computed.alias('graph.yAxis.width'),

	height: property('graph.yScale', 'a', 'b', function(yScale, a, b) {
		return Math.abs(yScale(b) - yScale(a));
	}),

	parentController: Ember.computed.alias('templateData.view.controller'),

	textX: property('orientRight', 'x', 'width', 'textPadding', function(orientRight, x, width, textPadding) {
		if(orientRight) {
			return x + width - textPadding;
		}
		return x + textPadding;
	}),

	textY: property('y', 'height', 'textPadding', function(y, height, textPadding){
		return y + height - textPadding;
	}),

	isVisible: property('a', 'b', function(a, b){
		return typeof a === 'number' && typeof b === 'number';
	}),

	updateElements: observer('rect', 'text', 'transition', 'x', 'y', 'width', 'height', 'textX', 'textY',
		function(rect, text, transition, x, y, width, height, textX, textY){
			if(rect) {
				rect.transition(transition).attr('x', x || 0)
					.attr('y', y || 0)
					.attr('width', width || 0)
					.attr('height', height || 0);
			}

			if(text) {
				text.transition(transition).attr('x', textX || 0)
					.attr('y', textY || 0);
			}
		}
	),

	_d3Setup: function(){
		var g = d3.select(this.$()[0]);
		var data = [0];
		var rect = g.selectAll('rect').data(data);
		var text = g.selectAll('text').data(data);
		this.set('rect', rect);
		this.set('text', text);
		this.updateElements();
	}.on('didInsertElement')

});