import Ember from 'ember';
import HasGraphParent from 'ember-cli-nf-graph/mixins/graph-has-graph-parent';
import DataGraphic from 'ember-cli-nf-graph/mixins/graph-data-graphic';
import LineUtils from 'ember-cli-nf-graph/mixins/graph-line-utils';
import SelectableGraphic from 'ember-cli-nf-graph/mixins/graph-selectable-graphic';
import RegisteredGraphic from 'ember-cli-nf-graph/mixins/graph-registered-graphic';
import GraphicWithTrackingDot from 'ember-cli-nf-graph/mixins/graph-graphic-with-tracking-dot';
import RequireScaleSource from 'ember-cli-nf-graph/mixins/graph-requires-scale-source';

/**
  A line graphic for `nf-graph`. Displays a line for the data it's passed.
  @namespace components
  @class nf-line
  @extends Ember.Component
  @uses mixins.graph-line-utils
  @uses mixins.graph-has-graph-parent
  @uses mixins.graph-selectable-graphic
  @uses mixins.graph-registered-graphic
  @uses mixins.graph-data-graphic
  @uses mixins.graph-graphic-with-tracking-dot
  @uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, DataGraphic, SelectableGraphic, 
  LineUtils, RegisteredGraphic, GraphicWithTrackingDot, RequireScaleSource, {
    
  tagName: 'g',
  
  /**
    The type of D3 interpolator to use to create the line.
    @property interpolator
    @type String
    @default 'linear'
  */
  interpolator: 'linear',
  
  classNameBindings: ['selected', 'selectable'],

  classNames: ['nf-line'],

  /**
    The d3 line function to create the line path.
    @method lineFn
    @param data {Array} the array of coordinate arrays to plot as an SVG path
    @private
    @return {String} an SVG path data string
  */
  lineFn: Ember.computed('xScale', 'yScale', 'interpolator', function(){
    var xScale = this.get('xScale');
    var yScale = this.get('yScale');
    var interpolator = this.get('interpolator');
    return this.createLineFn(xScale, yScale, interpolator);
  }),

  /**
    The SVG path data string to render the line
    @property d
    @type String
    @private
    @readonly
  */
  d: Ember.computed('renderedData.@each', 'lineFn', function(){
    var renderedData = this.get('renderedData');
    var lineFn = this.get('lineFn');
    return lineFn(renderedData);
  }),

  /**
    Event handler to toggle the `selected` property on click
    @method _toggleSelected
    @private
  */
  _toggleSelected: Ember.on('click', function(){
    if(this.get('selectable')) {
      this.toggleProperty('selected');
    }
  }),
});