import { computed } from '@ember/object';
import { notEmpty, and } from '@ember/object/computed';
import Component from '@ember/component';
import layout from 'ember-nf-graph/templates/components/nf-plot';
import RequireScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';
import GraphEvent from 'ember-nf-graph/utils/nf/graph-event';

/**
  Plots a group tag on a graph at a given x and y domain coordinate.
  @namespace components
  @class nf-plot
  @extends Ember.Component
  @uses mixins.graph-requires-scale-source
*/
export default Component.extend(RequireScaleSource, {
  layout,
  tagName: 'g',

  attributeBindings: ['transform'],

  classNames: ['nf-plot'],

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  /**
    The x domain value to set the plot at
    @property x
    @default null
  */
  x: null,

  /**
    The y domain value to set the plot at
    @property x
    @default null
  */
  y: null,

  /**
    True if an `x` value is present (defined, not null and non-empty)
    @property hasX
    @type Boolean
    @readonly
  */
  hasX: notEmpty('x'),

  /**
    True if an `y` value is present (defined, not null and non-empty)
    @property hasY
    @type Boolean
    @readonly
  */
  hasY: notEmpty('y'),

  /**
    The calculated visibility of the component
    @property isVisible
    @type Boolean
    @readonly
  */
  isVisible: and('hasX', 'hasY'),

  /**
    The calculated x coordinate
    @property rangeX
    @type Number
    @readonly
  */
  rangeX: computed('x', 'xScale', function(){
    let xScale = this.get('xScale');
    let x = this.get('x');
    let hasX = this.get('hasX');
    return (hasX && xScale ? xScale(x) : 0) || 0;
  }),

  /**
    The calculated y coordinate
    @property rangeY
    @type Number
    @readonly
  */
  rangeY: computed('y', 'yScale', function(){
    let yScale = this.get('yScale');
    let y = this.get('y');
    let hasY = this.get('hasY');
    return (hasY && yScale ? yScale(y) : 0) || 0;
  }),

  /**
    The SVG transform of the component's `<g>` tag.
    @property transform
    @type String
    @readonly
  */
  transform: computed('rangeX', 'rangeY', function(){
    let rangeX = this.get('rangeX');
    let rangeY = this.get('rangeY');
    return `translate(${rangeX} ${rangeY})`;
  }),

  data: null,

  click: function(e) {
    let context = GraphEvent.create({
      x: this.get('x'),
      y: this.get('y'),
      data: this.get('data'),
      source: this,
      graph: this.get('graph'),
      originalEvent: e,
    });
    this.sendAction('action', context);
  },
});
