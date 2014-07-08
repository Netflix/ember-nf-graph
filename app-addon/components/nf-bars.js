import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import DataGraphic from '../mixins/graph-data-graphic';
import RegisteredGraphic from '../mixins/graph-registered-graphic';

export default Ember.Components.extend({
	tagName: 'g',

	barsFn: function(){
    var xScale = this.get('graph.xScale');
    var yScale = this.get('graph.yScale');
    var interpolator = this.get('interpolator');
    return this.createLineFn(xScale, yScale, interpolator);
  }.property('graph.xScale', 'graph.yScale', 'interpolator'),
});