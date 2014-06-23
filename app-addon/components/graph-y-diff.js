import Ember from 'ember';
import HasGraphParent from 'ember-cli-ember-dvc/mixins/graph-has-graph-parent';

export default Ember.Component.extend(HasGraphParent, {
	tagName: 'g',
  // templateName: 'ember-cli-ember-dvc/components/graph-y-diff',

	classNameBindings: ['positive', 'negative', 'orientRight'],

	classNames: ['graph-y-diff'],

	a: null,
	b: null,
	textPadding: 5,
	transition: 500,

	diff: function(){
		return this.get('b') - this.get('a');
	}.property('a', 'b'),

	positive: function(){
		return this.get('diff') >= 0;
	}.property('diff'),

	negative: function(){
		return this.get('diff') < 0;
	}.property('diff'),

	x: Ember.computed.alias('graph.yAxis.x'),
	
	orientRight: function(){
		return this.get('graph.yAxis.orient') === 'right';
	}.property('graph.yAxis.orient'),

	y: function(){
		var yScale = this.get('graph.yScale');
		var a = this.get('a');
		var b = this.get('b');
		return Math.min(yScale(a), yScale(b));
	}.property('a', 'b', 'graph.yScale'),

	width: Ember.computed.alias('graph.yAxis.width'),

	height: function(){
		var yScale = this.get('graph.yScale');
		var a = this.get('a');
		var b = this.get('b');
		return Math.abs(yScale(b) - yScale(a));
	}.property('graph.yScale', 'diff'),

	textX: function(){
		if(this.get('orientRight')) {
			return this.get('x') + this.get('width') - this.get('textPadding');
		}
		return this.get('x') + this.get('textPadding');
	}.property('x', 'textPadding', 'orientRight'),

	textY: function(){
		return this.get('y') + this.get('height') - this.get('textPadding');
	}.property('y', 'height', 'textPadding'),

	isVisible: function(){
		var a = this.get('a');
		var b = this.get('b');
		return typeof a === 'number' && typeof b === 'number';
	}.property('a', 'b'),

	updateElements: function(){
		var rect = this.get('rect');
		var text = this.get('text');
		var transition = this.get('transition');

		rect.transition(transition).attr('x', this.get('x') || 0)
			.attr('y', this.get('y') || 0)
			.attr('width', this.get('width') || 0)
			.attr('height', this.get('height') || 0);

		text.transition(transition).attr('x', this.get('textX') || 0)
			.attr('y', this.get('textY') || 0);
	}.observes('x', 'y', 'width', 'height', 'textX', 'textY', 'transition'),

	didInsertElement: function(){
		var g = d3.select(this.$()[0]);
		var data = [0];
		var rect = g.selectAll('rect').data(data);
		var text = g.selectAll('text').data(data);
		this.set('rect', rect);
		this.set('text', text);
		this.updateElements();
	}

});