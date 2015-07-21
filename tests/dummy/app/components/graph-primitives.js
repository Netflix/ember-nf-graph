import Ember from 'ember';
import { dataGenerator } from '../services/data-generator';
import { min, max } from '../services/utility';

var { Component, computed } = Ember;

export default Component.extend({

  barHeight: 1,

  graphData: computed(function() {
    return dataGenerator.simpleTimeSeries();
  }),

  extent: computed('graphData', function() {
    var data = this.get('graphData');

    return {
      xMin: min(data.map(d => d.start)),
      xMax: max(data.map(d => d.start)),
      yMin: min(data.map(d => d.index)),
      yMax: max(data.map(d => d.index)),
    };
  }),

});
