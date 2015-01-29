import Ember from 'ember';
import multiSort from 'ember-cli-ember-dvc/utils/multi-sort';
import { naturalCompare } from 'ember-cli-ember-dvc/utils/nf/array-helpers';

var get = Ember.get;
var set = Ember.set;

export default Ember.Mixin.create({
	
	sortFn: function() {
		return multiSort(this.get('sortMap'));
	}.property('sortMap.[]'),

	/**
		Gets the an array of sorts, in order to be processed when sorting the rows.
		@property sortMap
		@readonly
		@private
	*/
	sortMap: function(){
		return this.get('_columns').reduce(function(sortMap, col) {
			var direction = col.get('direction');
			if(direction) {
				var sortBy = col.get('sortBy');
				if(sortBy) {
					sortBy = sortBy.replace(/^row\./, '');

					if(col.get('sortNatural')) {
						sortMap.push(function(a, b){
							var ax = Ember.get(a, sortBy);
							var bx = Ember.get(b, sortBy);
							return naturalCompare(ax, bx) * direction;
						});
					} else {
						sortMap.push({
							by: sortBy,
							direction: direction,
						});
					}
				}
			}
			return sortMap;
		}, []);
	}.property('_columns.@each.sortDirection', '_columns.@each.sortBy'),

	_getArrayController: function(content, ctrlName, itemControllerProp) {
		var CtrlClass = this.container.lookupFactory('controller:' + ctrlName);
		var ctrl = CtrlClass.create({
			content: content,
			table: this
		});
		if(this.get(itemControllerProp)) {
			ctrl.set('itemController', this.get(itemControllerProp));
		}
		return ctrl;
	},

	getGroups: function() {
		var rows = this.get('rows');
		var itemController = this.get('itemController');
		var groupBy = this.get('groupBy');
		var groupFrom = this.get('groupFrom');
		var trackBy = this.get('trackBy');
		var sortFn = this.get('sortFn');

		Ember.run(this, function(){
			if(!this._groups) {
				var groupItemController = this.get('groupItemController');
				this._groups = this._getArrayController([], 'nf-table-group-controller', groupItemController);
				this._groups.set('sortProperties', ['groupKey']);
			}

			var sortChanged = this._groups.get('sortFn') !== sortFn;
			if(sortChanged) {
				this._groups.get('content').clear();
				this._groups.set('sortFn', sortFn);
			}

			if(Ember.isArray(rows)) {
				var trackedKeys = new Map();
				var groupKeys = new Map();
				var groupsContent = this._groups.get('content');

				// if the rows data provided is hierarchical, flatten it.
				if(groupFrom === 'hierarchy') {
					var flattened = rows.reduce([], function(flat, outer, g) {
						var inner = get(outer, groupBy);
						if(Ember.isArray(inner)) {
							inner.forEach(function (row) {
								set(row, '__groupKey', g);
								flat.pushObject(row);
							});
						}
						return flat;
					});

					rows = flattened;
					groupBy = '__groupKey';
				}

				var getTrackingKey = function (row, index) {
					return trackBy ? get(row, trackBy) : index;
				};

				// group and reconcile rows and groups
				rows.forEach(function (row, ri) {
					var groupKey = groupBy ? get(row, groupBy) : 'ungrouped';
					var trackingKey = getTrackingKey(row, ri);
					trackedKeys[trackingKey] = true;
					groupKeys[groupKey] = true;

					// if there's already a rows controller, add to it.
					var rowsController = groupsContent.find(function(rc) { return rc.get('groupKey') === groupKey; });
					if(!rowsController) {
						rowsController = this._getArrayController([], 'nf-table-rows-controller', itemController);
						rowsController.set('groupKey', groupKey);
						rowsController.set('customSort', sortFn);
						groupsContent.pushObject(rowsController);
					}

					var rowsContent = rowsController.get('content');

					var foundRow = rowsContent.find(function(r, i) { return trackingKey === getTrackingKey(r, i); });
					if(foundRow) {
						// if there's already a row with a matching tracking key (found with trackBy) update it.
						Ember.keys(row).forEach(function(key) {
							var val = get(row, key);
							if(get(foundRow, key) !== val) {
								set(foundRow, key, val);
							}
						});
					} else {
						// otherwise add this one.
						rowsContent.pushObject(row);
					}
				}, this);

				// remove groups and rows that were not provided
				groupsContent.forEach(function(rowsController) {
					// if nothing was grouped by a particular group key, 
					// remove it's rowsController
					if(!groupKeys[rowsController.get('groupKey')]) {
						groupsContent.remove(rowsController);
						rowsController.destroy();
					} else {
						var rowsContent = rowsController.get('content');
						rowsContent.forEach(function (r, i) {
							// if nothing was tracked by a row's tracking key
							// remove the row from the row controller
							if(!trackedKeys[getTrackingKey(r, i)]) {
								rowsContent.removeObject(r);
							}
						}, this);
					}
				}, this);
			}
		});
		return this._groups;
	}

});