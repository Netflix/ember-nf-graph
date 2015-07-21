/* exported format */

import Ember from 'ember';

var format = function(ms) {

  if(isNaN(ms) || ms === null || typeof ms === 'undefined') {
    return "";
  }

  var date = new Date(ms);
  var h = date.getHours();
  var m = date.getMinutes();

  if(h < 10) {
    h = "0" + h;
  }

  if(m < 10) {
    m = "0" + m;
  }

  return h + ":" + m;
};

export default Ember.Handlebars.makeBoundHelper(function(ms) {
  return format(ms);
});

export { format };