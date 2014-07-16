import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';
import parsePropertyExpr from '../utils/parse-property-expression';

export default Ember.Component.extend({
	tagName: 'rect',

	classNames: ['nf-inline-bar', 'nf-inline-graphic'],

	yprop: 'y',

	getYProp: property('yprop', function(yprop) {
		return parsePropertyExpr(yprop);
	}),

	dataValue: property('getYProp', 'data', function(getYProp, data) {
		return getYProp(data);
	}),

	_register: function(){
		var graph = this.nearestWithProperty('isInlineGraph');
		graph.registerGraphic(this);
		this.set('graph', graph);
	}.on('init'),

	_unregister: function(){
		this.get('graph').unregisterGraphic(this);
	}.on('willDestroyElement')
});