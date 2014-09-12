import Ember from 'ember';
import GraphPosition from '../../../../utils/nf/graph-position';
import { test } from 'ember-qunit';

module('utils/nf/graph-position');

test('exists', function(){
	ok(typeof GraphPosition === 'function');
});

test('setting x and y ', function(){
	var pos = GraphPosition.create({
		x: 100,
		y: 200,
		xScale: function(x) {
			return x + 1;
		},
		yScale: function(y) {
			return y + 2;
		},
	});

	equal(pos.get('graphX'), 101);
	equal(pos.get('graphY'), 202);
});

test('setting graphX and graphY', function(){
	var pos = GraphPosition.create({
		graphX: 100,
		graphY: 200,
		xScale: {
			invert: function(x) {
				return x + 1;
			},
		},
		yScale: {
			invert: function(y) {
				return y + 2;
			},
		},
	});

	equal(pos.get('x'), 101);
	equal(pos.get('y'), 202);
});

test('pageX and pageY', function(){
	var pos = GraphPosition.create({
		graphOffset: {
			left: 11,
			top: 22,
		},
		graphX: 33,
		graphY: 44,
		graphContentX: 55,
		graphContentY: 66,
	});

	equal(pos.get('pageX'), 11 + 33 + 55);
	equal(pos.get('pageY'), 22 + 44 + 66);
});