import Ember from 'ember';
import GraphPosition from './graph-position';
import { getMousePoint } from './svg-dom';
import computed from 'ember-new-computed';

const { reads } = Ember.computed;

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
  _mousePoint: computed('originalEvent', 'graphContentElement', {
    get() {
      return this._getMousePoint(this.get('graphContentElement'), this.get('originalEvent'));
    }
  }),

  /**
    The nf-graph-content element of the nf-graph
    @property graphContentElement
    @type SVGGElement
    @readonly
  */
  graphContentElement: null,

  /**
    The mouse x position relative to the graph content
    @property mouseX
    @type Number
    @readonly
  */
  mouseX: reads('_mousePoint.x'),

  /**
    The mouse y position relative to the graph content
    @property mouseY
    @type Number
    @readonly
  */
  mouseY: reads('_mousePoint.y'),

  /**
    A positioning object for the mouse position
    @property mousePosition
    @type graph-position
    @readonly
  */
  mousePosition: computed('mouseX', 'mouseY', 'source', 'graph', {
    get() {
      return GraphPosition.create({
        graphX: this.get('mouseX'),
        graphY: this.get('mouseY'),
        source: this.get('source'),
        graphContentElement: this.get('graphContentElement'),
      });
    }
  }),

  /**
    The raw data point nearest the mouse.graphX position
    @property nearestDataPoint
    @type Array
    @readonly
  */
  nearestDataPoint: computed('source', 'mouse.graphX', {
    get() {
      let mouseX = this.get('mouseX');
      let source = this.get('source');
      return source ? source.getDataNearXRange(mouseX) : undefined;
    }
  }),

  /**
    The x domain value at the nearest data point to the mouse position
    along the x axis.
    @property x
    @readonly
  */
  x: computed('nearestDataPoint', {
    get() {
      let nearestDataPoint = this.get('nearestDataPoint');
      this._x =  nearestDataPoint ? nearestDataPoint[0] : undefined;
      return this._x;
    }
  }),

  /**
    The y domain value at the nearest data point to the mouse position
    along the x axis.
    @property y
    @readonly
  */
  y: computed('nearestDataPoint', {
    get() {
      let nearestDataPoint = this.get('nearestDataPoint');
      this._y = nearestDataPoint ? nearestDataPoint[1] : undefined;
      return this._y;
    }
  }),

  /**
    The data carried by the nearest data point to the mouse position
    along the x axis.
    @property data
    @readonly
  */
  data: reads('nearestDataPoint.data'),
});