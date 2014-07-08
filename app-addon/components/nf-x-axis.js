import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';

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
  
  _tickFilter: null,

  tickFilter: function(name, value) {
    if(arguments.length > 1) {
      this._tickFilter = value;
    }
    return this._tickFilter;
  }.property(),

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
    var tickFilter = this.get('tickFilter');

    result = ticks.map(function (tick) {
      return {
        value: tick,
        x: xScale(tick),
        y1: y1,
        y2: y2,
        labely: labely
      };
    });


    if(tickFilter) {
      result = result.filter(tickFilter);
    }

    return result;

  }.property('tickCount', 'graph.xScale', 'tickPadding', 'tickLength', 'height', 'orient', 'tickFilter'),

  getScaleTicks: function(scale, count){
    return scale.ticks(count);
  },

  _updateGraphXAxis: function(){
    this.graph.set('xAxis', this);
  }.observes('graph'),
});
