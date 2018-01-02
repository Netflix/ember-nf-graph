import Component from '@ember/component';
import { computed } from '@ember/object';
import { dataGenerator } from '../services/data-generator';

export default Component.extend({

  graphData: computed(function() {
    return dataGenerator.threeMetricTimeSeries();
  })

});
