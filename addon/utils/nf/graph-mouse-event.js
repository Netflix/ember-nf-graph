import Ember from 'ember';
import GraphPosition from './graph-position';
import { getMousePoint } from './svg-dom';
/**
  An event context object generally returned by tracking events. Also used as
  `trackedData` in components such as `nf-line`, `nf-area` and `nf-bars`.
  
  @namespace utils.nf
  @class graph-mouse-event
  @extends graph-position
*/
export default GraphPosition.extend({
  /**
    The original event that triggered the action or ember event
    @property originalEvent
    @type MouseEvent
    @default null
  */
  originalEvent: null,

  /**
    Method used to get the mouse position relative to a container
    @method _getMousePoint
    @private
  */
  _getMousePoint: getMousePoint,

  /**
    The coordinates of the mouse relative to eh nf-graph-content
    @property _mousePoint
    @type Object
    @readonly
    @private
  */
  _mousePoint: function(){
    return this._getMousePoint(this.get('graphContentElement'), this.get('originalEvent'));
  }.property('originalEvent', 'graphContentElement'),

  /**
    The nf-graph-content element of the nf-graph
    @property graphContentElement
    @type SVGGElement
    @readonly
  */
  graphContentElement: Ember.computed.oneWay('graph.content.element'),

  /**
    The mouse x position relative to the graph content
    @property mouseX
    @type Number
    @readonly
  */
  mouseX: Ember.computed.oneWay('_mousePoint.x'),

  /**
    The mouse y position relative to the graph content
    @property mouseY
    @type Number
    @readonly
  */
  mouseY: Ember.computed.oneWay('_mousePoint.y'),

  /**
    A positioning object for the mouse position
    @property mousePosition
    @type graph-position
    @readonly
  */
  mousePosition: function(){
    return GraphPosition.create({
      graphX: this.get('mouseX'),
      graphY: this.get('mouseY'),
      source: this.get('source'),
      graph: this.get('graph'),
    });
  }.property('mouseX', 'mouseY', 'source', 'graph'),

  /**
    The raw data point nearest the mouse.graphX position
    @property nearestDataPoint
    @type Array
    @readonly
  */
  nearestDataPoint: function() {
    var mouseX = this.get('mouseX');
    var source = this.get('source');
    return source ? source.getDataNearXRange(mouseX) : undefined;
  }.property('source', 'mouse.graphX'),

  /**
    The x domain value at the nearest data point to the mouse position
    along the x axis.
    @property x
    @readonly
  */
  x: function() {
    var nearestDataPoint = this.get('nearestDataPoint');
    this._x =  nearestDataPoint ? nearestDataPoint[0] : undefined;
    return this._x;
  }.property('nearestDataPoint'),

  /**
    The y domain value at the nearest data point to the mouse position
    along the x axis.
    @property y
    @readonly
  */
  y: function() {
    var nearestDataPoint = this.get('nearestDataPoint');
    this._y = nearestDataPoint ? nearestDataPoint[1] : undefined;
    return this._y;
  }.property('nearestDataPoint'),

  /**
    The data carried by the nearest data point to the mouse position
    along the x axis.
    @property data
    @readonly
  */
  data: Ember.computed.oneWay('nearestDataPoint.data'),
});