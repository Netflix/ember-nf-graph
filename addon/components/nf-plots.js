import Ember from 'ember';
import layout from 'ember-nf-graph/templates/components/nf-plots';
import DataGraphic from 'ember-nf-graph/mixins/graph-data-graphic';
import RequireScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';

export default Ember.Component.extend(DataGraphic, RequireScaleSource, {
  layout,
  tagName: 'g',

  classNames: ['nf-plots'],

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  /**
    The model for adding plots to the graph
    @property plotData
    @readonly
    @private
  */
  plotData: Ember.computed('renderedData.[]', function(){
    let renderedData = this.get('renderedData');
    if(renderedData && Ember.isArray(renderedData)) {
      return Ember.A(renderedData.map(function(d) {
        return {
          x: d[0],
          y: d[1],
          data: d.data,
        };
      }));
    }
  }),


  actions: {
    itemClicked: function(e) {
      this.sendAction('action', e);
    },
  },
});
