import Ember from 'ember';

/**
  @namespace mixins
  @class graph-registered-graphic
  @extends Ember.Mixin
*/
export default Ember.Mixin.create({

  /**
    calls {{#crossLink "components.nf-graph/registerGraphic"}}{{/crossLink}} on
    `didInsertElement`.
    @method _registerGraphic
    @private
  */
  _registerGraphic: Ember.on('didInsertElement', function() {
    var graph = this.get('graph');
    if(graph) {
      graph.registerGraphic(this);
    }
  }),

  /**
    calls {{#crossLink "components.nf-graph/unregisterGraphic"}}{{/crossLink}} on
    `didInsertElement`.
    @method _unregisterGraphic
    @private
  */
  _unregisterGraphic: Ember.on('willDestroyElement', function(){
    var graph = this.get('graph');
    if(graph) {
      graph.unregisterGraphic(this);
    }
  })
});