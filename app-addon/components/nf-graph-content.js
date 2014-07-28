import Ember from 'ember';

/**
 * Container component for graphics to display in `nf-graph`. Represents
 * the area where the graphics, such as lines will display.
 *
 * Exists for layout purposes.
 * @namespace components
 * @class nf-graph-content
 */
export default Ember.Component.extend({
  tagName: 'g',
  
  classNames: ['nf-graph-content'],

  attributeBindings: ['transform'],

  transform: function(){
    return 'translate(%@ %@)'.fmt(this.get('x'), this.get('y'));
  }.property('x', 'y'),

  x: Ember.computed.alias('graph.graphX'),
  y: Ember.computed.alias('graph.graphY'),
  width: Ember.computed.alias('graph.graphWidth'),
  height: Ember.computed.alias('graph.graphHeight'),


  gridLanes: function () {
    var ticks = this.get('graph.yAxis.ticks');
    var width = this.get('width');
    var height = this.get('height');

    if(!ticks || ticks.length === 0) {
      return [];
    }

    var sorted = ticks.slice().sort(function(a, b) {
      return a.y - b.y;
    });

    if(sorted[0].y !== 0) {
      sorted.unshift({ y: 0 });
    }

    var lanes = sorted.reduce(function(lanes, tick, i) {
      var y = tick.y;
      var next = sorted[i+1] || { y: height };
      var h = next.y - tick.y;
      lanes.push({
        x: 0,
        y: y,
        width: width,
        height: h
      });
      return lanes;
    }, []);

    return lanes;
  }.property('graph.yAxis.ticks', 'width'),

  frets: Ember.computed.alias('graph.xAxis.ticks'),

  _setup: function(){
    var graph = this.nearestWithProperty('isGraph');
    this.set('graph', graph);
  }.on('init')
});