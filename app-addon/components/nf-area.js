import Ember from 'ember';
import Selectable from '../mixins/graph-selectable-graphic';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import RegisteredGraphic from '../mixins/graph-registered-graphic';
import DataGraphic from '../mixins/graph-data-graphic';
import AreaUtils from '../mixins/graph-area-utils';
import GraphicWithTrackingDot from '../mixins/graph-graphic-with-tracking-dot';
import DataPositionUtils from '../mixins/graph-data-position-utils';

export default Ember.Component.extend(HasGraphParent, RegisteredGraphic, DataGraphic, 
  Selectable, AreaUtils, GraphicWithTrackingDot, DataPositionUtils, {    

    tagName: 'g',
    // templateName: 'ember-cli-ember-dvc/components/graph-area',
    
    classNameBindings: [':nf-area', 'isSelected:selected', 'selectable'],

    interpolator: 'monotone',
    nextStrip: null,
    prevStrip: null,

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


    nextYData: function() {
      var nextStripData = this.get('nextArea.visibleData');
      
      if(nextStripData) {
        return nextStripData.map(function(d) {
          return d[1];
        });
      }

      var graphYMin = this.get('graph.yMin');
      var graphLength = this.get('visibleData.length');
      var result = [];
      var i;
      for(i = 0; i < graphLength; i++){
        result.push(graphYMin);
      }
      return result;
    }.property('visibleData.length', 'graph.yMin', 'nextArea.visibleData'),


    areaData: function(){
      var visibleData = this.get('visibleData');
      var nextYData = this.get('nextYData');

      if(nextYData) {
        return visibleData.map(function(d, i) {
          return d.concat(nextYData[i]);
        });
      }
    }.property('visibleData', 'nextYData'),


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
        this.toggleSelected();
      }
    }
  });
