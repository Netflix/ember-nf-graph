import Ember from 'ember';
import { dataGenerator } from '../services/data-generator';

var { Component, computed } = Ember;

export default Component.extend({
  classNames: ['bars-with-line'],

  barData: computed(function() {
    return dataGenerator.simpleOrdinalData();
  }),

  lineData: computed(function() {
    return dataGenerator.simpleOrdinalData();
  }),
});
