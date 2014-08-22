import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import DataGraphic from '../mixins/graph-data-graphic';

export default Ember.Component.extend(HasGraphParent, DataGraphic, {
	tagName: 'g',

	classNames: ['nf-plots'],
	
	parentController: Ember.computed.alias('templateData.view.controller'),

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
});