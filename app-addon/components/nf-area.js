import Ember from 'ember';
import Selectable from '../mixins/graph-selectable-graphic';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import RegisteredGraphic from '../mixins/graph-registered-graphic';
import DataGraphic from '../mixins/graph-data-graphic';
import AreaUtils from '../mixins/graph-area-utils';
import GraphicWithTrackingDot from '../mixins/graph-graphic-with-tracking-dot';
import DataPositionUtils from '../mixins/graph-data-position-utils';

import { property } from '../utils/computed-property-helpers';

/**
 * Adds an area graph to an `nf-graph` component.
 * 
 * Optionally, if it's located within an `nf-area-stack` component, it will work with
 * sibling `nf-area` components to create a stacked graph.
 * @namespace components
 * @class nf-area
 * @extends Ember.Component
 * @uses mixins.graph-area-utils
 * @uses mixins.graph-has-graph-parent
 * @uses mixins.graph-selectable-graphic
 * @uses mixins.graph-registered-graphic
 * @uses mixins.graph-data-graphic
 * @uses mixins.graph-graphic-with-tracking-dot
 * @uses mixins.graph-data-position-utils
 */
export default Ember.Component.extend(HasGraphParent, RegisteredGraphic, DataGraphic, 
  Selectable, AreaUtils, GraphicWithTrackingDot, DataPositionUtils, {    

    tagName: 'g',
    
    classNameBindings: [':nf-area', 'selected', 'selectable'],

    interpolator: 'monotone',

    prevArea: null,

    nextArea: null,

    _checkForAreaStackParent: function() {
      var stack = this.nearestWithProperty('isAreaStack');
      if(stack) {
        stack.registerArea(this);
        this.set('stack', stack);
      }
    }.on('init'),

    _unregister: function(){
      var stack = this.get('stack', stack);
      if(stack) {
        stack.unregisterArea(this);
      }
    }.on('willDestroyElement'),

    nextYData: property('renderedData.@each', 'graph.yMin', 'nextArea.renderedData.@each', 
      function(renderedData, yMin, nextRenderedData) { 
        var nextData = nextRenderedData || [];
        
        var result = nextData.map(function(next) {
          return next[1];
        });
        
        while(result.length < renderedData.length) {
          result.push(yMin);
        }

        return result;
      }
    ),

    areaData: property('renderedData.@each', 'nextYData.@each', function(renderedData, nextYData){
      return renderedData.map(function(r, i){
        return [r[0], r[1], nextYData[i]];
      });
    }),


    areaFn: function(){
      var xScale = this.get('graph.xScale');
      var yScale = this.get('graph.yScale');
      var interpolator = this.get('interpolator');
      return this.createAreaFn(xScale, yScale, interpolator);
    }.property('graph.xScale', 'graph.yScale', 'interpolator'),

    d: function(){
      return this.get('areaFn')(this.get('areaData'));
    }.property('areaData', 'areaFn'),

    click: function(){
      if(this.get('selectable')) {
        this.toggleProperty('selected');
      }
    }
  });
