import { isArray, A } from '@ember/array';
import { oneWay } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from 'ember-nf-graph/templates/components/nf-bars';
import DataGraphic from 'ember-nf-graph/mixins/graph-data-graphic';
import RegisteredGraphic from 'ember-nf-graph/mixins/graph-registered-graphic';
import parsePropExpr from 'ember-nf-graph/utils/parse-property-expression';
import RequireScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';
import GraphicWithTrackingDot from 'ember-nf-graph/mixins/graph-graphic-with-tracking-dot';
import { normalizeScale } from 'ember-nf-graph/utils/nf/scale-utils';
import { getRectPath } from 'ember-nf-graph/utils/nf/svg-dom';

/**
  Adds a bar graph to an `nf-graph` component.

  **Requires the graph has `xScaleType === 'ordinal'`***

  ** `showTrackingDot` defaults to `false` in this component **

  @namespace components
  @class nf-bars
  @extends Ember.Component
  @uses mixins.graph-registered-graphic
  @uses mixins.graph-data-graphic
  @uses mixins.graph-requires-scale-source
  @uses mixins.graph-graphic-with-tracking-dot
*/
export default Component.extend(RegisteredGraphic, DataGraphic, RequireScaleSource, GraphicWithTrackingDot, {
  layout,
  tagName: 'g',

  classNames: ['nf-bars'],

  _showTrackingDot: false,

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  /**
    The name of the property on each data item containing the className for the bar rectangle
    @property classprop
    @type String
    @default 'className'
  */
  classprop: 'className',

  /**
    Gets the function to get the classname from each data item.
    @property getBarClass
    @readonly
    @private
  */
  getBarClass: computed('classprop', function() {
    let classprop = this.get('classprop');
    return classprop ? parsePropExpr(classprop) : null;
  }),

  /**
    The nf-bars-group this belongs to, if any.
    @property group
    @type components.nf-bars-group
    @default null
  */
  group: null,

  /**
    The index of this component within the group, if any.
    @property groupIndex
    @type Number
    @default null
  */
  groupIndex: null,

  /**
    The graph content height
    @property graphHeight
    @type Number
    @readonly
  */
  graphHeight: oneWay('graph.graphHeight'),

  /**
    A scale provided by nf-bars-group to offset the bar rectangle output
    @property barScale
    @type d3.scale
    @readonly
  */
  barScale: oneWay('group.barScale'),

  /**
    The width of each bar.
    @property barWidth
    @type Number
    @readonly
  */
  barWidth: computed('xScale', 'barScale', function(){
    let barScale = this.get('barScale');
    if(barScale) {
      return barScale.rangeBand();
    }
    let xScale = this.get('xScale');
    return xScale && xScale.rangeBand ? xScale.rangeBand() : 0;
  }),

  groupOffsetX: computed('barScale', 'groupIndex', function(){
    let barScale = this.get('barScale');
    let groupIndex = this.get('groupIndex');
    return normalizeScale(barScale, groupIndex);
  }),

  /**
    The bar models used to render the bars.
    @property bars
    @readonly
  */
  bars: computed(
    'xScale',
    'yScale',
    'renderedData.[]',
    'graphHeight',
    'getBarClass',
    'barWidth',
    'groupOffsetX',
    function(){
      let { renderedData, xScale, yScale, barWidth, graphHeight, getBarClass, groupOffsetX } =
        this.getProperties('renderedData', 'xScale', 'yScale', 'graphHeight', 'getBarClass', 'groupOffsetX', 'barWidth');

      let getRectPath = this._getRectPath;

      if(!xScale || !yScale || !isArray(renderedData)) {
        return null;
      }

      let w = barWidth;

      return A(renderedData.map(function(data) {
        let className = 'nf-bars-bar' + (getBarClass ? ' ' + getBarClass(data.data) : '');
        let x = normalizeScale(xScale, data[0]) + groupOffsetX;
        let y = normalizeScale(yScale, data[1]);
        let h = graphHeight - y;
        let path = getRectPath(x, y, w, h);

        return { path, className, data };
      }));
    }
  ),

  _getRectPath: getRectPath,

  /**
    The name of the action to fire when a bar is clicked.
    @property barClick
    @type String
    @default null
  */
  barClick: null,

  init() {
    this._super(...arguments);
    let group = this.get('group');
    if(group && group.registerBars) {
      group.registerBars(this);
    }
  },

  actions: {
    nfBarClickBar: function(dataPoint) {
      if(this.get('barClick')) {
        this.sendAction('barClick', {
          data: dataPoint.data,
          x: dataPoint[0],
          y: dataPoint[1],
          source: this,
          graph: this.get('graph'),
        });
      }
    }
  }

});
