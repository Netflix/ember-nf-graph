import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from 'ember-nf-graph/templates/components/nf-tick-label';

export default Component.extend({
  layout,
  tagName: 'g',

  attributeBindings: ['transform'],

  transform: computed('x', 'y', function(){
    let x = this.get('x');
    let y = this.get('y');
    return `translate(${x} ${y})`;
  }),

  className: 'nf-tick-label'
});
