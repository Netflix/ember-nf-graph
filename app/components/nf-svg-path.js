import Ember from 'ember';
import HasGraphParent from 'ember-nf-graph/mixins/graph-has-graph-parent';
import RequiresScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';
import { normalizeScale } from 'ember-nf-graph/utils/nf/scale-utils';
import SelectableGraphic from 'ember-nf-graph/mixins/graph-selectable-graphic';

/**
  An SVG path primitive that plots based on a graph's scale.
  @namespace components
  @class nf-svg-path
  @extends Ember.Component
  @uses mixins.graph-has-graph-parent
  @uses mixins.graph-requires-scale-source
  @uses mixins.graph-selectable-graphic
*/
export default Ember.Component.extend(HasGraphParent, RequiresScaleSource, SelectableGraphic, {
  type: 'path',

  classNameBindings: [':nf-svg-path', 'selectable', 'selected'],

  attributeBindings: ['d'],

  /**
    The array of points to use to plot the path. This is an array of arrays, in the following format:

          // specify path pen commands
          [
            [50, 50, 'L'],
            [100, 100, 'L']
          ]

          // or they will default to 'L'
          [
            [50, 50],
            [100, 100]
          ]

  @property points
  @type Array
  */
  points: null,

  /**
    The data points mapped to scale
    @property svgPoints
    @type Array
  */
  svgPoints: Ember.computed('points.[]', 'xScale', 'yScale', function(){
    let points = this.get('points');
    let xScale = this.get('xScale');
    let yScale = this.get('yScale');
    if(Ember.isArray(points) && points.length > 0) {
      return points.map(function(v) {
        let dx = normalizeScale(xScale, v[0]);
        let dy = normalizeScale(yScale, v[1]);
        let c = v.length > 2 ? v[2] : 'L';
        return [dx, dy, c];
      });
    } 
  }),

  click: function(){
    if(this.get('selectable')) {
      this.toggleProperty('selected');
    }
  },

  /**
    The raw svg path d attribute output
    @property d
    @type String
  */
  d: Ember.computed('svgPoints', function(){
    let svgPoints = this.get('svgPoints');
    if(Ember.isArray(svgPoints) && svgPoints.length > 0) {
      return svgPoints.reduce(function(d, pt, i) {
        if(i === 0) {
          d += 'M' + pt[0] + ',' + pt[1];
        }
        d += ' ' + pt[2] + pt[0] + ',' + pt[1];
        return d;
      }, '');
    } else {
      return 'M0,0';
    }
  }),
});