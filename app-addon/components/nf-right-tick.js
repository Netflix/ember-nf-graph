import Ember from 'ember';
import { property, observer } from '../utils/computed-property-helpers';

export default Ember.Component.extend({
	tagName: 'g',
	
	transition: 500,

	value: null,

	classNames: ['nf-right-tick'],

	isVisible: property('value', function(value){
		return value !== null && !isNaN(value);
	}),

	y: property('value', 'graph.yScale', 'graph.paddingTop', 'isVisible', function(value, yScale, paddingTop, isVisible){
		if(!isVisible) {
			return 0;
		}
		return (yScale(value) + paddingTop) || 0;
	}),

	transform: property('y', 'graph.width', function(y, graphWidth){
		return 'translate(%@ %@)'.fmt(graphWidth - 6, y - 3);
	}),

	_setup: function(){
		var graph = this.nearestWithProperty('isGraph');
		this.set('graph', graph);
	}.on('init'),

	updateElement: observer('path', 'transition', 'transform', function(path, transition, transform){
		path.transition(transition).attr('transform', transform);
	}),

	getElement: function(){
		var g = d3.select(this.$()[0]);
		var path = g.selectAll('path').data([0]);
		this.set('path', path);
		this.updateElement();
	}.on('didInsertElement')
});