/* eslint-disable no-console */
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    barClicked: function(barData) {
      console.log('barData', barData);
    },
  }
});
