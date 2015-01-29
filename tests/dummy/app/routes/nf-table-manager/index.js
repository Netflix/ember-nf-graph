import Ember from 'ember';

export default Ember.Route.extend({
	getHierarchicalRows: function(){
		var myData = [];
		var p, c, parent;

		for(p = 0; p < 4; p++) {
			parent = {
				name: 'parent ' + p,
				children: []
			};
			for(c = 0; c < 5; c++) {
				parent.children.push({
					id: c+1,
					foo: Math.random() * 100,
					bar: 'Bar ' + c,
					blah: 'Blah' + (c % 2),
				});
			}
			myData.push(parent);
		}

		return myData;
	},

	getFlatRows: function(){
		var myData = [];
		var i;

		for(i = 0; i < 20; i++) {
			myData.push({
				id: i+1,
				foo: Math.random() * 100,
				bar: 'Bar ' + i,
				blah: 'Blah' + (i % 2),
			});
		}

		return myData;
	},

	model: function(){
		return {
			myData: this.getFlatRows()
		};
	}

});