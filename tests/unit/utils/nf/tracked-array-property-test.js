import Ember from 'ember';
import trackedArrayProperty from '../../../../utils/nf/tracked-array-property';
import { test } from 'ember-qunit';

module('utils/nf/tracked-array-property');

test('it keep the same references to the underlying array', function(){
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: null,

		arr1Key: 'id',

		trackedArr: trackedArrayProperty('arr1', 'arr1Key'),
	});

	var obj = MyClass.create({
		arr1: [foo, bar]
	});

	var original = obj.get('trackedArr');

	obj.set('arr1', [foo, bar, baz]);

	var after = obj.get('trackedArr');

	equal(original, after);
});


test('it should remove items that no longer exist in the source', function() {
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: null,

		arr1Key: 'id',
		
		trackedArr: trackedArrayProperty('arr1', 'arr1Key'),
	});

	var obj = MyClass.create({
		arr1: [foo, bar, baz]
	});

	obj.set('arr1', [foo, baz]);

	equal(obj.get('trackedArr')[0].id, 1);
	equal(obj.get('trackedArr')[1].id, 3);
});


test('it should not care what order anything is in', function() {
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: null,

		arr1Key: 'id',
		
		trackedArr: trackedArrayProperty('arr1', 'arr1Key'),
	});

	var obj = MyClass.create({
		arr1: [foo, bar, baz]
	});

	var ids = obj.get('trackedArr').map(function(d) {
		return d.id;
	}).join(',');

	obj.set('arr1', [foo, baz, bar]);

	var ids2 = obj.get('trackedArr').map(function(d) {
		return d.id;
	}).join(',');

	equal(ids2, ids);
});


test('it should update the properties it finds', function() {
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: null,

		arr1Key: 'id',
		
		trackedArr: trackedArrayProperty('arr1', 'arr1Key'),
	});

	var obj = MyClass.create({
		arr1: [foo, bar, baz]
	});

	var foo2 = { id: 1, name: 'foo2' };

	obj.set('arr1', [foo2, baz, bar]);

	equal(obj.get('trackedArr')[0].name, 'foo2');
});


test('it should add $$trackedKey to every record', function() {
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: null,

		arr1Key: 'id',
		
		trackedArr: trackedArrayProperty('arr1', 'arr1Key'),
	});

	var obj = MyClass.create({
		arr1: [foo, bar, baz]
	});

	var foo2 = { id: 1, name: 'foo2' };

	obj.set('arr1', [foo2, baz, bar]);

	var after = obj.get('trackedArr');
	console.log(after);
	equal(obj.get('trackedArr')[0].$$trackedKey, 1);
});


