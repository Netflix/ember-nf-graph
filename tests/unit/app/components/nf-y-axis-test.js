import EmberObject, { computed } from '@ember/object';
import { run } from '@ember/runloop';
import {
  moduleForComponent,
  test
} from 'ember-qunit';


moduleForComponent('nf-y-axis', {
  // specify the other units that are required for this test
  needs: ['component:nf-graph']
});

test('nf-y-axis tickData should call tickFactory if available', function(assert) {
  var args;
  run(() => {
    //HACK: couldn't find a great, documented way of mocking readonly and aliased propertied
    // so I override them here.
    var axis = this.factory().extend({
      uniqueYData: [1,2,3,4,5],
      yScale: 'yScale',
      graph: computed(() => ({
        yScaleType: 'yScaleType'
      })),
      tickCount: 42,
      tickFactory: function() {
        args = [].slice.call(arguments);
        return 'expected result';
      }
    }).create();

    var tickData = axis.get('tickData');
    assert.equal(tickData, 'expected result');
    assert.deepEqual(args, ['yScale', 42, [1,2,3,4,5], 'yScaleType']);
  });
});


test('nf-y-axis useTemplate if template.blockParams', function(assert) {
  run(() => {
    var axis = this.factory().extend({
      graph: computed(() => ({
        yScaleType: 'yScaleType'
      }))
    }).create();

    axis.set('template', EmberObject.create({
      blockParams: true
    }));

    assert.equal(axis.get('useTemplate'), true);
  });
});


test('nf-y-axis useTemplate if hasBlock AND hasBlockParams', function(assert) {
  run(() => {
    var axis = this.factory().extend({
      graph: computed(() => ({
        yScaleType: 'yScaleType'
      })),
      hasBlock: true,
      hasBlockParams: true
    }).create();

    assert.equal(axis.get('useTemplate'), true);
  });
});
