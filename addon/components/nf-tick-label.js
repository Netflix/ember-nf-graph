import Ember from 'ember';
import layout from 'ember-nf-graph/templates/components/nf-tick-label';

export default Ember.Component.extend({
  layout,
  tagName: 'g',

  attributeBindings: ['transform'],

  transform: Ember.computed('x', 'y', function(){
    let x = this.get('x');
    let y = this.get('y');
    return `translate(${x} ${y})`;
  }),

  className: 'nf-tick-label'
});
