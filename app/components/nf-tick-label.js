import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'g',

  attributeBindings: ['transform'],

  transform: Ember.computed('x', 'y', function(){
    let x = this.get('x');
    let y = this.get('y');
    return `translate(${x} ${y})`;
  }),

  className: 'nf-tick-label'
});
