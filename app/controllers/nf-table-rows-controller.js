import Ember from 'ember';

export default Ember.ArrayController.extend({
	//HACK: override isSorted from the Ember Sortable Mixin
	// to prevent it from doing the Ember sort, we'll do it ourselves.
	isSorted: false,

	customSort: null,

	_performSort: function() {
		var content = this.get('content');
		if(Ember.isArray(content)) {
			var customSort = this.get('customSort');
			if(customSort) {
				content.sort(customSort);
			}
		}
		this.set('_arrangedContent', content);
	},

	arrangedContent: function(){
		return this.get('_arrangedContent');
	}.property('_arrangedContent'),

	_contentOrSortChanged: function() {
		Ember.run.once(this, this._performSort);
	}.observes('content', 'customSort').on('init'),

	actions: {
		rowClick: function(row, group){
			var table = this.get('table');
			if(table) {
				table.sendAction('rowAction', row, group, table);
			}
		},
	}
});