import Ember from 'ember';

var computedAlias = Ember.computed.alias;

export default Ember.View.extend({
	tagName: 'th',

	classNameBindings: ['column.sortClass'],

	attributeBindings: ['colspan'],

	colspan: computedAlias('column.header.colspan'),

	column: null,

	tableView: computedAlias('templateData.view'),

	tableComponent: computedAlias('tableView.controller'),

	controller: computedAlias('tableComponent.templateData.view.controller'),

	template: computedAlias('column.header.template'),

	_sendSort: function(){
		var component = this.get('tableComponent');
		if(component) {
			component.send('sort', this.get('column'));
		}
	}.on('click'),
});