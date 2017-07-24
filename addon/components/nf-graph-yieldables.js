import Ember from 'ember';
import layout from 'ember-nf-graph/templates/components/nf-graph-yieldables';

export default Ember.Component.extend({
  layout,
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
