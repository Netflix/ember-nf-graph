import Ember from 'ember';

/**
  Container component for graphics to display in `nf-graph`. Represents
  the area where the graphics, such as lines will display.
  
  Exists for layout purposes.
  @namespace components
  @class nf-graph-content
*/  
export default Ember.Component.extend({
  tagName: 'g',
  
  classNames: ['nf-graph-content'],

  attributeBindings: ['transform'],

  /**
    The SVG transform for positioning the graph content
    @property transform
    @type String
    @readonly
  */
  transform: function(){
    return 'translate(%@ %@)'.fmt(this.get('x'), this.get('y'));
  }.property('x', 'y'),

  /**
    The x position of the graph content
    @property x
    @type Number
    @readonly
  */
  x: Ember.computed.alias('graph.graphX'),

  /**
    The calculated y position of the graph content
    @property y
    @type Number
    @readonly
  */
  y: Ember.computed.alias('graph.graphY'),

  /**
    The calculated width of the graph content
    @property width
    @type Number
    @readonly
  */
  width: Ember.computed.alias('graph.graphWidth'),

  /**
    The calculated height of the graph content.
    @property height
    @type Number
    @readonly
  */
  height: Ember.computed.alias('graph.graphHeight'),


  /**
    A array containing models to render the grid lanes
    @property gridLanes
    @type Array
    @readonly
  */
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
  }.property('graph.yAxis.ticks', 'width', 'height'),

  /**
    An array containing models to render fret lines
    @property frets
    @type Array
    @readonly
  */
  frets: Ember.computed.alias('graph.xAxis.ticks'),

  _setup: function(){
    var graph = this.nearestWithProperty('isGraph');
    this.set('graph', graph);
  }.on('init')
});