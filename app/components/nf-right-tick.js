import Ember from 'ember';
import RequireScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';

/**
  Draws a line and a chevron at the specified domain value
  on the right side of an `nf-graph`.

  ### Tips

  - Adding `paddingRight` to `nf-graph` component will not affect `nf-right-tick`'s position.

  @namespace components
  @class nf-right-tick
  @extends Ember.Component
  @uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(RequireScaleSource, {
  tagName: 'g',

  classNames: ['nf-right-tick'],

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  /**
    The transition duration in milliseconds
    @property duration
    @type Number
    @default 400
  */
  duration: 400,

  /**
    The domain value at which to place the tick
    @property value
    @type Number
    @default null
  */
  value: null,

  /**
    Sets the visibility of the component. Returns false if `y` is not
    a numeric data type.
    @property isVisible
    @private
    @readonly
  */
  isVisible: Ember.computed('y', function(){
    return !isNaN(this.get('y'));
  }),

  /**
    The calculated y coordinate of the tick
    @property y
    @type Number
    @readonly
  */
  y: Ember.computed('value', 'yScale', 'graph.paddingTop', function() {
    let value = this.get('value');
    let yScale = this.get('yScale');
    let paddingTop = this.get('graph.paddingTop');
    let vy = 0;
    if(yScale) {
      vy = yScale(value) || 0;
    }
    return vy + paddingTop;
  }),

  /**
    The SVG transform used to render the tick
    @property transform
    @type String
    @private
    @readonly
  */
  transform: Ember.computed('y', 'graph.width', function(){
    let y = this.get('y');
    let graphWidth = this.get('graph.width');
    let x0 = graphWidth - 6;
    let y0 = y - 3;
    return `translate(${x0} ${y0})`;
  }),

  /**
    performs the D3 transition to move the tick to the proper position.
    @method _transitionalUpdate
    @private
  */
  _transitionalUpdate: function(){
    let transform = this.get('transform');
    let path = this.get('path');
    let duration = this.get('duration');
    path.transition().duration(duration)
      .attr('transform', transform);
  },

  /**
    Schedules the transition when `value` changes on on init.
    @method _triggerTransition
    @private
  */
  _triggerTransition: Ember.on('init', Ember.observer('value', function(){
    Ember.run.scheduleOnce('afterRender', this, this._transitionalUpdate);
  })),

  /**
    Updates the tick position without a transition.
    @method _nonTransitionalUpdate
    @private
  */
  _nonTransitionalUpdate: function(){
    let transform = this.get('transform');
    let path = this.get('path');
    path.attr('transform', transform);
  },

  /**
    Schedules the update of non-transitional positions
    @method _triggerNonTransitionalUpdate
    @private
  */
  _triggerNonTransitionalUpdate: Ember.observer('graph.width', function(){
    Ember.run.scheduleOnce('afterRender', this, this._nonTransitionalUpdate);
  }),

  /**
    Gets the elements required to do the d3 transitions
    @method _getElements
    @private
  */
  _getElements: Ember.on('didInsertElement', function(){
    let g = d3.select(this.$()[0]);
    let path = g.selectAll('path').data([0]);
    this.set('path', path);
  })
});
