import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    barClicked: function(barData) {
      Ember.Logger.log('barData', barData);
    },
  }
});
