import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('nf-dot', { integration: true });

test('can render', function(assert) {
  this.render(hbs`
    {{#nf-graph}}
      {{nf-dot x=1 y=1 class="my-dot"}}
    {{/nf-graph}}
  `);
  assert.equal(this.$('.my-dot').length, 1, "Found dot");
});
