import EmberObject from '@ember/object';
import { run } from '@ember/runloop';
import Evented from '@ember/object/evented';
import Component from '@ember/component';
import GraphDataGraphic from 'ember-nf-graph/mixins/graph-data-graphic';
import { module, test } from 'qunit';

module('addon/mixins/graph-data-graphic');

test('renderedData should narrow sortedData down to only what is between xMin and xMax if non-ordinal xScaleType, PLUS one point to either side', assert => {
  var Foo = Component.extend(GraphDataGraphic, Evented);
  run(() => {
    var foo = Foo.create({
      mappedData: [[1,1], [75, 2], [100, 3], [101, 4], [150, 5], [199, 6], [200, 7], [225, 8], [300, 9]],
      graph: EmberObject.create({
        xScaleType: 'linear',
        xMin: 100,
        xMax: 200
      })
    });

    var renderedData = foo.get('renderedData');
    assert.deepEqual(renderedData, [[75, 2], [100, 3], [101, 4], [150, 5], [199, 6], [200, 7], [225, 8]]);
  });
});

test('renderedData should return the whole sortedData array if xScaleType is "ordinal"', assert => {
  var Foo = Component.extend(GraphDataGraphic);
  run(() => {
    var foo = Foo.create({
      mappedData: [[1,1], [75, 2], [100, 3], [101, 4], [150, 5], [199, 6], [200, 7], [225, 8], [300, 9]],
      graph: EmberObject.create({
        xScaleType: 'ordinal',
        xMin: 100,
        xMax: 200
      })
    });

    var renderedData = foo.get('renderedData');
    assert.deepEqual(renderedData, [[1,1], [75, 2], [100, 3], [101, 4], [150, 5], [199, 6], [200, 7], [225, 8], [300, 9]]);
  });
});

test('firstVisibleData returns the first item of renderedData that is actually visible if renderedData includes a value off-graph', assert => {
  var Foo = Component.extend(GraphDataGraphic);
  var first = [2,2];
  first.data = [111, 222];
  run(() => {
    var foo = Foo.create({
      renderedData: [[1,1],first,[3,3],[4,4],[5,5]],
      xMin: 1.4,
      yPropFn: x => x[1],
      xPropFn: x => x[0]
    });

    var firstVisibleData = foo.get('firstVisibleData');
    assert.deepEqual(firstVisibleData, { x: 111, y: 222, data: first.data, renderX: 2, renderY: 2 });
  });
});

test('firstVisibleData returns the first item of renderedData if it is at the xMin exactly', assert => {
  var Foo = Component.extend(GraphDataGraphic);
  run(() => {
    var first = [1,1];
    first.data = [111,222];
    var foo = Foo.create({
      renderedData: [first,[2,2],[3,3],[4,4],[5,5]],
      xMin: 1,
      yPropFn: x => x[1],
      xPropFn: x => x[0]
    });

    var firstVisibleData = foo.get('firstVisibleData');
    assert.deepEqual(firstVisibleData, { x: 111, y: 222, data: first.data, renderX: 1, renderY: 1 });
  });
});

test('lastVisibleData returns the last item of renderedData that is actually visible if renderedData includes a value off-graph', assert => {
  var Foo = Component.extend(GraphDataGraphic);
  var last = [4,4];
  last.data = [111,222];
  run(() => {
    var foo = Foo.create({
      renderedData: [[1,1],[2,2],[3,3],last,[5,5]],
      xMax: 4.4,
      yPropFn: x => x[1],
      xPropFn: x => x[0]
    });

    var lastVisibleData = foo.get('lastVisibleData');
    assert.deepEqual(lastVisibleData, { x: 111, y: 222, data: last.data, renderX: 4, renderY: 4 });
  });
});

test('lastVisibleData returns the last item of renderedData if it is at the xMax exactly', assert => {
  var Foo = Component.extend(GraphDataGraphic);
  var last = [5,5];
  last.data = [111,222];
  run(() => {
    var foo = Foo.create({
      renderedData: [[1,1],[2,2],[3,3],[4,4],last],
      xMax: 5,
      yPropFn: x => x[1],
      xPropFn: x => x[0]
    });

    var lastVisibleData = foo.get('lastVisibleData');
    assert.deepEqual(lastVisibleData, { x: 111, y: 222, data: last.data, renderX: 5, renderY: 5 });
  });
});

test('getDataNearX() should return the data point closest to the x domain value passed', assert => {
  var Foo = Component.extend(GraphDataGraphic);
  run(() => {
    var foo = Foo.create({
      renderedData: [[1,1],[2,2],[3,3],[4,4],[5,5]]
    });

    var data = foo.getDataNearX(3.6);
    assert.deepEqual(data, [4,4]);
    
    var data2 = foo.getDataNearX(3.3);
    assert.deepEqual(data2, [3,3]);
  });
});

test('xPropFn should be a function that gets the value specified by xprop', assert => {
  var Foo = Component.extend(GraphDataGraphic);
  run(() => {
    var foo = Foo.create({
      xprop: 'foo.bar'
    });

    var fn = foo.get('xPropFn');
    assert.equal(fn({ foo: { bar: 'wokka wokka' } }), 'wokka wokka');
  });
});

test('xPropFn should work if xprop uses an array index like so: foo[2]', assert => {
  var Foo = Component.extend(GraphDataGraphic);
  run(() => {
    var foo = Foo.create({
      xprop: 'foo[2]'
    });

    var fn = foo.get('xPropFn');
    assert.equal(fn({ foo: ['apple', 'orange', 'banana'] }), 'banana');
  });
});

test('yPropFn should be a function that gets the value specified by yprop', assert => {
  var Foo = Component.extend(GraphDataGraphic);
  run(() => {
    var foo = Foo.create({
      yprop: 'foo.bar'
    });

    var fn = foo.get('yPropFn');
    assert.equal(fn({ foo: { bar: 'wokka wokka' } }), 'wokka wokka');
  });
});


test('yPropFn should work if yprop uses an array index like so: foo[2]', assert => {
  var Foo = Component.extend(GraphDataGraphic);
  run(() => {
    var foo = Foo.create({
      yprop: 'foo[2]'
    });

    var fn = foo.get('yPropFn');
    assert.equal(fn({ foo: ['apple', 'orange', 'banana'] }), 'banana');
  });
});
