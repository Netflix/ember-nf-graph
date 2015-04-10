import Ember from 'ember';
import Selectable from 'ember-cli-nf-graph/mixins/graph-selectable-graphic';
import HasGraphParent from 'ember-cli-nf-graph/mixins/graph-has-graph-parent';
import RegisteredGraphic from 'ember-cli-nf-graph/mixins/graph-registered-graphic';
import DataGraphic from 'ember-cli-nf-graph/mixins/graph-data-graphic';
import AreaUtils from 'ember-cli-nf-graph/mixins/graph-area-utils';
import GraphicWithTrackingDot from 'ember-cli-nf-graph/mixins/graph-graphic-with-tracking-dot';
import RequireScaleSource from 'ember-cli-nf-graph/mixins/graph-requires-scale-source';

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
  Selectable, AreaUtils, GraphicWithTrackingDot, RequireScaleSource, {    

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

    _checkForAreaStackParent: Ember.on('init', function() {
      var stack = this.nearestWithProperty('isAreaStack');
      if(stack) {
        stack.registerArea(this);
        this.set('stack', stack);
      }
    }),

    _unregister: Ember.on('willDestroyElement', function(){
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
    nextYData: Ember.computed('renderedData.@each', 'nextArea.renderedData.@each', function(){
      var renderedData = this.get('renderedData');
      var nextData = this.get('nextArea.renderedData') || [];
        
      var result = nextData.map(function(next) {
        return next[1];
      });
      
      while(result.length < renderedData.length) {
        result.push(-99999999);
      }

      return result;
    }),

    /**
      The current rendered data "zipped" together with the nextYData.
      @property areaData
      @type Array
      @readonly
    */
    areaData: Ember.computed('renderedData.@each', 'nextYData.@each', function(){
      var nextYData = this.get('nextYData');
      return this.get('renderedData').map(function(r, i) {
        return [r[0], r[1], nextYData[i]];
      });
    }),


    /**
      Gets the area function to use to create the area SVG path data
      @property areaFn
      @type Function
      @readonly
    */
    areaFn: Ember.computed('xScale', 'yScale', 'interpolator', function(){
      var xScale = this.get('xScale');
      var yScale = this.get('yScale');
      var interpolator = this.get('interpolator');
      return this.createAreaFn(xScale, yScale, interpolator);
    }),

    /**
      The SVG path data for the area
      @property d
      @type String
      @readonly
    */
    d: Ember.computed('areaData', 'areaFn', function(){
      return this.get('areaFn')(this.get('areaData'));
    }),

    click: function(){
      if(this.get('selectable')) {
        this.toggleProperty('selected');
      }
    }
  });
