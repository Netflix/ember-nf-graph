import multiSort from '../../../utils/multi-sort';

function createData(){ 
	return [
		{ id: 1, str: 'bbb', num: 200 },
		{ id: 2, str: 'aaa', num: 100 },
		{ id: 3, str: 'zzz', num: 100 },
		{ id: 4, str: 'bbb', num: 300 },
		{ id: 5, str: 'zzz', num: 600 },
	];
}

module('utils:multi-sort');

test("multiSort should handle strings", function(){
	var data = createData();

	multiSort(data, ['str', 'num']);

	deepEqual(data,[
		{ id: 2, str: 'aaa', num: 100 },
		{ id: 1, str: 'bbb', num: 200 },
		{ id: 4, str: 'bbb', num: 300 },
		{ id: 3, str: 'zzz', num: 100 },
		{ id: 5, str: 'zzz', num: 600 },
	]);
});

test("multiSort should handle objects", function(){
	var data = createData();

	multiSort(data, [{ by: 'str', direction: 1 }, { by: 'num', direction: -1 }]);

	deepEqual(data,[
		{ id: 2, str: 'aaa', num: 100 },
		{ id: 4, str: 'bbb', num: 300 },
		{ id: 1, str: 'bbb', num: 200 },
		{ id: 5, str: 'zzz', num: 600 },
		{ id: 3, str: 'zzz', num: 100 },
	]);
});


test("multiSort should handle functions", function(){
	var data = createData();

	multiSort(data, [function(a, b) {
		return a.str === b.str ? 0 : (a.str > b.str) ? 1 : -1;
	}, function(a, b) {
		return b.num - a.num;
	}]);

	deepEqual(data,[
		{ id: 2, str: 'aaa', num: 100 },
		{ id: 4, str: 'bbb', num: 300 },
		{ id: 1, str: 'bbb', num: 200 },
		{ id: 5, str: 'zzz', num: 600 },
		{ id: 3, str: 'zzz', num: 100 },
	]);
});

test('multiSort should work with expressions', function(){
	var data = [
		{ foo: { bar: [1, 9]}, blah: { baz: [2, 4]} },
		{ foo: { bar: [1, 5]}, blah: { baz: [2, 4]} },
		{ foo: { bar: [1, 5]}, blah: { baz: [2, 1]} },
	];

	multiSort(data, ['foo.bar[1]', 'blah.baz[1]']);

	deepEqual(data, [
		{ foo: { bar: [1, 5]}, blah: { baz: [2, 1]} },
		{ foo: { bar: [1, 5]}, blah: { baz: [2, 4]} },
		{ foo: { bar: [1, 9]}, blah: { baz: [2, 4]} },
	]);
});