import Ember from 'ember';
import { dataGenerator } from '../services/data-generator';

var { Component, computed } = Ember;

export default Component.extend({

  graphData: computed(function() {
    return dataGenerator.threeMetricTimeSeries();
  })

});