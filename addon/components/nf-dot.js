import Ember from 'ember';
import layout from 'ember-nf-graph/templates/components/nf-dot';
import RequireScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';

/**
  Plots a circle at a given x and y domain value on an `nf-graph`.

  @namespace components
  @class nf-dot
  @extends Ember.Component
  @uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(RequireScaleSource, {
  layout,
  tagName: 'circle',

  attributeBindings: ['r', 'cy', 'cx'],

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  /**
    The x domain value at which to plot the circle
    @property x
    @type Number
    @default null
  */
  x: null,

  /**
    The y domain value at which to plot the circle
    @property x
    @type Number
    @default null
  */
  y: null,

  /**
    The radius of the circle plotted
    @property r
    @type Number
    @default 2.5
  */
  r: 2.5,

  hasX: Ember.computed.notEmpty('x'),

  hasY: Ember.computed.notEmpty('y'),

  /**
    The computed center x coordinate of the circle
    @property cx
    @type Number
    @private
    @readonly
  */
  cx: Ember.computed('x', 'xScale', 'hasX', function(){
    let x = this.get('x');
    let xScale = this.get('xScale');
    let hasX = this.get('hasX');
    return hasX && xScale ? xScale(x) : -1;
  }),

  /**
    The computed center y coordinate of the circle
    @property cy
    @type Number
    @private
    @readonly
  */
  cy: Ember.computed('y', 'yScale', 'hasY', function() {
    let y = this.get('y');
    let yScale = this.get('yScale');
    let hasY = this.get('hasY');
    return hasY && yScale ? yScale(y) : -1;
  }),

  /**
    Toggles the visibility of the dot. If x or y are
    not numbers, will return false.
    @property isVisible
    @private
    @readonly
  */
  isVisible: Ember.computed.and('hasX', 'hasY'),
});
