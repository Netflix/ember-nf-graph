import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';

export default Ember.Component.extend({
	tagName: 'g',

	type: 'nf-inline-bar',

	value: null,

	x: property(function(){

	}),

	_register: function(){
		var inlineGraph = this.nearestWithProperty('isInlineGraph');
		inlineGraph.registerItem(this);
		this.set('inlineGraph', inlineGraph);
	}.on('init'),
});