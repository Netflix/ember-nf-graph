import Ember from 'ember';
import HasGraphParent from 'ember-cli-nf-graph/mixins/graph-has-graph-parent';
import DataGraphic from 'ember-cli-nf-graph/mixins/graph-data-graphic';
import RequireScaleSource from 'ember-cli-nf-graph/mixins/graph-requires-scale-source';

export default Ember.Component.extend(HasGraphParent, DataGraphic, RequireScaleSource, {
  tagName: 'g',

  classNames: ['nf-plots'],
  
  /**
    The parent controller to use for template binding
    @property parentController
    @type Ember.Controller
    @readonly
    @private
  */
  parentController: Ember.computed.alias('templateData.view.controller'),

  /**
    The model for adding plots to the graph
    @property plotData
    @readonly
    @private
  */
  plotData: Ember.computed('renderedData.@each', function(){
    var renderedData = this.get('renderedData');
    if(renderedData && Ember.isArray(renderedData)) {
      return renderedData.map(function(d) {
        return {
          x: d[0],
          y: d[1],
          data: d.data,
        };
      });
    }
  }),


  actions: {
    itemClicked: function(e) {
      this.sendAction('action', e);
    },
  },
});