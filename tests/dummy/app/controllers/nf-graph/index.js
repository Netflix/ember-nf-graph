import Ember from 'ember';

function generateLineData(xStart, yMin, yMax, variance, count, yStart){
  var p = yStart || 0;
  return range(count).map(function(d, i) {
    var y = p + (Math.random() * variance) - (variance / 2);
    y = Math.min(yMax, Math.max(yMin, y));
    p = y;
    return {
      x: xStart + i,
      y: y
    };
  });
}


function range(count) {
  var output = Ember.A();
  var i = 0;
  while(i < count) {
    output.push(i++);
  }
  return output;
}

export default Ember.ObjectController.extend({
  graphWidth: 400,
  graphHeight: 300,

  queryParams: Ember.A(['graphWidth']),
  
  xTickFilter: function() {
    return true;
  },

  xTickFactory: function() {
    var ticks = Ember.A([1, 10, 30, 50, 80, 99]);

    return ticks;
  },

  diffA: 100,
  diffB: 200,

  fooData: null,

  actions: {
    loadNewData: function(){
      this.set('lineData', generateLineData(0, 0, 2000, 200, 240, 500));
    },

    brushStart: function(e) {
      console.debug('brush start', e.left.get('x'), e.right.get('x'));
      this.set('brushLeft', e.left.get('x'));
      this.set('brushRight', e.right.get('x'));
    },
    
    brush: function(e) {
      console.debug('brush ', e.left.get('x'), e.right.get('x'));
      this.set('brushLeft', e.left.get('x'));
      this.set('brushRight', e.right.get('x'));
    },

    brushEnd: function(e) {
      console.debug('brush end', e.left.get('x'), e.right.get('x'));
      this.set('brushLeft', undefined);
      this.set('brushRight', undefined);
    },

    test: function(){
      console.log('test!');
    },

    appendAreaData: function(area) {
      var last = area[area.length - 1];
      area.pushObject({ x: last.x + 1, y: last.y });
    },

    showData: function(e) {
      $('.test-div').remove();
      var testDiv = $('<div class="test-div"/>');

      testDiv.css({
        width: 'auto',
        height: 'auto',
        padding: '10px',
        background: 'white',
        position: 'absolute',
        top: e.get('pagePositionY') + 'px',
        left: e.get('pagePositionX') + 'px',
      });

      testDiv.text(e.data.y);

      testDiv.appendTo('body');

      console.log('showData', e);
    },
  }
});