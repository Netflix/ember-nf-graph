import Ember from 'ember';
import HasGraphParent from 'ember-nf-graph/mixins/graph-has-graph-parent';
import RequiresScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';

export default Ember.Component.extend(HasGraphParent, RequiresScaleSource, {
  tagName: 'g',

  isBarsGroup: true,

  groupPadding: 0.1,

  groupOuterPadding: 0,

  // either b-arses or fat, stupid hobbitses
  barses: Ember.computed(function(){
    return [];
  }),

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

  groupWidth: Ember.computed('xScale', function(){
    var xScale = this.get('xScale');
    return xScale && xScale.rangeBand ? xScale.rangeBand() : NaN;
  }),

  barsDomain: Ember.computed('barses.[]', function(){
    var len = this.get('barses.length') || 0;
    return d3.range(len);
  }),

  barScale: Ember.computed(
    'groupWidth',
    'barsDomain.[]',
    'groupPadding',
    'groupOuterPadding',
    function(){
      var barsDomain = this.get('barsDomain');
      var groupWidth = this.get('groupWidth');
      var groupPadding = this.get('groupPadding');
      var groupOuterPadding = this.get('groupOuterPadding');
      return d3.scale.ordinal()
        .domain(barsDomain)
        .rangeBands([0, groupWidth], groupPadding, groupOuterPadding);
    }
  ),

  barsWidth: function() {
    var scale = this.get('barScale');
    return scale && scale.rangeBand ? scale.rangeBand() : NaN;
  },
});