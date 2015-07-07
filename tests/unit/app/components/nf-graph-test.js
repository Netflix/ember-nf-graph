import Ember from 'ember';

import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('nf-graph', {});

['push', 'auto', 'push-tick'].forEach((mode) => 
  test('changing xDataExtent[0] with xMinMode = "' + mode + '" should trigger didAutoUpdateMinX()', function(assert) {
    assert.expect(1);

    var graph = this.subject({
      xMinMode: mode,
      xMin: 0,
      xMax: 100,
      didAutoUpdateMinX() {
        assert.ok(true);
      }
    });

    Ember.run(() => {
      graph.set('xDataExtent', [-1, 100]);
      graph.get('xMin');
    });
  })
);

test('changing xDataExtent[0] with xMinMode = "fixed" should NOT trigger didAutoUpdateMinX()', function(assert) {
  assert.expect(0);

  var graph = this.subject({
    xMinMode: 'fixed',
    xMin: 0,
    xMax: 100,
    didAutoUpdateMinX() {
      assert.ok(false);
    }
  });

  Ember.run(() => {
    graph.set('xDataExtent', [-1, 100]);
    graph.get('xMin');
  });
});


['push', 'auto', 'push-tick'].forEach((mode) => 
  test('changing xDataExtent[0] with xMaxMode = "' + mode + '" should trigger didAutoUpdateMaxX()', function(assert) {
    assert.expect(1);

    var graph = this.subject({
      xMaxMode: mode,
      xMin: 0,
      xMax: 100,
      didAutoUpdateMaxX() {
        assert.ok(true);
      }
    });

    Ember.run(() => {
      graph.set('xDataExtent', [0, 101]);
      graph.get('xMax');
    });
  })
);


test('changing xDataExtent[0] with xMaxMode = "fixed" should trigger NOT didAutoUpdateMaxX()', function(assert) {
  assert.expect(0);

  var graph = this.subject({
    xMaxMode: 'fixed',
    xMin: 0,
    xMax: 100,
    didAutoUpdateMaxX() {
      assert.ok(false);
    }
  });

  Ember.run(() => {
    graph.set('xDataExtent', [0, 101]);
    graph.get('xMax');
  });
});

test('calling didAutoUpdateMaxX() should send the graph instance over autoScaleXAction', function(assert){
  assert.expect(1);

  var calledWith;

  var graph = this.subject({
    xDataExtent: [1,2],
    sendAction() {
      calledWith = [].slice.call(arguments);
    }
  });

  Ember.run(() => {
    graph.didAutoUpdateMaxX();
  });

  assert.deepEqual(calledWith, ['autoScaleXAction', graph]);
});

test('calling didAutoUpdateMinX() should send the graph instance over autoScaleXAction', function(assert){
  assert.expect(1);

  var calledWith;

  var graph = this.subject({
    xDataExtent: [1,2],
    sendAction() {
      calledWith = [].slice.call(arguments);
    }
  });

  Ember.run(() => {
    graph.didAutoUpdateMinX();
  });

  assert.deepEqual(calledWith, ['autoScaleXAction', graph]);
});

//-----


test('calling didAutoUpdateMinY() should send the graph instance over autoScaleYAction', function(assert){
  assert.expect(1);

  var calledWith;

  var graph = this.subject({
    yDataExtent: [1,2],
    sendAction() {
      calledWith = [].slice.call(arguments);
    }
  });

  Ember.run(() => {
    graph.didAutoUpdateMinY();
  });

  assert.deepEqual(calledWith, ['autoScaleYAction', graph]);
});

test('calling didAutoUpdateMaxY() should send yDataExtent over autoScaleYAction', function(assert){
  assert.expect(1);

  var calledWith;

  var graph = this.subject({
    yDataExtent: [1,2],
    sendAction() {
      calledWith = [].slice.call(arguments);
    }
  });

  Ember.run(() => {
    graph.didAutoUpdateMaxY();
  });

  assert.deepEqual(calledWith, ['autoScaleYAction', graph]);
});


