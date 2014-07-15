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
	contentPadding: 5,
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

	contentX: property('orientRight', 'width', 'contentPadding', function(orientRight, width, contentPadding) {
		return orientRight ? width - contentPadding : contentPadding;
	}),

	contentY: property('y', 'height', function(y, height){
		return y + (height / 2);
	}),

	isVisible: property('a', 'b', function(a, b){
		return typeof a === 'number' && typeof b === 'number';
	}),

	updateElements: observer('rect', 'content', 'transition', 'x', 'y', 'width', 'height', 'contentY', 'contentX',
		function(rect, content, transition, x, y, width, height, contentY, contentX){
			if(rect) {
				rect.transition(transition).attr('x', x || 0)
					.attr('y', y || 0)
					.attr('width', width || 0)
					.attr('height', height || 0);
			}

			if(content) {
				content.transition(transition).attr('transform', function() {
					return 'translate(%@ %@)'.fmt(contentX, contentY);
				});
			}
		}
	),

	_d3Setup: function(){
		var g = d3.select(this.$()[0]);
		var data = [0];
		var rect = g.selectAll('rect').data(data);
		var content = g.selectAll('g.nf-y-diff-content').data(data);
		this.set('rect', rect);
		this.set('content', content);
		this.updateElements();
	}.on('didInsertElement')

});