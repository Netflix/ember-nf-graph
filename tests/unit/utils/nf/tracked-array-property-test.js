import Ember from 'ember';
import trackedArrayProperty from '../../../../utils/nf/tracked-array-property';
import { test } from 'ember-qunit';

module('utils/nf/tracked-array-property');

test('it keep the same references to everything', function(){
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: null,

		trackedArr: trackedArrayProperty('arr1', 'id'),
	});

	var obj = MyClass.create({
		arr1: [foo, bar]
	});

	var original = obj.get('trackedArr');

	obj.set('arr1', [foo, bar, baz]);

	var after = obj.get('trackedArr');


	equal(original, after);
	equal(obj.get('trackedArr')[0], foo);
	equal(obj.get('trackedArr')[1], bar);
	equal(obj.get('trackedArr')[2], baz);
});


test('it should remove items that no longer exist in the source', function() {
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: null,

		trackedArr: trackedArrayProperty('arr1', 'id'),
	});

	var obj = MyClass.create({
		arr1: [foo, bar, baz]
	});

	var original = obj.get('trackedArr');

	obj.set('arr1', [foo, baz]);

	var after = obj.get('trackedArr');


	equal(original, after);
	equal(obj.get('trackedArr')[0], foo);
	equal(obj.get('trackedArr')[1], baz);
});


test('it should not give a crap what order anything is in', function() {
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: null,

		trackedArr: trackedArrayProperty('arr1', 'id'),
	});

	var obj = MyClass.create({
		arr1: [foo, bar, baz]
	});

	var original = obj.get('trackedArr');

	obj.set('arr1', [foo, baz, bar]);

	var after = obj.get('trackedArr');


	equal(original, after);
	equal(obj.get('trackedArr')[0], foo);
	equal(obj.get('trackedArr')[1], bar);
	equal(obj.get('trackedArr')[2], baz);
});


test('it should update the properties it finds', function() {
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: null,

		trackedArr: trackedArrayProperty('arr1', 'id'),
	});

	var obj = MyClass.create({
		arr1: [foo, bar, baz]
	});

	var original = obj.get('trackedArr');

	var foo2 = { id: 1, name: 'foo2' };

	obj.set('arr1', [foo2, baz, bar]);

	var after = obj.get('trackedArr');


	equal(original, after);
	equal(obj.get('trackedArr')[0].name, 'foo2');
});


