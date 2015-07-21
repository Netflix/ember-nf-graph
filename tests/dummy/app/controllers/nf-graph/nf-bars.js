import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    barClicked: function(barData) {
      console.log('barData', barData);
    },
  }
});