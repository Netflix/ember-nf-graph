import Ember from 'ember';
import HasGraphParent from 'ember-cli-ember-dvc/mixins/graph-has-graph-parent';
import DataGraphic from 'ember-cli-ember-dvc/mixins/graph-data-graphic';
import RequireScaleSource from 'ember-cli-ember-dvc/mixins/graph-requires-scale-source';

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
	plotData: function(){
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
	}.property('renderedData.@each'),


	actions: {
		itemClicked: function(e) {
			this.sendAction('action', e);
		},
	},
});