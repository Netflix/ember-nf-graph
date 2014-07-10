import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import DataGraphic from '../mixins/graph-data-graphic';
import RegisteredGraphic from '../mixins/graph-registered-graphic';

export default Ember.Component.extend(HasGraphParent, RegisteredGraphic, DataGraphic, {
	tagName: 'g',

	bars: function(){
		var xScale = this.get('graph.xScale');
		var yScale = this.get('graph.yScale');
		var data = this.get('data');
		var graphHeight = this.get('graph.graphHeight');

		return data.map(function(data, i) {
			var h = yScale(data[1]);
			
			return {
				x: xScale(data[0]),
				y: graphHeight - h,
				width: xScale.rangeBand(),
				height: h
			};
		});
	}.property('graph.xScale', 'graph.yScale', 'data', 'graph.graphHeight')
});