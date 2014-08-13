
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

	var area1;
	var area2;

	Ember.run(function(){
		area1 = NfArea.create({
			data: data1
		});

		area2 = NfArea.create({
			data: data2
		});

		
		graph.registerGraphic(area1);
		graph.registerGraphic(area2);

		areaStack.registerArea(area1);
		areaStack.registerArea(area2);
		
		area1.set('graph', graph);
		area2.set('graph', graph);
	});

	equal(areaStack.get('areas.length'), 2, 'areas should be the proper length');	
	equal(area1.get('nextArea'), area2, 'area1 should have nextArea of area2');
	equal(area2.get('prevArea'), area1, 'area2 should have prevArea of area1');
	equal(area1.get('nextYData.length'), area2.get('renderedData.length'), 'area1.nextYData length same as area2.renderedData.length');

	Ember.run(function(){
		area2.get('data').pushObject({
			x: 222,
			y: 333,
		});
	});

	equal(area1.get('nextYData.length'), area2.get('renderedData.length'), 'area1.nextYData STILL length same as area2.renderedData.length');
});