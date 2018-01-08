import { moduleForComponent, test } from 'ember-qunit';
import { run } from '@ember/runloop';

moduleForComponent('nf-x-axis', {
  unit: true,
  needs: ['component:nf-graph'],
});

test('nf-x-axis tickData should call tickFactory if available', function(assert) {
  var args;

  run(() => {
    var axis = this.subject({
      xScale: 'xScale',
      tickCount: 42,
      graph: {
        xScaleType: 'xScaleType',
        xData: [1,2,3,4,5]
      },
      tickFactory() {
        args = [].slice.call(arguments);
        return 'expected result';
      }
    });

    var tickData = axis.get('tickData');
    assert.equal(tickData, 'expected result');
    assert.deepEqual(args, ['xScale', 42, [1,2,3,4,5], 'xScaleType']);
  });
});
