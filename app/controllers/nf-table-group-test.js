import Ember from 'ember';

export default Ember.ArrayController.extend({
	blah: function(){
		var model = this.get('model');
		if(Array.isArray(model) && model.length > 0) {
			return model[0].blah;
		}
	}.property('model.@each'),

	fooSum: function(){
		return this.get('model').reduce(function(sum, item) {
			sum += item.foo || 0;
			return sum;
		}, 0);
	}.property('model.@each.foo'),

	fooAvg: function(){
		return this.get('fooSum') / this.get('model.length');
	}.property('model.length', 'fooSum'),

	fooMean: function(){
		var model = this.get('model');
		var foos = model.map(function(x) { return x.foo; });
		foos.sort(function(a, b) {
			return a === b ? 0 : (a > b ? 1 : -1);
		});
		var half = Math.round((model.length - 1) / 2);
		return foos[half];
	}.property('model.@each.foo'),
});