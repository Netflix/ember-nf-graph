import Ember from 'ember';
import HasGraphParent from 'ember-cli-nf-graph/mixins/graph-has-graph-parent';
import RequireScaleSource from 'ember-cli-nf-graph/mixins/graph-requires-scale-source';
import { normalizeScale } from 'ember-cli-nf-graph/utils/nf/scale-utils';

/**
  Draws a box underneath (or over) the y axis to between the given `a` and `b`
  domain values. Component content is used to template a label in that box.

  ## Tips

  - Should be outside of `nf-graph-content`.
  - Should be "above" `nf-y-axis` in the markup.
  - As a convenience, `<text>` elements will automatically be positioned based on y-axis orientation
    due to default styling.

  @namespace components
  @class nf-y-diff
  @extends Ember.Component
  @uses mixins.graph-has-graph-parent
  @uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, RequireScaleSource, {
  tagName: 'g',

  attributeBindings: ['transform'],

  classNameBindings: [':nf-y-diff', 'isPositive:positive:negative', 'isOrientRight:orient-right:orient-left'],

  /**
    The starting domain value of the difference measurement. The subrahend of the difference calculation.
    @property a
    @type Number
    @default null
  */
  a: null,
  
  /**
    The ending domain value of the difference measurement. The minuend of the difference calculation.
    @property b
    @type Number
    @default null
  */
  b: null,
  
  /**
    The amount of padding, in pixels, between the edge of the difference "box" and the content container
    @property contentPadding
    @type Number
    @default 5
  */
  contentPadding: 5,
  
  /**
    The duration of the transition, in milliseconds, as the difference slides vertically
    @property duration
    @type Number
    @default 400
  */
  duration: 400,

  /**
    The calculated vertical center of the difference box, in pixels.
    @property yCenter
    @type Number
    @readonly
  */
  yCenter: Ember.computed('yA', 'yB', function(){
    var yA = +this.get('yA') || 0;
    var yB = +this.get('yB') || 0;
    return (yA + yB) / 2;
  }),

  /**
    The y pixel value of b.
    @property yB
    @type Number
  */
  yB: Ember.computed('yScale', 'b', function(){
    return normalizeScale(this.get('yScale'), this.get('b'));
  }),

  /**
    The y pixel value of a.
    @property yA
    @type Number
  */
  yA: Ember.computed('yScale', 'a', function() {
    return normalizeScale(this.get('yScale'), this.get('a'));
  }),

  /**
    The SVG transformation of the component.
    @property transform
    @type String
    @private
    @readonly
  */
  transform: Ember.computed.alias('graph.yAxis.transform'),

  /**
    The calculated difference between `a` and `b`.
    @property diff
    @type Number
    @readonly
  */
  diff: Ember.computed('a', 'b', function(){
    return +this.get('b') - this.get('a');
  }),

  /**
    Returns `true` if `diff` is a positive number
    @property isPositive
    @type Boolean
    @readonly
  */
  isPositive: Ember.computed.gte('diff', 0),
  
  /**
    Returns `true` if the graph's y-axis component is configured to orient right.
    @property isOrientRight
    @type Boolean
    @readonly
  */
  isOrientRight: Ember.computed.equal('graph.yAxis.orient', 'right'),

  /**
    The width of the difference box
    @property width
    @type Number
    @readonly
  */
  width: Ember.computed.alias('graph.yAxis.width'),

  /**
    The view controller for the view this component is present in
    @property parentController
    @type Ember.Controller
    @private
    @readonly
  */
  parentController: Ember.computed.alias('templateData.view.controller'),

  /**
    The x pixel coordinate of the content container.
    @property contentX
    @type Number
    @readonly
  */
  contentX: Ember.computed('isOrientRight', 'width', 'contentPadding', function(){
    var contentPadding = this.get('contentPadding');
    var width = this.get('width');
    return this.get('isOrientRight') ? width - contentPadding : contentPadding;
  }),

  rectPath: Ember.computed('yA', 'yB', 'width', function(){
    var x = 0;
    var w = +this.get('width') || 0;
    var x2 = x + w;
    var yA = +this.get('yA') || 0;
    var yB = +this.get('yB') || 0;
    return 'M%@1,%@2 L%@1,%@4 L%@3,%@4 L%@3,%@2 L%@1,%@2'.fmt(x, yA, x2, yB);
  }),

  /**
    The SVG transformation used to position the content container.
    @property contentTransform
    @type String
    @private
    @readonly
  */
  contentTransform: Ember.computed('contentX', 'yCenter', function(){
    return 'translate(%@ %@)'.fmt(this.get('contentX'), this.get('yCenter'));
  }),

  /**
    Sets up the d3 related elements when component is inserted 
    into the DOM
    @method didInsertElement
  */
  didInsertElement: function(){
    var element = this.get('element');
    var g = d3.select(element);
    
    var rectPath = this.get('rectPath');
    var rect = g.insert('path', ':first-child')
      .attr('class', 'nf-y-diff-rect')
      .attr('d', rectPath);

    var contentTransform = this.get('contentTransform');
    var content = g.select('.nf-y-diff-content');
    content.attr('transform', contentTransform);

    this.set('rectElement', rect);
    this.set('contentElement', content);
  },

  /**
    Performs the transition (animation) of the elements.
    @method doTransition
  */
  doTransition: function(){
    var duration = this.get('duration');
    var rectElement = this.get('rectElement');
    var contentElement = this.get('contentElement');

    if(rectElement) {
      rectElement.transition().duration(duration)
        .attr('d', this.get('rectPath'));
    }

    if(contentElement) {
      contentElement.transition().duration(duration)
        .attr('transform', this.get('contentTransform'));
    }
  },

  /**
    Schedules a transition once at afterRender.
    @method transition
  */
  transition: Ember.observer('a', 'b', function(){
    Ember.run.once(this, this.doTransition);
  }),

  /**
    Updates to d3 managed DOM elments that do
    not require transitioning, because they're width-related.
    @method doAdjustWidth
  */
  doAdjustWidth: function(){
    var contentElement = this.get('contentElement');
    if(contentElement) {
      var contentTransform = this.get('contentTransform');
      contentElement.attr('transform', contentTransform);
    }
  },

  adjustGraphHeight: Ember.on('didInsertElement', Ember.observer('graph.graphHeight', function(){
    var rectElement = this.get('rectElement');
    var contentElement = this.get('contentElement');

    if(rectElement) {
      rectElement.attr('d', this.get('rectPath'));
    }

    if(contentElement) {
      contentElement.attr('transform', this.get('contentTransform'));
    }
  })),

  /**
    Schedules a call to `doAdjustWidth` on afterRender
    @method adjustWidth
  */
  adjustWidth: Ember.on(
    'didInsertElement',
    Ember.observer('isOrientRight', 'width', 'contentPadding', function(){
      Ember.run.once(this, this.doAdjustWidth);
    })
  ),
});



