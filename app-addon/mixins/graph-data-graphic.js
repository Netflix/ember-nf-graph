import Ember from 'ember';
import parsePropertyExpr from '../utils/parse-property-expression';

export default Ember.Mixin.create({
	isDataGraphic: true,

	xprop: 'x',
	yprop: 'y',

	xPropFn: function() {
		return parsePropertyExpr(this.get('xprop'));
	}.property('xprop'),

	yPropFn: function() {
		return parsePropertyExpr(this.get('yprop'));
	}.property('yprop'),

	sortedData: function(){
    var data = this.get('data');
    var xPropFn = this.get('xPropFn');
    var yPropFn = this.get('yPropFn');

    if(!data) {
      return null;
    }

    var mapped = data.map(function(d, i) {
    	var item = [xPropFn(d), yPropFn(d)];
    	item.data = d;
    	item.origIndex = i;
    	return item;
    });

    mapped.sort(function(a, b) {
    	return a[0] - b[0];
    });

    return mapped;
  }.property('data', 'xPropFn', 'yPropFn'),

  visibleData: function() {
  	var xMin = this.get('graph.xMin');
  	var xMax = this.get('graph.xMax');
    var sortedData = this.get('sortedData');

    if(!sortedData) {
    	return null;
    }

    return sortedData.filter(function(d) {
    	var x = d[0];
    	return xMin <= x && x <= xMax;
    });
  }.property('sortedData', 'graph.xMin', 'graph.xMax'),

  firstVisibleData: function(){
  	var visibleData = this.get('visibleData');
  	return visibleData && visibleData.length > 0 ? visibleData[0] : null;
  }.property('visibleData'),

  lastVisibleData: function(){
  	var visibleData = this.get('visibleData');
  	return visibleData && visibleData.length > 0 ? visibleData[visibleData.length - 1] : null;
  }.property('visibleData'),
});