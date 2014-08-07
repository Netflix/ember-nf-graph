import Ember from 'ember';
import { backedProperty } from '../utils/computed-property-helpers';

/**
 * @namespace mixins
 * @class graph-selectable-graphic
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
  _selected: false,
  selectable: false,

  selected: backedProperty('_selected'),

  /**
    @property isSelected
    @deprecated use `selected`
  */
  isSelected: Ember.computed.alias('selected'),

  _updateGraphSelected: function() {
    var selected = this.get('selected');
    var graph = this.get('graph');
    if(selected) {
      graph.selectGraphic(this);
    } else {
      graph.deselectGraphic(this);
    }
  }.observes('selected').on('didInsertElement'),
});