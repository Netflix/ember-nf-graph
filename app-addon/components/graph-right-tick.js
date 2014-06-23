import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'g',
  templateName: 'ember-cli-ember-dvc/components/graph-right-tick',
	
	transition: 500,

	value: null,

	classNames: ['graph-right-tick'],

	isVisible: function(){
		var value = this.get('value');
		return value !== null && !isNaN(value);
	}.property('value'),

	y: function(){
		var yScale = this.get('graph.yScale');
		var value = this.get('value');
		if(!this.get('isVisible')) {
			return 0;
		}
		return yScale(value);
	}.property('value', 'graph.yScale'),

	transform: function(){
		var y = this.get('y') || 0;
		var graphWidth = this.get('graph.width');
		return 'translate(%@ %@)'.fmt(graphWidth - 6, y - 3);
	}.property('graph.width', 'y'),

	_setup: function(){
		var graph = this.nearestWithProperty('isGraph');
		this.set('graph', graph);
	}.on('init'),

	updateElement: function(){
		var path = this.get('path');
		var transition = this.get('transition');
		var transform = this.get('transform');
		path.transition(transition)
			.attr('transform', transform);
	}.observes('transform'),

	getElement: function(){
		var g = d3.select(this.$()[0]);
		var path = g.selectAll('path').data([0]);
		this.set('path', path);
		this.updateElement();
	}.on('didInsertElement')
});