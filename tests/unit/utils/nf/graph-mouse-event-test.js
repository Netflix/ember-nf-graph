import Ember from 'ember';
import GraphMouseEvent from '../../../../utils/nf/graph-mouse-event';
import { test } from 'ember-qunit';

module('utils/nf/graph-mouse-event');

test('exists', function(){
	ok(typeof GraphMouseEvent === 'function');
});

test('_mousePoint should be calculated from originalEvent and graphContentElement', function(){
	//event.initMouseEvent(type, canBubble, cancelable, view,  detail, screenX, screenY, clientX, clientY,  ctrlKey, altKey, shiftKey, metaKey,  button, relatedTarget);
	var arg1, arg2;
	var mockGetMousePoint = function(a, b) {
		arg1 = a;
		arg2 = b;
		return {
			x: 1,
			y: 2,
		};
	};

	var originalEvent = 'originalEvent';
	var graphContentElement = 'graphContentElement';

	var pos = GraphMouseEvent.create({
		originalEvent: originalEvent,
		graphContentElement: graphContentElement,
		_getMousePoint: mockGetMousePoint,
	});

	var mousePoint = pos.get('_mousePoint');
	equal(arg1, graphContentElement);
	equal(arg2, originalEvent);
	deepEqual(mousePoint, { x: 1, y: 2 });
});

test('mouseX and mouseY should come from _mousePoint', function(){
	var subject = GraphMouseEvent.create({
		_mousePoint: {
			x: 3,
			y: 5,
		},
	});

	equal(subject.get('mouseX'), 3);
	equal(subject.get('mouseY'), 5);
});

test('mousePosition should be properly created', function(){
	var subject = GraphMouseEvent.create({
		mouseX: 4,
		mouseY: 5,
		graph: 'graphMock',
		source: 'sourceMock',
	});

	var mousePosition = subject.get('mousePosition');
	equal(mousePosition.get('graphX'), 4);
	equal(mousePosition.get('graphY'), 5);
	equal(mousePosition.get('graph'), 'graphMock');
	equal(mousePosition.get('source'), 'sourceMock');
});

test('nearestDataPoint should come from mouseX and source', function(){
	var subject = GraphMouseEvent.create({
		mouseX: 100,
		source: {
			getDataNearXRange: function(x) {
				return [11, 17];
			},
		},
	});

	var dataPoint = subject.get('nearestDataPoint');
	deepEqual(dataPoint, [11, 17]);
});

test('x, y and data should be derived from nearestDataPoint', function(){
	var dataPoint = [1, 2];
	dataPoint.data = 'weee';

	var subject = GraphMouseEvent.create({
		nearestDataPoint: dataPoint
	});

	equal(subject.get('x'), 1);
	equal(subject.get('y'), 2);
	equal(subject.get('data'), 'weee');
});

test('setting graph, source and originalEvent only', function() {
	var e = {};
	var graph = {};
	var source = {
		getDataNearXRange: function(xpos) {
			var result = [1, 2];
			result.data = { foo: 'bar' };
			return result;
		}
	};

	var mockGetMousePoint = function(container, e) {
		return {
			x: 11,
			y: 13,
		};
	};

	var identity = function(x) { return x; };

	var subject = GraphMouseEvent.create({
		originalEvent: e,
		_getMousePoint: mockGetMousePoint,
		graph: graph,
		source: source,
		graphOffset: {
			left: 23,
			top: 31,
		},
		graphContentX: 71,
		graphContentY: 61,
		xScale: identity,
		yScale: identity,
	});

	equal(subject.get('mouseX'), 11);
	equal(subject.get('mouseY'), 13);
	equal(subject.get('graphX'), 1, 'graphX');
	equal(subject.get('graphY'), 2, 'graphY');
	equal(subject.get('pageX'), 1 + 23 + 71, 'pageX');
	equal(subject.get('pageY'), 2 + 31 + 61, 'pageY');
	equal(subject.get('x'), 1, 'x');
	equal(subject.get('y'), 2, 'y');
	deepEqual(subject.get('data'), { foo: 'bar' });
});