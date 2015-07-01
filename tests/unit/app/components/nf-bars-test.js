import Ember from 'ember';

import {
  moduleForComponent,
  test
} from 'ember-qunit';

import { getRectPath } from 'ember-nf-graph/utils/nf/svg-dom';

moduleForComponent('nf-bars', {
  // specify the other units that are required for this test
  needs: ['component:nf-graph', 'component:nf-graph-content']
});

test('bars layout', function(assert) {
  var bars;

  Ember.run(() => {
    var nfBars = this.subject({
        xScale: x => { 
          switch(x) {
            case 'a':
              return 0;
            case 'b':
              return 10;
            case 'c':
              return 20;
          }
        },
        yScale: x => x,
        renderedData: [ ['a', 10], ['b', 5], ['c', 1] ],
        graphHeight: 10,
        getBarClass: () => 'testClass',
        barWidth: 10,
        groupOffsetX: 30,
        _getRectPath: (...args) => args
      });

      bars = nfBars.get('bars');
  });
  
  assert.deepEqual(bars, [{
    path: [30, 10, 10, 0],
    className: 'nf-bars-bar testClass',
    data: ['a',10]
  }, {
    path: [40, 5, 10, 5],
    className: 'nf-bars-bar testClass',
    data: ['b', 5]
  }, {
    path: [50, 1, 10, 9],
    className: 'nf-bars-bar testClass',
    data: ['c', 1]
  }]);
});
