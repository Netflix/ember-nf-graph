import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import RequireScaleSource from '../mixins/graph-requires-scale-source';

export default Ember.Component.extend(HasGraphParent, RequireScaleSource, {
	tagName: 'g',
	
	isScaleSource: true,
});