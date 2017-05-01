import Ember from 'ember';
import layout from 'ember-nf-graph/templates/components/nf-crosshairs';

const {
  on,
  observer
} = Ember;

/**
  A component that adds "crosshairs" to an `nf-graph` that follows the mouse
  while it's hovering over the graph content.
  @namespace components
  @class nf-crosshair
  @extends Ember.Component
  @uses mixins.graph-has-graph-parent
*/
export default Ember.Component.extend({
  layout,
  tagName: 'g',

  classNames: ['nf-crosshairs'],

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

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
    Whether to show the vertical line in the corsshairs
    @property vertical
    @type Boolean
    @default true
  */
  vertical: true,

  /**
    Whether to show the horizontal line in the corsshairs
    @property horizontal
    @type Boolean
    @default true
  */
  horizontal: true,

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

  _setupBindings: on('didInsertElement', observer('graph.content', function() {
    let content = this.get('graph.content');
    if(content) {
      Ember.run.schedule('afterRender', () => {
        content.on('didHoverChange', this, this.didContentHoverChange);
        content.on('didHoverEnd', this, this.didContentHoverEnd);
      });
    }
  })),
});
