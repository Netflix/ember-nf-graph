import NfTable from '../../../components/nf-table';

import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('nf-table');

test('trackedRows property test single', function(){
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var table = this.subject();

	table.set('rows', [foo, bar, baz]);

	deepEqual(table.get('trackedRows'), [foo, bar, baz]);
});


test('trackedRows property test two tables', function(){
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var tableA = NfTable.create({});
	var tableB = NfTable.create({});

	tableA.set('rows', [foo]);

	tableB.set('trackBy', 'name');
	tableB.set('rows', [bar, baz]);

	deepEqual(tableA.get('trackedRows'), [foo]);
	deepEqual(tableB.get('trackedRows'), [bar, baz]);
});