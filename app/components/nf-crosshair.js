import Ember from 'ember';
import HasGraphParent from 'ember-cli-nf-graph/mixins/graph-has-graph-parent';

/**
  A component that adds a "crosshair" to an `nf-graph` that follows the mouse
  while it's hovering over the graph content.
  @namespace components
  @class nf-crosshair
  @extends Ember.Component
  @uses mixins.graph-has-graph-parent
*/
export default Ember.Component.extend(HasGraphParent, {
  tagName: 'g',

  classNames: ['nf-crosshair'],

  /**
    The height of the crosshair in pixels
    @property height
    @type Number
    @readonly
  */
  height: Ember.computed.alias('graph.graphHeight'),

  /**
    The width of the crosshair in pixels
    @property width
    @type Number
    @readonly
  */
  width: Ember.computed.alias('graph.graphWidth'),

  /**
    The x position of the crosshairs
    @property x
    @type Number
    @default 0
  */
  x: 0,

  /**
    The y position of the crosshairs
    @property y
    @type Number
    @default 0
  */
  y: 0,

  /**
    The visibility of the component
    @property isVisible
    @type Boolean
    @default false
  */
  isVisible: false,

  didContentHoverChange: function(e) {
    this.set('isVisible', true);
    this.set('x', e.get('mouseX'));
    this.set('y', e.get('mouseY'));
  },

  didContentHoverEnd: function() {
    this.set('isVisible', false);
  },

  _setupBindings: function() {
    var content = this.get('graph.content');
    if(content) {
      content.on('didHoverChange', this, this.didContentHoverChange);
      content.on('didHoverEnd', this, this.didContentHoverEnd);
    }
  }.observes('graph.content'),
});