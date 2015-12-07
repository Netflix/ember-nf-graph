import Ember from 'ember';
import nearestWithProperty from 'ember-nf-graph/shims/nearest-with-property';

/**
  Adds initialization code to graph the `nf-graph` parent
  to a component that is to be contained in an `nf-graph`.

  @namespace mixins
  @class graph-has-graph-parent
  */
export default Ember.Mixin.create({

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  /**
    Initalization method that gets the `nf-graph` parent
    and assigns it to `graph`
    NOTE: all object that mixin and have init, must call super.init()
    @method init
    */

  init() {
    this._super(...arguments);
    var graph = this.get('graph') || nearestWithProperty('isGraph',this);
    this.set('graph', graph);
  }

});
