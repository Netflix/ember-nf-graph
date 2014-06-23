import Ember from 'ember';
export default Ember.Mixin.create({
  selected: false,
  selectable: false,

  isSelected: function(){
    return this === this.get('graph.selected');
  }.property('graph.selected'),

  toggleSelected: function(){
    var graphSelected = this.get('graph.selected');
    
    if(graphSelected === this) {
      this.set('selected', false);
      this.set('graph.selected', null);
    } else {
      this.set('selected', true);
      this.set('graph.selected', this);
    }
    if(graphSelected) {
      graphSelected.set('selected', false);
    }
    this.get('isSelected');
  },
});