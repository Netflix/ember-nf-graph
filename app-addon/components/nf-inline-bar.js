import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';
import parsePropertyExpr from '../utils/parse-property-expression';

var computedAlias = Ember.computed.alias;

export default Ember.Component.extend({
	tagName: 'rect',

	attributeBindings: ['x', 'y', 'width', 'height', 'dataValue'],

	classNames: ['nf-inline-bar'],
	
	width: 0,

	height: 0,

	x: 0,

	y: 0,

	yprop: 'y',

	data: null,

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