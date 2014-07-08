import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'g',
  // templateName: 'ember-cli-ember-dvc/components/graph-y-axis',

  attributeBindings: ['transform'],

  classNameBindings: ['class'],

  _tickFilter: null,

  tickFilter: function(name, value) {
    if(arguments.length > 1) {
      this._tickFilter = value;
    }
    return this._tickFilter;
  }.property(),

  'class': function(){
    var orient = this.get('orient');
    return orient === 'left' ? 'y-axis' : 'y-axis orient-right';
  }.property('orient'),

  transform: function(){
    var x = this.get('x');
    var y = this.get('y');
    return 'translate(%@ %@)'.fmt(x, y);
  }.property('x', 'y'),

  x: function(){
    var orient = this.get('orient');
    if(orient !== 'left') {
      return this.get('graph.width') - this.get('width') - this.get('graph.paddingRight');
    }
    return this.get('graph.paddingLeft');
  }.property('orient', 'graph.width', 'width', 'graph.paddingLeft', 'graph.paddingRight'),

  y: function(){
    return this.get('graph.graphY');
  }.property('graph.graphY'),

  tickCount: 5,
  tickLength: 5,
  tickPadding: 3,
  width: 20,
  orient: 'left',

  height: function(){
    return this.get('graph.height');
  }.property('graph.height'),

  ticks: function(){
    var yScale = this.get('graph.yScale');
    var tickCount = this.get('tickCount');
    var scaleType = this.get('graph.yScaleType');
    var tickPadding = this.get('tickPadding');
    var axisLineX = this.get('axisLineX');
    var tickLength = this.get('tickLength');
    var orient = this.get('orient');
    var tickFilter = this.get('tickFilter');
    var ticks = yScale.ticks(tickCount);

    if (scaleType === 'log') {
      var step = Math.round(ticks.length / tickCount);
      ticks = ticks.filter(function (tick, i) {
        return i % step === 0;
      });
    }

    var result = ticks.map(function (tick) {
      return {
        value: tick,
        y: yScale(tick),
        x1: axisLineX + tickLength,
        x2: axisLineX,
        labelx: orient === 'right' ? (tickLength + tickPadding) : (axisLineX - tickLength - tickPadding),
      };
    });

    if(tickFilter) {
      result = result.filter(tickFilter);
    }

    return result;
  }.property('graph.yScale', 'tickCount', 'graph.yScaleType',
    'tickPadding', 'axisLineX', 'orient'),

  axisLineX: function(){
    var orient = this.get('orient');
    var width = this.get('width');
    return orient === 'right' ? 0 : width;
  }.property('orient', 'width'),

  _setup: function(){
      var graph = this.nearestWithProperty('isGraph');
      graph.set('yAxis', this);
      this.set('graph', graph);
  }.on('init')
});
