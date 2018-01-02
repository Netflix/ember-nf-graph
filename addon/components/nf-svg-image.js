import Ember from 'ember';
import { computed } from '@ember/object';
import layout from 'ember-nf-graph/templates/components/nf-svg-image';
import RequiresScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';
import { normalizeScale } from 'ember-nf-graph/utils/nf/scale-utils';
import SelectableGraphic from 'ember-nf-graph/mixins/graph-selectable-graphic';

/**
  An image to be displayed in a graph with that takes domain based measurements and
  uses the scale of the graph. Creates an `<image class="nf-image"/>` SVG element.
  @namespace components
  @class nf-svg-image
  @extends Ember.Component
  @uses mixins.graph-requires-scale-source
  @uses mixins.graph-selectable-graphic
*/
export default Ember.Component.extend(RequiresScaleSource, SelectableGraphic, {
  layout,
  tagName: 'image',

  classNameBindings: [':nf-svg-image', 'selectable', 'selected'],

  attributeBindings: ['svgX:x', 'svgY:y', 'svgWidth:width', 'svgHeight:height', 'src:href'],

  click: function(){
    if(this.get('selectable')) {
      this.toggleProperty('selected');
    }
  },

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  /**
    The domain x value to place the image at.
    @property x
    @default null
  */
  x: null,

  /**
    The domain y value to place the image at.
    @property y
    @default null
  */
  y: null,

  _width: 0,

  /**
    The width as a domain value. Does not handle ordinal
    scales. To set a pixel value, set `svgWidth` directly.
    @property width
    @type Number
    @default 0
  */
  width: computed({
    get() {
      return this._width;
    },
    set(key, value) {
      return this._width = Math.max(0, +value) || 0;
    }
  }),

  _height: 0,

  /**
    The height as a domain value. Does not
    handle ordinal scales. To set a pixel value, just
    set `svgHeight` directly.
    @property height
    @default null
  */
  height: computed({
    get() {
      return this._height;
    },
    set(key, value) {
      this._height = Math.max(0, +value) || 0;
    }
  }),

  /**
    The image source url
    @property src
    @type String
  */
  src: '',

  x0: computed('x', 'xScale', function(){
    return normalizeScale(this.get('xScale'), this.get('x'));
  }),

  y0: computed('y', 'yScale', function(){
    return normalizeScale(this.get('yScale'), this.get('y'));
  }),

  x1: computed('xScale', 'width', 'x', function(){
    let scale = this.get('xScale');
    if(scale.rangeBands) {
      throw new Error('nf-image does not support ordinal scales');
    }
    return normalizeScale(scale, this.get('width') + this.get('x'));
  }),

  y1: computed('yScale', 'height', 'y', function(){
    let scale = this.get('yScale');
    if(scale.rangeBands) {
      throw new Error('nf-image does not support ordinal scales');
    }
    return normalizeScale(scale, this.get('height') + this.get('y'));
  }),

  /**
    The pixel value at which to plot the image.
    @property svgX
    @type Number
  */
  svgX: computed('x0', 'x1', function(){
    return Math.min(this.get('x0'), this.get('x1'));
  }),

  /**
    The pixel value at which to plot the image.
    @property svgY
    @type Number
  */
  svgY: computed('y0', 'y1', function(){
    return Math.min(this.get('y0'), this.get('y1'));
  }),

  /**
    The width, in pixels, of the image.
    @property svgWidth
    @type Number
  */
  svgWidth: computed('x0', 'x1', function(){
    return Math.abs(this.get('x0') - this.get('x1'));
  }),

  /**
    The height, in pixels of the image.
    @property svgHeight
    @type Number
  */
  svgHeight: computed('y0', 'y1', function(){
    return Math.abs(this.get('y0') - this.get('y1'));
  }),
});
