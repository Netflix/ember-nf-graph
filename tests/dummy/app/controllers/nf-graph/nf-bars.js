import Ember from 'ember';

export default Ember.Controller.extend({
  poop: null,
  
  data: Ember.computed(function() {
    var arr = Ember.A();
    var str = 'abcdefg';
    
    for(var i = 0, len = str.length; i < len; i++) {
      arr.push({
        x: str[i],
        y: (i+1) * 100,
        y2: Math.random() * 800,
        className2: 'foo-bar-2',
        className: 'foo-bar-' + (i % 3),
      });
    }
    
    return arr;
  }),

  actions: {
    barClicked: function(barData) {
      console.log('barData', barData);
    },
  }
});