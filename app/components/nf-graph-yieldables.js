import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  /**
    The parent graph for the components.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  /**
    The scale source for the components
    @property scaleSource
    @default null
    */
  scaleSource: null,
});
