import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import DataGraphic from '../mixins/graph-data-graphic';
import DataPositionUtils from '../mixins/graph-data-position-utils';
import LineUtils from '../mixins/graph-line-utils';
import SelectableGraphic from '../mixins/graph-selectable-graphic';
import RegisteredGraphic from '../mixins/graph-registered-graphic';
import GraphicWithTrackingDot from '../mixins/graph-graphic-with-tracking-dot';

import { property } from '../utils/computed-property-helpers';

/**
 * A line graphic for `nf-graph`. Displays a line for the data it's passed.
 * @namespace components
 * @class nf-line
 */
export default Ember.Component.extend(HasGraphParent, DataGraphic, SelectableGraphic, 
  DataPositionUtils, LineUtils, RegisteredGraphic, GraphicWithTrackingDot, {
  tagName: 'g',
  
  interpolator: 'linear',
  
  classNameBindings: ['selected', 'selectable'],

  classNames: ['nf-line'],

  lineFn: property('graph.xScale', 'graph.yScale', 'interpolator', function(xScale, yScale, interpolator) {
    return this.createLineFn(xScale, yScale, interpolator);
  }),


  d: property('renderedData.@each', 'lineFn', function(renderedData, lineFn) {
    return lineFn(renderedData);
  }),

  click: function(){
    if(this.get('selectable')) {
      this.toggleProperty('selected');
    }
  },
});