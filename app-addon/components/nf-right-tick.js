import Ember from 'ember';
import { property, observer } from '../utils/computed-property-helpers';

/**
 * Draws a line and a chevron at the specified domain value 
 * on the right side of an `nf-graph`. 
 * 
 * ### Tips
 * 
 * - Position outside of `nf-graph-content` component, but inside `nf-graph`.
 * - Adding `paddingRight` to `nf-graph` component will not affect `nf-right-tick`'s position.
 * 
 * @namespace components
 * @class nf-right-tick
 */
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