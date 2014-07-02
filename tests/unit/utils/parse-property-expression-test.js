import parsePropExpr from '../../../utils/parse-property-expression';

module('utils:parse-property-expression');

test('should get simple property', function(){
	var obj = {
		foo: 'bar'
	};

	var getter = parsePropExpr('foo');

	equal(getter(obj), 'bar');
});


test('should get deep property', function(){
	var obj = {
		foo: {
			bar: 'baz'
		}
	};

	var getter = parsePropExpr('foo.bar');

	equal(getter(obj), 'baz');
});


test('should get array item', function(){
	var obj = [
		'foo',
		'bar',
		'baz'
	];

	var getter = parsePropExpr('[1]');

	equal(getter(obj), 'bar');
});

test('should get deep property\'s array item ', function(){
	var obj = {
		foo: [
			{ bar: 'baz' }
		]
	};

	var getter = parsePropExpr('foo[0].bar');

	equal(getter(obj), 'baz');
});

test('should handle multi dimensional arrays', function(){
	var obj = [
		['foo', 'bar'],
		['blah', 'baz']
	];

	var getter = parsePropExpr('[0][1]');

	equal(getter(obj), 'bar');
});