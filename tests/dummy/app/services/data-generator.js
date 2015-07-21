var minutes = function(n) {
  return n * 60000;
};

var random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

var dataGenerator = {
  simpleTimeSeries: function() {
    const count = 24;
    var now = Date.now();
    var data = [];

    for(var i=1; i<=count; i++) {
      let y = random(0, 10);
      let x = now - minutes((count * 2) - (i * 2));

      data.push({ x: x, y: y });
    }

    return data;
  },

  threeMetricTimeSeries: function() {
    const count = 24;
    var now = Date.now();
    var data = [];

    for(var i=1; i<=count; i++) {
      let x = now - minutes((count * 2) - (i * 2));
      let y1 = random(0, 9);
      let y2 = random(10, 19);
      let y3 = random(20, 29);

      data.push({
        date: x,
        low: y1,
        medium: y2,
        high: y3
      });
    }

    return data;
  },

  simpleOrdinalData: function() {
    const count = 10;
    var data = [];

    for(var i=0; i<count; i++) {
      data.push({
        x: i,
        y: random(10, 30),
      });
    }

    return data;
  },

  ganttData: function() {
    const count = 5;
    var data = [];
    var high = Date.now();
    var low = Date.now() - minutes(10);
    var mid = low + ((high - low) / 2);

    for(var i=0; i<count; i++) {
      let start = random(low, mid);
      let end = random(mid, high);

      data.push({
        index: i,
        start: start,
        end: end
      });
    }

    return data;
  }

};

export { dataGenerator };
