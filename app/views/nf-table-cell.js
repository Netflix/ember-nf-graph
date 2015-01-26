import Ember from 'ember';

var computedAlias = Ember.computed.alias;

export default Ember.View.extend({
	tagName: 'td',

	attributeBindings: ['colspan', 'style'],

	column: null,

	colspan: computedAlias('column.cell.colspan'),

	template: computedAlias('column.cell.template'),

	tableView: computedAlias('templateData.view'),

	tableComponent: computedAlias('tableView.controller'),

	style: function(){
		var width = this.get('column.width');

		if(typeof width === 'undefined' || width === null) {
			return '';
		}

		return 'width:' + width;
	}.property('column.width'),
	
});