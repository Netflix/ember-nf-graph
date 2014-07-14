import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'g',
  // templateName: 'ember-cli-ember-dvc/components/graph-content',
  
  classNames: ['nf-graph-content'],

  attributeBindings: ['transform'],

  transform: function(){
    return 'translate(%@ %@)'.fmt(this.get('x'), this.get('y'));
  }.property('x', 'y'),

  x: Ember.computed.alias('graph.graphX'),
  y: Ember.computed.alias('graph.graphY'),
  width: Ember.computed.alias('graph.graphWidth'),
  height: Ember.computed.alias('graph.graphHeight'),


  gridLanes: function () {
    var ticks = this.get('graph.yAxis.ticks');
    var width = this.get('width');

    if(!ticks) {
      return [];
    }

    ticks = ticks.sortBy('y');
    var lanes = [];
    var i, a, b;
    for(i = 1; i < ticks.length - 1; i += 2) {
      a = ticks[i];
      b = ticks[i + 1];
      lanes.push({
        x: 0,
        y: a.y,
        height: b.y - a.y,
        width: width
      });
    }

    return lanes;
  }.property('graph.yAxis.ticks', 'width'),

  _setup: function(){
    var graph = this.nearestWithProperty('isGraph');
    this.set('graph', graph);
  }.on('init')
});