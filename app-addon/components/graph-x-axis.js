import Ember from 'ember';
import HasGraphParent from 'ember-cli-ember-dvc/mixins/graph-has-graph-parent';

export default Ember.Component.extend(HasGraphParent, {
  tagName: 'g',
  // templateName: 'ember-cli-ember-dvc/components/graph-x-axis',

  attributeBindings: ['transform'],
  classNameBindings: ['orientClass'],
  classNames: ['x-axis'],

  height: 20,
  tickCount: 12,
  tickLength: 0,
  tickPadding: 5,
  orient: 'bottom',  
  
  orientClass: function(){
    return 'orient-' + this.get('orient');
  }.property('orient'),

  transform: function(){
    var x = this.get('x') || 0;
    var y = this.get('y') || 0;
    return 'translate(%@ %@)'.fmt(x, y);
  }.property('x', 'y'),

  y: function(){
    var orient = this.get('orient');
    var graphHeight = this.get('graph.height');
    var height = this.get('height');
    var paddingBottom = this.get('graph.paddingBottom');
    var paddingTop = this.get('graph.paddingTop');
    var y;
    if(orient === 'bottom') {
      y = graphHeight - paddingBottom - height;
    } else {
      y = paddingTop;
    }
    console.log(graphHeight, paddingBottom, height, y);
    return y || 0;
  }.property('orient', 'graph.paddingTop', 'graph.paddingBottom', 'graph.height', 'height'),

  x: function(){
    return this.get('graph.graphX') || 0;
  }.property('graph.graphX'),

  width: function(){
    return this.get('graph.graphWidth');
  }.property('graph.graphWidth'),

  ticks: function(){
    var xScale = this.get('graph.xScale');
    var tickCount = this.get('tickCount');
    var orient = this.get('orient');
    var height = this.get('height');
    var tickLength = this.get('tickLength');
    var ticks = this.getScaleTicks(xScale, tickCount);
    var y1 = orient === 'top' ? height : 0;
    var y2 = y1 + tickLength;
    var tickPadding = this.get('tickPadding');
    var labely = orient === 'top' ? (y1 - tickPadding) : (y1 + tickPadding);    
    var result = [];
    
    result = ticks.reduce(function (result, tick, i) {
      var prev = result[result.length - 1];
      if(prev) {
        prev.nextValue = tick;
      }

      result.push({
        prevValue: prev ? prev.value : null,
        value: tick,
        index: i,
        x: xScale(tick),
        y1: y1,
        y2: y2,
        labely: labely
      });

      return result;
    }, result);

    result.forEach(function(tick) {
      var last = result[result.length - 1];
      var first = result[0];
      tick.lastValue = last.value;
      tick.firstValue = first.value;
      tick.tickCount = tickCount;
    });

    return result;

  }.property('tickCount', 'graph.xScale', 'tickPadding', 'tickLength', 'height', 'orient'),

  getScaleTicks: function(scale, count){
    return scale.ticks(count);
  },

  _updateGraphXAxis: function(){
    this.graph.set('xAxis', this);
  }.observes('graph'),
});
