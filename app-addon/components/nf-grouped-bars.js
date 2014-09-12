import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import parsePropExpr from '../utils/parse-property-expression';
import RequiresScaleSource from '../mixins/graph-requires-scale-source';
import RegisteredGraphic from '../mixins/graph-registered-graphic';

export default Ember.Component.extend(HasGraphParent, RequiresScaleSource, RegisteredGraphic, {
	tagName: 'g',

	isGroupedBars: true,

	classNames: ['nf-grouped-bars'],

	data: null,

	xprop: 'x',

	_yprops: null,

	yprops: function(key, value) {
		if(arguments.length > 1) {
			if(Ember.isArray(value)) {
				this._yprops = value;
			} else if(typeof value === 'string') {
				this._yprops = value.split(' ').filter(function(x) { return x; });
			} else {
				this._yprops = null;
			}
		}
		return this._yprops;
	}.property(),

	groupedData: function() {
		var data = this.get('data');
		if(!Ember.isArray(data)) {
			return null;
		}

		var xprop = this.get('xprop');
		var yprops = this.get('yprops');

		var xpropExpr = parsePropExpr(xprop);
		var ypropExprs = yprops.map(parsePropExpr);

		var xData = [];
		var yData = [];

		var groupedData = data.map(function(d, i) {
			var x = xpropExpr(d);
			xData.push(x);
			var result = [
				x,
				ypropExprs.map(function(expr, i) {
					var y = expr(d);
					yData.push(y);

					return {
						value: y,
						key: yprops[i],
					};
				})
			];
			result.data = d;
			result.originalIndex = i;
			return result;
		});

		this.set('xData', xData);
		this.set('yData', yData);
		return groupedData;
	}.property('data.[]', 'xprop', 'yprops.[]'),

	groups: function(){
		var groupedData = this.get('groupedData');
		var xScale = this.get('xScale');
		var yScale = this.get('yScale');

		if(!Ember.isArray(groupedData) || !xScale || !yScale) {
			return null;
		}

		var graphHeight = this.get('graph.graphHeight');
		var groupWidth = xScale.rangeBand();

		var groups = groupedData.map(function(group) {
			var x = group[0];
			var ydata = group[1];
			var groupX = xScale(x);
			var innerXScale = d3.scale.ordinal().domain(ydata).rangeRoundBands([0, groupWidth], 0.1); //TODO: expose padding

			return {
				data: group.data,
				bars: ydata.map(function(yData) {
					var y = yData.value;
					var yKey = yData.key;
					return {
						yValue: y,
						yKey: yKey,
						x: groupX + innerXScale(y),
						y: graphHeight - yScale(y),
						height: yScale(y),
						width: innerXScale.rangeBand(),
					};
				})
			};
		});

		return groups;
	}.property('groupedData.[]', 'xScale', 'yScale', 'graph.graphHeight'),

	actions: {
		barClicked: function(key, value, data){
			if(this.get('barClickAction')) {
				this.sendAction('barClickAction', {
					yprop: key,
					y: value,
					data: data,
					source: this,
					graph: this.get('graph'),
				});
			}
		},

		groupClicked: function(data) {
			if(this.get('groupClickAction')) {
				this.sendAction('groupClickAction', {
					data: data,
					source: this,
					graph: this.get('graph'),
				});
			}
		},
	}
});