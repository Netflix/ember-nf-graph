import { schedule } from '@ember/runloop';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from 'ember-nf-graph/templates/components/nf-bars-group';
import RequiresScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';

export default Component.extend(RequiresScaleSource, {
  layout,
  tagName: 'g',

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  groupPadding: 0.1,

  groupOuterPadding: 0,

  // either b-arses or fat, stupid hobbitses
  barses: computed(function(){
    return A();
  }),

  registerBars: function(bars) {
    schedule('afterRender', () => {
      let barses = this.get('barses');
      barses.pushObject(bars);
      bars.set('group', this);
      bars.set('groupIndex', barses.length - 1);
    });
  },

  unregisterBars: function(bars) {
    if(bars) {
      schedule('afterRender', () => {
        bars.set('group', undefined);
        bars.set('groupIndex', undefined);
        this.get('barses').removeObject(bars);
      });
    }
  },

  groupWidth: computed('xScale', function(){
    let xScale = this.get('xScale');
    return xScale && xScale.rangeBand ? xScale.rangeBand() : NaN;
  }),

  barsDomain: computed('barses.[]', function(){
    let len = this.get('barses.length') || 0;
    return d3.range(len);
  }),

  barScale: computed(
    'groupWidth',
    'barsDomain.[]',
    'groupPadding',
    'groupOuterPadding',
    function(){
      let barsDomain = this.get('barsDomain');
      let groupWidth = this.get('groupWidth');
      let groupPadding = this.get('groupPadding');
      let groupOuterPadding = this.get('groupOuterPadding');
      return d3.scale.ordinal()
        .domain(barsDomain)
        .rangeBands([0, groupWidth], groupPadding, groupOuterPadding);
    }
  ),

  barsWidth: function() {
    let scale = this.get('barScale');
    return scale && scale.rangeBand ? scale.rangeBand() : NaN;
  },
});
