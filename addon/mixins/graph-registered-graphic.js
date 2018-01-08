import { on } from '@ember/object/evented';
import Mixin from '@ember/object/mixin';

/**
  @namespace mixins
  @class graph-registered-graphic
  @extends Ember.Mixin
*/
export default Mixin.create({
  init() {
    this._super(...arguments);
    let graph = this.get('graph');

    if (graph) {
      graph.registerGraphic(this);
    }
  },

  /**
    calls {{#crossLink "components.nf-graph/unregisterGraphic"}}{{/crossLink}} on
    `didInsertElement`.
    @method _unregisterGraphic
    @private
  */
  _unregisterGraphic: on('willDestroyElement', function(){
    let graph = this.get('graph');

    if (graph) {
      graph.unregisterGraphic(this);
    }
  })
});
