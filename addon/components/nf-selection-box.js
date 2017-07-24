import Ember from 'ember';
import layout from 'ember-nf-graph/templates/components/nf-selection-box';
import RequireScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';
import { normalizeScale } from 'ember-nf-graph/utils/nf/scale-utils';

/**
  Draws a rectangle on an `nf-graph` given domain values `xMin`, `xMax`, `yMin` and `yMax`.
  @namespace components
  @class nf-selection-box
  @extends Ember.Component
  @uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(RequireScaleSource, {
  layout,
  tagName: 'g',

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  /**
    The duration of the transition in ms
    @property duration
    @type Number
    @default 400
  */
  duration: 400,

  /**
    The minimum x domain value to encompass.
    @property xMin
    @default null
  */
  xMin: null,

  /**
    The maximum x domain value to encompoass.
    @property xMax
    @default null
  */
  xMax: null,

  /**
    The minimum y domain value to encompass.
    @property yMin
    @default null
  */
  yMin: null,

  /**
    The maximum y domain value to encompass
    @property yMax
    @default null
  */
  yMax: null,

  classNames: ['nf-selection-box'],

  /**
    The x pixel position of xMin
    @property x0
    @type Number
  */
  x0: Ember.computed('xMin', 'xScale', function(){
    return normalizeScale(this.get('xScale'), this.get('xMin'));
  }),

  /**
    The x pixel position of xMax
    @property x1
    @type Number
  */
  x1: Ember.computed('xMax', 'xScale', function(){
    return normalizeScale(this.get('xScale'), this.get('xMax'));
  }),

  /**
    The y pixel position of yMin
    @property y0
    @type Number
  */
  y0: Ember.computed('yMin', 'yScale', function(){
    return normalizeScale(this.get('yScale'), this.get('yMin'));
  }),

  /**
    The y pixel position of yMax
    @property y1
    @type Number
  */
  y1: Ember.computed('yMax', 'yScale', function(){
    return normalizeScale(this.get('yScale'), this.get('yMax'));
  }),

  /**
    The SVG path string for the box's rectangle.
    @property rectPath
    @type String
  */
  rectPath: Ember.computed('x0', 'x1', 'y0', 'y1', function(){
    let x0 = this.get('x0');
    let x1 = this.get('x1');
    let y0 = this.get('y0');
    let y1 = this.get('y1');
    return `M${x0},${y0} L${x0},${y1} L${x1},${y1} L${x1},${y0} L${x0},${y0}`;
  }),

  /**
    Updates the position of the box with a transition
    @method doUpdatePosition
  */
  doUpdatePosition: function(){
    let boxRect = this.get('boxRectElement');
    let rectPath = this.get('rectPath');
    let duration = this.get('duration');

    boxRect.transition().duration(duration)
      .attr('d', rectPath);
  },

  doUpdatePositionStatic: function(){
    let boxRect = this.get('boxRectElement');
    let rectPath = this.get('rectPath');

    boxRect.attr('d', rectPath);
  },

  /**
    Schedules an update to the position of the box after render.
    @method updatePosition
    @private
  */
  updatePosition: Ember.observer('xMin', 'xMax', 'yMin', 'yMax', function(){
    Ember.run.once(this, this.doUpdatePosition);
  }),

  staticPositionChange: Ember.on('didInsertElement', Ember.observer('xScale', 'yScale', function(){
    Ember.run.once(this, this.doUpdatePositionStatic);
  })),

  /**
    Sets up the required d3 elements after component
    is inserted into the DOM
    @method didInsertElement
  */
  didInsertElement: function(){
    let element = this.get('element');
    let g = d3.select(element);
    let boxRect = g.append('path')
      .attr('class', 'nf-selection-box-rect')
      .attr('d', this.get('rectPath'));

    this.set('boxRectElement', boxRect);
  },
});
