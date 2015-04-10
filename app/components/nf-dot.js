import Ember from 'ember';
import HasGraphParent from 'ember-cli-nf-graph/mixins/graph-has-graph-parent';
import RequireScaleSource from 'ember-cli-nf-graph/mixins/graph-requires-scale-source';

/**
  Plots a circle at a given x and y domain value on an `nf-graph`.

  @namespace components
  @class nf-dot
  @extends Ember.Component
  @uses mixins.graph-has-graph-parent
  @uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, RequireScaleSource, {
  tagName: 'circle',

  attributeBindings: ['r', 'cy', 'cx'],

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
  cx: function(){
    var x = this.get('x');
    var xScale = this.get('xScale');
    var hasX = this.get('hasX');
    return hasX && xScale ? xScale(x) : -1;
  }.property('x', 'xScale', 'hasX'),

  /**
    The computed center y coordinate of the circle
    @property cy
    @type Number
    @private
    @readonly
  */
  cy: function() {
    var y = this.get('y');
    var yScale = this.get('yScale');
    var hasY = this.get('hasY');
    return hasY && yScale ? yScale(y) : -1;
  }.property('y', 'yScale', 'hasY'),

  /**
    Toggles the visibility of the dot. If x or y are
    not numbers, will return false.
    @property isVisible
    @private
    @readonly
  */
  isVisible: Ember.computed.and('hasX', 'hasY'),
});