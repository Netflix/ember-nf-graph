/* exported format */

import Ember from 'ember';

const {
  isPresent
} = Ember;

export function format([ ms ]) {
  if(isNaN(ms) || !isPresent(ms)) {
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
}

export default Ember.Helper.helper(format);
