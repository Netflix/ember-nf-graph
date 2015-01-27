import Ember from 'ember';
import HasGraphParent from 'ember-cli-ember-dvc/mixins/graph-has-graph-parent';
import DataGraphic from 'ember-cli-ember-dvc/mixins/graph-data-graphic';
import LineUtils from 'ember-cli-ember-dvc/mixins/graph-line-utils';
import SelectableGraphic from 'ember-cli-ember-dvc/mixins/graph-selectable-graphic';
import RegisteredGraphic from 'ember-cli-ember-dvc/mixins/graph-registered-graphic';
import GraphicWithTrackingDot from 'ember-cli-ember-dvc/mixins/graph-graphic-with-tracking-dot';
import RequireScaleSource from 'ember-cli-ember-dvc/mixins/graph-requires-scale-source';
import { property } from 'ember-cli-ember-dvc/utils/computed-property-helpers';

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
  lineFn: property('xScale', 'yScale', 'interpolator', function(xScale, yScale, interpolator) {
    return this.createLineFn(xScale, yScale, interpolator);
  }),

  /**
    The SVG path data string to render the line
    @property d
    @type String
    @private
    @readonly
  */
  d: property('renderedData.@each', 'lineFn', function(renderedData, lineFn) {
    return lineFn(renderedData);
  }),

  /**
    Event handler to toggle the `selected` property on click
    @method _toggleSelected
    @private
  */
  _toggleSelected: function(){
    if(this.get('selectable')) {
      this.toggleProperty('selected');
    }
  }.on('click'),
});