import Ember from 'ember';
import { computed } from '@ember/object';
import layout from 'ember-nf-graph/templates/components/nf-tracker';
import DataGraphic from 'ember-nf-graph/mixins/graph-data-graphic';
import RequiresScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';
import GraphicWithTrackingDot from 'ember-nf-graph/mixins/graph-graphic-with-tracking-dot';

/**
  A tracking graphic component used to do things like create tracking dots for nf-area or nf-line.
  @namespace components
  @class nf-tracker
  @uses mixins.graph-data-graphic
  @uses mixins.graph-requires-scale-source
  @uses mixins.graph-graphic-with-tracking-dot
  */
export default Ember.Component.extend(DataGraphic, RequiresScaleSource, GraphicWithTrackingDot, {
  layout,
  tagName: 'g',

  classNameBindings: [':nf-tracker'],

  attributeBindings: ['transform'],

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  transform: computed('trackedData.x', 'trackedData.y', 'xScale', 'yScale', {
    get() {
      let xScale = this.get('xScale');
      let yScale = this.get('yScale');
      let x = xScale && xScale(this.get('trackedData.x') || 0);
      let y = yScale && yScale(this.get('trackedData.y') || 0);
      return 'translate(' + x + ',' + y + ')';
    }
  })
});
