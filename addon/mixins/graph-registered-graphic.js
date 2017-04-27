import Ember from 'ember';

/**
  @namespace mixins
  @class graph-registered-graphic
  @extends Ember.Mixin
*/
export default Ember.Mixin.create({

  init() {
    this._super(...arguments);
    let graph = this.get('graph');
    if(graph) {
      graph.registerGraphic(this);
    }
  },

  /**
    calls {{#crossLink "components.nf-graph/unregisterGraphic"}}{{/crossLink}} on
    `didInsertElement`.
    @method _unregisterGraphic
    @private
  */
  _unregisterGraphic: Ember.on('willDestroyElement', function(){
    let graph = this.get('graph');
    if(graph) {
      graph.unregisterGraphic(this);
    }
  })
});