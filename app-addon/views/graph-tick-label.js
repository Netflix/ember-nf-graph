import Ember from 'ember';

export default Ember.View.extend({
	tagName: 'text',

	attributeBindings: ['x', 'y'],

	className: 'graph-tick-label'
});