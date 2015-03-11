import Ember from 'ember';
import HasGraphParent from 'ember-cli-ember-dvc/mixins/graph-has-graph-parent';
import RequiresScaleSource from 'ember-cli-ember-dvc/mixins/graph-requires-scale-source';

export default Ember.Component.extend(HasGraphParent, RequiresScaleSource, {
	tagName: 'g',

	left: undefined,

	right: undefined,

	formatter: null,

	_updateLeftText: function(){
		var display = this.get('leftDisplay');
		var text = this.$('.nf-brush-selection-left-text');
		var bg = this.$('.nf-brush-selection-left-text-bg');

		if(!display) {
			text.hide();
			bg.hide();
		} else {
			text.show();
			bg.show();
		}
		
		text.text(display);
		var texte = d3.select(text[0]);
		texte.attr('x', this.get('leftX'))
			.attr('y', this.get('graphHeight'));
			
		var bbox = text[0].getBBox();
		var bge = d3.select(bg[0]);
		bge.attr('width', bbox.width);
		bge.attr('height', bbox.height);
		bge.attr('x', bbox.x);
		bge.attr('y', bbox.y);
	}.observes('left').on('didInsertElement'),

	_updateRightText: function(){
		var display = this.get('rightDisplay');
		var text = this.$('.nf-brush-selection-right-text');
		var bg = this.$('.nf-brush-selection-right-text-bg');

		if(!display) {
			text.hide();
			bg.hide();
		} else {
			text.show();
			bg.show();
		}

		text.text(display);
		var texte = d3.select(text[0]);
		texte.attr('x', this.get('rightX'))
			.attr('y', this.get('graphHeight'));

		var bbox = text[0].getBBox();
		var bge = d3.select(bg[0]);
		bge.attr('width', bbox.width);
		bge.attr('height', bbox.height);
		bge.attr('x', bbox.x);
		bge.attr('y', bbox.y);
	}.observes('right').on('didInsertElement'),

	leftDisplay: function(){
		var formatter = this.get('formatter');
		var left = this.get('left');
		return formatter ? formatter(left) : left;
	}.property('left', 'formatter'),

	rightDisplay: function(){
		var formatter = this.get('formatter');
		var right = this.get('right');
		return formatter ? formatter(right) : right;
	}.property('right', 'formatter'),

	isVisible: function(){
		var left = +this.get('left');
		var right = +this.get('right');
		return left === left && right === right;
	}.property('left', 'right'),

	leftX: function() {
		var left = this.get('left') || 0;
		var scale = this.get('xScale');
		return scale ? scale(left) : 0; 
	}.property('xScale', 'left'),

	rightX: function() {
		var right = this.get('right') || 0;
		var scale = this.get('xScale');
		return scale ? scale(right) : 0;
	}.property('xScale', 'right'),

	graphWidth: Ember.computed.alias('graph.graphWidth'),
	
	graphHeight: Ember.computed.alias('graph.graphHeight'),

	rightWidth: function() {
		return (this.get('graphWidth') - this.get('rightX')) || 0;
	}.property('rightX', 'graphWidth'),
});