import Ember from 'ember';

var computedAlias = Ember.computed.alias;

export default Ember.View.extend({
	tagName: 'th',

	column: null,

	classNameBindings: ['column.sortClass'],

	attributeBindings: ['colspan', 'style'],

	colspan: computedAlias('column.header.colspan'),

	template: computedAlias('column.header.template'),

	tableView: computedAlias('templateData.view'),

	tableComponent: computedAlias('tableView.controller'),

	_sendSort: function(){
		var component = this.get('tableComponent');
		if(component) {
			component.send('sort', this.get('column'));
		}
	}.on('click'),

	style: function(){
		var width = this.get('column.width');

		if(typeof width === 'undefined' || width === null) {
			return '';
		}

		return 'width:' + width;
	}.property('column.width'),
});