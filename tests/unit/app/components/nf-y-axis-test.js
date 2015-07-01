import Ember from 'ember';
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
  Ember.run(() => {
    //HACK: couldn't find a great, documented way of mocking readonly and aliased propertied
    // so I override them here.
    var axis = this.factory().extend({
      uniqueYData: [1,2,3,4,5],
      yScale: 'yScale',
      graph: Ember.computed((key, value) => ({
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