import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('nf-graph');

test('graphic registration register and unregister', function(){
	var graph = this.subject();
	var graphic = Ember.Object.create();

	graph.registerGraphic(graphic);

	equal(graph.get('graphics')[0], graphic);

	graph.unregisterGraphic(graphic);

	equal(graph.get('graphics.length'), 0);
});

test('graph xMinMode auto', function() {
	var graph = this.subject({
		xMinMode: 'auto',
		xMin: 100,
	});

	graph.set('xDataExtent', [-50, 200]);

	equal(graph.get('xMin'), -50);
});

test('graphY should change as xAxis.orient changes', function(){
	var graph = this.subject({
		paddingTop: 100,
		xAxis: {
			orient: 'top',
			height: 200
		}
	});

	var graphY = graph.get('graphY');
	equal(graphY, 300);

	graph.set('xAxis.orient', 'bottom');
	graphY = graph.get('graphY');
	equal(graphY, 100);
});

test('graphX should change as yAxis.orient changes', function(){
	var graph = this.subject({
		paddingLeft: 100,
		yAxis: {
			width: 50,
			orient: 'right'
		}
	});

	var graphX = graph.get('graphX');
	equal(graphX, 100);

	graph.set('yAxis.orient', 'left');
	graphX = graph.get('graphX');
	equal(graphX, 150);
});

test('graphWidth calculation', function(){
	var graph = this.subject({
		paddingLeft: 1,
		paddingRight: 2,
		width: 100,
		yAxis: {
			width: 3
		}
	});

	equal(graph.get('graphWidth'), 100 - 3 - 2 - 1);
});

test('graphHeight calculation', function(){
	var graph = this.subject({
		paddingTop: 1,
		paddingBottom: 2,
		height: 100,
		xAxis: {
			height: 3
		}
	});

	equal(graph.get('graphHeight'), 100 - 3 - 2 - 1);
});

test('hasRendered updates on willInsertElement', function(){
	var graph = this.subject();
	equal(graph.get('hasRendered'), false);

	Ember.sendEvent(graph, 'willInsertElement');
	equal(graph.get('hasRendered'), true);
});