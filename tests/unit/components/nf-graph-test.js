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

test('xDomainMode auto should update xMin and xMax as graphic data changes', function(){
	var graph = this.subject({
		xDomainMode: 'auto'
	});

	var graphic = Ember.Object.create({
		sortedData: [[-12,0],[2,0],[30,0]]
	});

	var graphic2 = Ember.Object.create({
		sortedData: [[-2,0],[2,0],[130,0]]
	});

	graph.registerGraphic(graphic);
	graph.registerGraphic(graphic2);

	equal(graph.get('xMin'), -12);
	equal(graph.get('xMax'), 130);
});

test('yDomainMode auto should update yMin and yMax as graphic data changes', function(){
	var graph = this.subject({
		yDomainMode: 'auto'
	});

	var graphic = Ember.Object.create({
		sortedData: [[0,222],[0,333],[0,888]]
	});

	var graphic2 = Ember.Object.create({
		sortedData: [[0,-444],[0,111],[0,222]]
	});

	graph.registerGraphic(graphic);
	graph.registerGraphic(graphic2);

	equal(graph.get('yMin'), -444);
	equal(graph.get('yMax'), 888);
});

test('xDomainMode fixed should not update xMin and xMax as graphic data changes', function(){
	var graph = this.subject({
		xDomainMode: 'fixed',
		xMin: 100,
		xMax: 1000,
	});

	var graphic = Ember.Object.create({
		sortedData: [[-12,0],[2,0],[30,0]]
	});

	var graphic2 = Ember.Object.create({
		sortedData: [[-2,0],[2,0],[1300,0]]
	});

	graph.registerGraphic(graphic);
	graph.registerGraphic(graphic2);

	equal(graph.get('xMin'), 100);
	equal(graph.get('xMax'), 1000);
});

test('yDomainMode fixed should not update yMin and yMax as graphic data changes', function(){
	var graph = this.subject({
		yDomainMode: 'fixed',
		yMin: 100,
		yMax: 101
	});

	var graphic = Ember.Object.create({
		sortedData: [[0,222],[0,333],[0,888]]
	});

	var graphic2 = Ember.Object.create({
		sortedData: [[0,-444],[0,111],[0,222]]
	});

	graph.registerGraphic(graphic);
	graph.registerGraphic(graphic2);

	equal(graph.get('yMin'), 100);
	equal(graph.get('yMax'), 101);
});

test('yDomainMode should default to "auto"', function(){
	var graph = this.subject();
	equal(graph.get('yDomainMode'), 'auto');
});

test('xDomainMode should default to "auto"', function(){
	var graph = this.subject();
	equal(graph.get('xDomainMode'), 'auto');
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