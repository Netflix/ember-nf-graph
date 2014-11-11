import NfGraph from '../../../components/nf-graph';
import NfYDiff from '../../../components/nf-y-diff';

import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('nf-y-diff');

test('nf-y-diff y positioning', function(){
	var graph, yDiff;

	Ember.run(function(){
		yDiff = NfYDiff.create({
			a: 100,
			b: 200,
			yScale: function(x) {
				return x;
			}
		});
	});

	equal(yDiff.get('yA'), 100);
});

test('x content positioning when yAxis orient left', function() {
	var graph, yDiff;

	Ember.run(function(){
		graph = NfGraph.create({
			xScale: function(x) {
				return x;
			},
			yAxis: {
				orient: 'left',
				width: 60,
			},
		});

		yDiff = NfYDiff.create({
			contentPadding: 5,
		});

		yDiff.set('graph', graph);
	});

	equal(yDiff.get('contentX'), 5, 'should be the same as contentPadding');
});

test('x content positioning when yAxis orient right', function() {
	var graph, yDiff;

	Ember.run(function(){
		graph = NfGraph.create({
			xScale: function(x) {
				return x;
			},
			yAxis: {
				orient: 'right',
				width: 60,
			},
		});

		yDiff = NfYDiff.create({
			contentPadding: 5,
		});

		yDiff.set('graph', graph);
	});

	equal(yDiff.get('contentX'), 60 - 5, 'should be the same as width - contentPadding');
});

test('negative diff', function(){
	var yDiff;

	Ember.run(function(){
		yDiff = NfYDiff.create({
			a: 2,
			b: 1
		});
	});

	equal(yDiff.get('diff'), -1);
	equal(yDiff.get('isPositive'), false);
});

test('positive diff', function(){
	var yDiff;

	Ember.run(function(){
		yDiff = NfYDiff.create({
			a: 1,
			b: 2
		});
	});

	equal(yDiff.get('diff'), 1);
	equal(yDiff.get('isPositive'), true);
});