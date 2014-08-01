import NfGraph from '../../../components/nf-graph';
import NfYDiff from '../../../components/nf-y-diff';

import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('nf-y-diff');

test('nf-y-diff y positioning', function(){
	Ember.d3.Transition.testMode(true);

	var graph = Ember.Object.create({
		yScale: function(x) { return x; },
	});

	var ydiff = NfYDiff.create({
		graph: graph,
		a: 100,
		b: 300
	});

	setTimeout(function() {
		equal(ydiff.get('y'), 100, 'y should be 100');
		equal(ydiff.get('contentY'), 100, 'contentY should be 100');
		equal(ydiff.get('height'), 200, 'height should be 200');
		Ember.d3.Transition.testMode(false);
	}, 0);
});

test('x content positioning when yAxis orient left', function(){
	var graph = NfGraph.create({
		yAxis: { orient: 'left', width: 60 },
	});

	var ydiff = NfYDiff.create({
		graph: graph,
		contentPadding: 5,
	});

	equal(ydiff.get('contentX'), 5);
});

test('x content positioning when yAxis orient right', function(){
	var graph = NfGraph.create({
		yAxis: { orient: 'right', width: 60 },
	});

	var ydiff = NfYDiff.create({
		graph: graph,
		contentPadding: 5,
	});

	equal(ydiff.get('contentX'), 55);
});

test('negative diff', function(){
	var ydiff = this.subject({
		a: 2,
		b: 1
	});

	equal(ydiff.get('diff'), -1);
	equal(ydiff.get('isPositive'), false);
});

test('positive diff', function(){
	var ydiff = this.subject({
		a: 1,
		b: 2
	});

	equal(ydiff.get('diff'), 1);
	equal(ydiff.get('isPositive'), true);
});