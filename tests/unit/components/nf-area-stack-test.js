
/* globals d3 */
import NfArea from '../../../components/nf-area';
import NfGraph from '../../../components/nf-graph';

import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('nf-area-stack');

test('nf-area nextYData should update when data is pushed onto the next area\'s array', function(){
	var graph = NfGraph.create({
		yDomainMode: 'auto',
		xDomainMode: 'auto',
	});

	var areaStack = this.subject();

	var data1 = d3.range(10).map(function(n){
		return {
			x: n,
			y: n + 20
		};
	});

	var data2 = d3.range(10).map(function(n) {
		return {
			x: n,
			y: n + 10
		};
	});

	var area1 = NfArea.create({
		data: data1
	});

	var area2 = NfArea.create({
		data: data2
	});

	graph.registerGraphic(area1);
	graph.registerGraphic(area2);

	areaStack.registerArea(area1);
	areaStack.registerArea(area2);
	area1.set('graph', graph);
	area2.set('graph', graph);

	equal(areaStack.get('areas.length'), 2, 'areas should be the proper length');	
	equal(area1.get('nextArea'), area2, 'area1 should have nextArea of area2');

	equal(area1.get('sortedData').length, 10, 'area1.sortedData.length should be 10');
	equal(area2.get('sortedData').length, 10, 'area2.sortedData.length should be 10');

	equal(graph.get('xMin'), 0, 'graph xMin should be 0');
	equal(graph.get('xMax'), 9, 'graph xMax should be 10');

	equal(area1.get('renderedData').length, 10, 'area1.renderedData.length should be 10');
	equal(area2.get('renderedData').length, 10, 'area2.renderedData.length should be 10');

	equal(area1.get('nextYData')[0], 10, 'area1.nextYData[0] should be 10');
	equal(area2.get('nextYData')[0], 10, 'area2.nextYData[0] should be 10'); //graph.yMin

	area1.get('data').pushObject({
		x: 11,
		y: 31
	});

	equal(area1.get('nextYData.length'), 11);
	equal(area2.get('nextYData')[area2.get('nextYData.length') - 1], 10);
	equal(area1.get('nextYData')[area1.get('nextYData.length') - 1], 10);

	area2.get('data').pushObject({
		x: 11,
		y: 21
	});

	equal(area2.get('nextYData.length'), 11);
	equal(area1.get('nextYData')[area1.get('nextYData.length') - 1], 21);
});