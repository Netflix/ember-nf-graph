import Ember from 'ember';
import HasGraphParent from 'ember-cli-nf-graph/mixins/graph-has-graph-parent';
import RequiresScaleSource from 'ember-cli-nf-graph/mixins/graph-requires-scale-source';

export default Ember.Component.extend(HasGraphParent, RequiresScaleSource, {
	tagName: 'g',

	isBarsGroup: true,

	groupPadding: 0.1,

	groupOuterPadding: 0,

	// either b-arses or fat, stupid hobbitses
	barses: function(){
		return [];
	}.property(),

	registerBars: function(bars) {
		var barses = this.get('barses');
		barses.pushObject(bars);
		bars.set('group', this);
		bars.set('groupIndex', barses.length - 1);
	},

	unregisterBars: function(bars) {
		if(bars) {
			bars.set('group', undefined);
			bars.set('groupIndex', undefined);
			this.get('barses').removeObject(bars);
		}
	},

	groupWidth: function(){
		var xScale = this.get('xScale');
		return xScale && xScale.rangeBand ? xScale.rangeBand() : NaN;
	}.property('xScale'),

	barsDomain: function(){
		var len = this.get('barses.length') || 0;
		return d3.range(len);
	}.property('barses.[]'),

	barScale: function(){
		var barsDomain = this.get('barsDomain');
		var groupWidth = this.get('groupWidth');
		var groupPadding = this.get('groupPadding');
		var groupOuterPadding = this.get('groupOuterPadding');
		return d3.scale.ordinal()
			.domain(barsDomain)
			.rangeBands([0, groupWidth], groupPadding, groupOuterPadding);
	}.property('groupWidth', 'barsDomain.[]', 'groupPadding', 'groupOuterPadding'),

	barsWidth: function() {
		var scale = this.get('barScale');
		return scale && scale.rangeBand ? scale.rangeBand() : NaN;
	},
});