import Ember from 'ember';
import HasGraphParent from 'ember-cli-nf-graph/mixins/graph-has-graph-parent';
import RequireScaleSource from 'ember-cli-nf-graph/mixins/graph-requires-scale-source';
import { normalizeScale } from 'ember-cli-nf-graph/utils/nf/scale-utils';

/**
  Draws a rectangle on an `nf-graph` given domain values `xMin`, `xMax`, `yMin` and `yMax`.
  @namespace components
  @class nf-selection-box
  @extends Ember.Component
  @uses mixins.graph-has-graph-parent
  @uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, RequireScaleSource, {
  tagName: 'g', 

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
  x0: function(){
    return normalizeScale(this.get('xScale'), this.get('xMin'));
  }.property('xMin', 'xScale'),

  /**
    The x pixel position of xMax
    @property x1
    @type Number
  */
  x1: function(){
    return normalizeScale(this.get('xScale'), this.get('xMax'));
  }.property('xMax', 'xScale'),

  /**
    The y pixel position of yMin
    @property y0
    @type Number
  */
  y0: function(){
    return normalizeScale(this.get('yScale'), this.get('yMin'));
  }.property('yMin', 'yScale'),

  /**
    The y pixel position of yMax
    @property y1
    @type Number
  */
  y1: function(){
    return normalizeScale(this.get('yScale'), this.get('yMax'));
  }.property('yMax', 'yScale'),

  /**
    The SVG path string for the box's rectangle.
    @property rectPath
    @type String
  */
  rectPath: function(){
    return 'M%@1,%@2 L%@1,%@4 L%@3,%@4 L%@3,%@2 L%@1,%@2'.fmt(this.get('x0'), this.get('y0'), this.get('x1'), this.get('y1'));
  }.property('x0', 'x1', 'y0', 'y1'),

  /**
    Updates the position of the box with a transition
    @method doUpdatePosition
  */
  doUpdatePosition: function(){
    var boxRect = this.get('boxRectElement');
    var rectPath = this.get('rectPath');
    var duration = this.get('duration');

    boxRect.transition().duration(duration)
      .attr('d', rectPath);
  },

  doUpdatePositionStatic: function(){
    var boxRect = this.get('boxRectElement');
    var rectPath = this.get('rectPath');

    boxRect.attr('d', rectPath);
  },

  /**
    Schedules an update to the position of the box after render.
    @method updatePosition
    @private
  */
  updatePosition: function(){
    Ember.run.once(this, this.doUpdatePosition);
  }.observes('xMin', 'xMax', 'yMin', 'yMax'),

  staticPositionChange: function(){
    Ember.run.once(this, this.doUpdatePositionStatic);
  }.observes('xScale', 'yScale').on('didInsertElement'),

  /**
    Sets up the required d3 elements after component
    is inserted into the DOM
    @method didInsertElement
  */
  didInsertElement: function(){
    var element = this.get('element');
    var g = d3.select(element);
    var boxRect = g.append('path')
      .attr('class', 'nf-selection-box-rect')
      .attr('d', this.get('rectPath'));

    this.set('boxRectElement', boxRect);
  },
});