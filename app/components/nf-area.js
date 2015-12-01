import Ember from 'ember';
import Selectable from 'ember-nf-graph/mixins/graph-selectable-graphic';
import HasGraphParent from 'ember-nf-graph/mixins/graph-has-graph-parent';
import RegisteredGraphic from 'ember-nf-graph/mixins/graph-registered-graphic';
import DataGraphic from 'ember-nf-graph/mixins/graph-data-graphic';
import AreaUtils from 'ember-nf-graph/mixins/graph-area-utils';
import GraphicWithTrackingDot from 'ember-nf-graph/mixins/graph-graphic-with-tracking-dot';
import RequireScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';
import LineUtils from 'ember-nf-graph/mixins/graph-line-utils';

/**
  Adds an area graph to an `nf-graph` component.

  Optionally, if it's located within an `nf-area-stack` component, it will work with
  sibling `nf-area` components to create a stacked graph.
  @namespace components
  @class nf-area
  @extends Ember.Component
  @uses mixins.graph-area-utils
  @uses mixins.graph-has-graph-parent
  @uses mixins.graph-selectable-graphic
  @uses mixins.graph-registered-graphic
  @uses mixins.graph-data-graphic
  @uses mixins.graph-graphic-with-tracking-dot
  @uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, RegisteredGraphic, DataGraphic,
  Selectable, AreaUtils, GraphicWithTrackingDot, RequireScaleSource, LineUtils, {

    tagName: 'g',

    classNameBindings: [':nf-area', 'selected', 'selectable'],

    /**
      The type of d3 interpolator to use to create the area
      @property interpolator
      @type String
      @default 'linear'
    */
    interpolator: 'linear',

    /**
      The previous area in the stack, if this area is part of an `nf-area-stack`
      @property prevArea
      @type components.nf-area
      @default null
    */
    prevArea: null,

    /**
      The next area in the stack, if this area is part of an `nf-area-stack`
      @property nextArea
      @type components.nf-area
      @default null
    */
    nextArea: null,

    init() {
      this._super(...arguments);
      var stack = this.nearestWithProperty('isAreaStack');
      if(stack) {
        stack.registerArea(this);
        this.set('stack', stack);
      }
    },

    /**
      Override from `graph-data-graphic` mixin
      @method getActualTrackData
    */
    getActualTrackData(renderX, renderY, data) {
      return {
        x: this.get('xPropFn')(data),
        y: this.get('yPropFn')(data)
      };
    },

    _unregisterArea: Ember.on('willDestroyElement', function(){
      var stack = this.get('stack', stack);
      if(stack) {
        stack.unregisterArea(this);
      }
    }),

    /**
      The computed set of next y values to use for the "bottom" of the graphed area.
      If the area is part of a stack, this will be the "top" of the next area in the stack,
      otherwise it will return an array of values at the "bottom" of the graph domain.
      @property nextYData
      @type Array
      @readonly
    */
    nextYData: Ember.computed('data.length', 'nextArea.data.[]', function(){
      var data = this.get('data');
      if(!Array.isArray(data)) {
        return [];
      }
      var nextData = this.get('nextArea.mappedData');
      return data.map((d, i) => (nextData && nextData[i] && nextData[i][1]) || Number.MIN_VALUE);
    }),

    /**
      The current rendered data "zipped" together with the nextYData.
      @property mappedData
      @type Array
      @readonly
    */
    mappedData: Ember.computed('data.[]', 'xPropFn', 'yPropFn', 'nextYData.[]', 'stack.aggregate', function() {
      var { data, xPropFn, yPropFn, nextYData } = this.getProperties('data', 'xPropFn', 'yPropFn', 'nextYData');
      var aggregate = this.get('stack.aggregate');
      if(Array.isArray(data)) {
        return data.map((d, i) => {
          var x = xPropFn(d);
          var y = yPropFn(d);
          var result = aggregate ? [x, y + nextYData[i], nextYData[i]] : [x, y, nextYData[i]];
          result.data = d;
          return result;
        });
      } else {
        return [];
      }
    }),

    areaFn: Ember.computed('xScale', 'yScale', 'interpolator', function(){
      var { xScale, yScale, interpolator } = this.getProperties('xScale', 'yScale', 'interpolator');
      return this.createAreaFn(xScale, yScale, interpolator);
    }),

    lineFn: Ember.computed('xScale', 'yScale', 'interpolator', function(){
      var { xScale, yScale, interpolator } = this.getProperties('xScale', 'yScale', 'interpolator');
      return this.createLineFn(xScale, yScale, interpolator);
    }),

    d: Ember.computed('renderedData', 'areaFn', function(){
      var renderedData = this.get('renderedData');
      return this.get('areaFn')(renderedData);
    }),

    dLine: Ember.computed('renderedData', 'lineFn', function(){
      var renderedData = this.get('renderedData');
      return this.get('lineFn')(renderedData);
    }),

    click: function(){
      if(this.get('selectable')) {
        this.toggleProperty('selected');
      }
    }
  });
