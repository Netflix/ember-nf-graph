import Ember from 'ember';

var computedAlias = Ember.computed.alias;

export default Ember.View.extend({
	tagName: 'td',

	attributeBindings: ['colspan'],

	column: null,

	colspan: computedAlias('column.cell.colspan'),

	template: computedAlias('column.cell.template'),

	tableView: computedAlias('templateData.view'),

	tableComponent: computedAlias('tableView.controller'),
	
});