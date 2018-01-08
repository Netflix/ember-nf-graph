import { moduleForComponent, test } from 'ember-qunit';
import { run } from '@ember/runloop';

moduleForComponent('nf-y-axis', {
  unit: true,
  needs: ['component:nf-graph']
});

test('nf-y-axis tickData should call tickFactory if available', function(assert) {
  var args;
  run(() => {
    var axis = this.subject({
      yScale: 'yScale',
      graph: {
        yScaleType: 'yScaleType',
        yData: [1,2,3,4,5]
      },
      tickCount: 42,
      tickFactory() {
        args = [].slice.call(arguments);
        return 'expected result';
      }
    });

    var tickData = axis.get('tickData');
    assert.equal(tickData, 'expected result');
    assert.deepEqual(args, ['yScale', 42, [1,2,3,4,5], 'yScaleType']);
  });
});
