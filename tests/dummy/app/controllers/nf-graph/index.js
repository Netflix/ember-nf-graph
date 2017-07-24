import Ember from 'ember';

const {
  $,
  Logger
} = Ember;

export function generateLineData(xStart, yMin, yMax, variance, count, yStart){
  var p = yStart || 0;
  return Ember.A(
    range(count).map(function(d, i) {
      var y = p + (Math.random() * variance) - (variance / 2);
      y = Math.min(yMax, Math.max(yMin, y));
      p = y;
      return {
        x: xStart + i,
        y: y
      };
    })
  );
}

function range(count) {
  var output = Ember.A();
  var i = 0;
  while(i < count) {
    output.push(i++);
  }
  return output;
}

export default Ember.Controller.extend({
  graphWidth: 400,
  graphHeight: 300,
  diffA: 100,
  diffB: 200,

  queryParams: Ember.A(['graphWidth' , 'graphHeight']),

  init(){
    this._super(...arguments);
    this.send('updateLine');
  },

  xTickFilter: function() {
    return true;
  },

  xTickFactory: function() {
    var ticks = Ember.A([1, 10, 30, 50, 80, 99]);

    return ticks;
  },

  actions: {
    updateAreas() {
      this.set('model.area1', generateLineData(0, 0, 50, 20, 10));
      this.set('model.area2', generateLineData(0, 51, 100, 20, 10));
      this.set('model.area3', generateLineData(0, 101, 150, 20, 10));
    },

    updateLine: function(){
      this.set('lineData', generateLineData(0, 0, 200, 50, 10, 10));
    },

    brushStart: function(e) {
      Logger.debug('brush start', e.left.get('x'), e.right.get('x'));
      this.set('brushLeft', e.left.get('x'));
      this.set('brushRight', e.right.get('x'));
    },

    brush: function(e) {
      Logger.debug('brush ', e.left.get('x'), e.right.get('x'));
      this.set('brushLeft', e.left.get('x'));
      this.set('brushRight', e.right.get('x'));
    },

    brushEnd: function(e) {
      Logger.debug('brush end', e.left.get('x'), e.right.get('x'));
      this.set('brushLeft', undefined);
      this.set('brushRight', undefined);
    },

    test: function(){
      Logger.log('test!');
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

      Logger.log('showData', e);
    },
  }
});
