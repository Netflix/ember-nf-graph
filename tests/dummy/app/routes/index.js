import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return d3.range(10).map(n => ({
      x: n,
      y: Math.floor(Math.random() * 30)
    }));
  }
});