import Ember from 'ember';
import GraphDataGraphic from 'ember-nf-graph/mixins/graph-data-graphic';
import { module, test } from 'qunit';

module('addon/mixins/graph-data-graphic');

test('renderedData should narrow sortedData down to only what is between xMin and xMax if non-ordinal xScaleType, PLUS one point to either side', assert => {
  var Foo = Ember.Component.extend(GraphDataGraphic, Ember.Evented);
  Ember.run(() => {
    var foo = Foo.create({
      mappedData: [[1,1], [75, 2], [100, 3], [101, 4], [150, 5], [199, 6], [200, 7], [225, 8], [300, 9]],
      graph: Ember.Object.create({
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
  var Foo = Ember.Component.extend(GraphDataGraphic);
  Ember.run(() => {
    var foo = Foo.create({
      mappedData: [[1,1], [75, 2], [100, 3], [101, 4], [150, 5], [199, 6], [200, 7], [225, 8], [300, 9]],
      graph: Ember.Object.create({
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
  var Foo = Ember.Component.extend(GraphDataGraphic);
    Ember.run(() => {
    var foo = Foo.create({
      renderedData: [[1,1],[2,2],[3,3],[4,4],[5,5]],
      xMin: 1.4
    });

    var firstVisibleData = foo.get('firstVisibleData');
    assert.deepEqual(firstVisibleData, { x: 2, y: 2, data: undefined });
  });
});

test('firstVisibleData returns the first item of renderedData if it is at the xMin exactly', assert => {
  var Foo = Ember.Component.extend(GraphDataGraphic);
  Ember.run(() => {
    var foo = Foo.create({
      renderedData: [[1,1],[2,2],[3,3],[4,4],[5,5]],
      xMin: 1
    });

    var firstVisibleData = foo.get('firstVisibleData');
    assert.deepEqual(firstVisibleData, { x: 1, y: 1, data: undefined });
  });
});

test('lastVisibleData returns the last item of renderedData that is actually visible if renderedData includes a value off-graph', assert => {
  var Foo = Ember.Component.extend(GraphDataGraphic);
  Ember.run(() => {
    var foo = Foo.create({
      renderedData: [[1,1],[2,2],[3,3],[4,4],[5,5]],
      xMax: 4.4
    });

    var lastVisibleData = foo.get('lastVisibleData');
    assert.deepEqual(lastVisibleData, { x: 4, y: 4, data: undefined });
  });
});

test('lastVisibleData returns the last item of renderedData if it is at the xMax exactly', assert => {
  var Foo = Ember.Component.extend(GraphDataGraphic);
  Ember.run(() => {
    var foo = Foo.create({
      renderedData: [[1,1],[2,2],[3,3],[4,4],[5,5]],
      xMax: 5
    });

    var lastVisibleData = foo.get('lastVisibleData');
    assert.deepEqual(lastVisibleData, { x: 5, y: 5, data: undefined });
  });
});

test('getDataNearX() should return the data point closest to the x domain value passed', assert => {
  var Foo = Ember.Component.extend(GraphDataGraphic);
  Ember.run(() => {
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
  var Foo = Ember.Component.extend(GraphDataGraphic);
  Ember.run(() => {
    var foo = Foo.create({
      xprop: 'foo.bar'
    });

    var fn = foo.get('xPropFn');
    assert.equal(fn({ foo: { bar: 'wokka wokka' } }), 'wokka wokka');
  });
});

test('xPropFn should work if xprop uses an array index like so: foo[2]', assert => {
  var Foo = Ember.Component.extend(GraphDataGraphic);
  Ember.run(() => {
    var foo = Foo.create({
      xprop: 'foo[2]'
    });

    var fn = foo.get('xPropFn');
    assert.equal(fn({ foo: ['apple', 'orange', 'banana'] }), 'banana');
  });
});

test('yPropFn should be a function that gets the value specified by yprop', assert => {
  var Foo = Ember.Component.extend(GraphDataGraphic);
  Ember.run(() => {
    var foo = Foo.create({
      yprop: 'foo.bar'
    });

    var fn = foo.get('yPropFn');
    assert.equal(fn({ foo: { bar: 'wokka wokka' } }), 'wokka wokka');
  });
});


test('yPropFn should work if yprop uses an array index like so: foo[2]', assert => {
  var Foo = Ember.Component.extend(GraphDataGraphic);
  Ember.run(() => {
    var foo = Foo.create({
      yprop: 'foo[2]'
    });

    var fn = foo.get('yPropFn');
    assert.equal(fn({ foo: ['apple', 'orange', 'banana'] }), 'banana');
  });
});
