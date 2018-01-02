import Component from '@ember/component';
import { computed } from '@ember/object';
import { dataGenerator } from '../services/data-generator';

export default Component.extend({
  classNames: ['bars-with-line'],

  barData: computed(function() {
    return dataGenerator.simpleOrdinalData();
  }),

  lineData: computed(function() {
    return dataGenerator.simpleOrdinalData();
  }),
});
