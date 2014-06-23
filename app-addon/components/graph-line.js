import Ember from 'ember';
import HasGraphParent from 'ember-cli-ember-dvc/mixins/graph-has-graph-parent';
import DataGraphic from 'ember-cli-ember-dvc/mixins/graph-data-graphic';
import DataPositionUtils from 'ember-cli-ember-dvc/mixins/graph-data-position-utils';
import LineUtils from 'ember-cli-ember-dvc/mixins/graph-line-utils';
import SelectableGraphic from 'ember-cli-ember-dvc/mixins/graph-selectable-graphic';
import RegisteredGraphic from 'ember-cli-ember-dvc/mixins/graph-registered-graphic';
import GraphicWithTrackingDot from 'ember-cli-ember-dvc/mixins/graph-graphic-with-tracking-dot';

export default Ember.Component.extend(HasGraphParent, DataGraphic, SelectableGraphic, 
  DataPositionUtils, LineUtils, RegisteredGraphic, GraphicWithTrackingDot, {
  tagName: 'g',
  // templateName: 'ember-cli-ember-dvc/components/graph-line',

  interpolator: 'linear',
  classNames: ['graph-line'],
  
  dotRadius: 3,

  lineFn: function(){
    var xScale = this.get('graph.xScale');
    var yScale = this.get('graph.yScale');
    var interpolator = this.get('interpolator');
    return this.createLineFn(xScale, yScale, interpolator);
  }.property('graph.xScale', 'graph.yScale', 'interpolator'),


  d: function(){
    var visibleData = this.get('visibleData');
    var lineFn = this.get('lineFn');
    return lineFn(visibleData);
  }.property('visibleData', 'lineFn'),

  _updateSelectionClick: function(){
    if(this.get('selectable')) {
      this.set('click', function(){
        this.toggleSelected();
      });
    }
  }.observes('selectable')
});