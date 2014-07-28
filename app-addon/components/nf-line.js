import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import DataGraphic from '../mixins/graph-data-graphic';
import DataPositionUtils from '../mixins/graph-data-position-utils';
import LineUtils from '../mixins/graph-line-utils';
import SelectableGraphic from '../mixins/graph-selectable-graphic';
import RegisteredGraphic from '../mixins/graph-registered-graphic';
import GraphicWithTrackingDot from '../mixins/graph-graphic-with-tracking-dot';

/**
 * A line graphic for `nf-graph`. Displays a line for the data it's passed.
 * @namespace components
 * @class nf-line
 */
export default Ember.Component.extend(HasGraphParent, DataGraphic, SelectableGraphic, 
  DataPositionUtils, LineUtils, RegisteredGraphic, GraphicWithTrackingDot, {
  tagName: 'g',
  interpolator: 'linear',
  classNames: ['nf-line'],
  
  dotRadius: 3,

  lineFn: function(){
    var xScale = this.get('graph.xScale');
    var yScale = this.get('graph.yScale');
    var interpolator = this.get('interpolator');
    return this.createLineFn(xScale, yScale, interpolator);
  }.property('graph.xScale', 'graph.yScale', 'interpolator'),


  d: function(){
    var sortedData = this.get('sortedData');
    var lineFn = this.get('lineFn');
    return lineFn(sortedData);
  }.property('sortedData', 'lineFn'),

  _updateSelectionClick: function(){
    if(this.get('selectable')) {
      this.set('click', function(){
        this.toggleSelected();
      });
    }
  }.observes('selectable')
});