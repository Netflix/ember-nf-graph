import Ember from 'ember';
import HasGraphParent from 'ember-cli-nf-graph/mixins/graph-has-graph-parent';
import RequiresScaleSource from 'ember-cli-nf-graph/mixins/graph-requires-scale-source';

export default Ember.Component.extend(HasGraphParent, RequiresScaleSource, {
  tagName: 'g',

  left: undefined,

  right: undefined,

  formatter: null,

  textPadding: 3,

  autoWireUp: true,

  _autoBrushHandler: function(e) {
    this.set('left', Ember.get(e, 'left.x'));
    this.set('right', Ember.get(e, 'right.x'));
  },

  _autoBrushEndHandler: function(e) {
    this.set('left', undefined);
    this.set('right', undefined);
  },

  _wireToGraph: function(){
    var graph = this.get('graph');
    var auto = this.get('autoWireUp');

    if(auto) {
      graph.on('didBrushStart', this, this._autoBrushHandler);
      graph.on('didBrush', this, this._autoBrushHandler);
      graph.on('didBrushEnd', this, this._autoBrushEndHandler);
    } else {
      graph.off('didBrushStart', this, this._autoBrushHandler);
      graph.off('didBrush', this, this._autoBrushHandler);
      graph.off('didBrushEnd', this, this._autoBrushEndHandler);
    }
  },

  _autoWireUpChanged: Ember.on('didInsertElement', Ember.observer('autoWireUp', function(){
    Ember.run.once(this, this._wireToGraph);
  })),

  _updateLeftText: function(){
    var root = d3.select(this.element);
    var g = root.select('.nf-brush-selection-left-display');
    var text = g.select('.nf-brush-selection-left-text');
    var bg = g.select('.nf-brush-selection-left-text-bg');

    var display = this.get('leftDisplay');

    if(!display) {
      g.attr('hidden', true);
    } else {
      g.attr('hidden', null);
    }

    text.text(display);
    
    var textPadding = this.get('textPadding');
    var leftX = this.get('leftX');
    var graphHeight = this.get('graphHeight');
    var bbox = text[0][0].getBBox();

    var doublePad = textPadding * 2;
    var width = bbox.width + doublePad;
    var height = bbox.height + doublePad;
    var x = Math.max(0, leftX - width);
    var y = graphHeight - height;

    g.attr('transform', 'translate(%@, %@)'.fmt(x, y));
    
    text.attr('x', textPadding).
      attr('y', textPadding);

    bg.attr('width', width).
      attr('height', height);
  },

  _onLeftChange: Ember.on(
    'didInsertElement',
    Ember.observer('left', 'graphHeight', 'textPadding', function(){
      Ember.run.once(this, this._updateLeftText);
    })
  ),

  _updateRightText: function(){
    var root = d3.select(this.element);
    var g = root.select('.nf-brush-selection-right-display');
    var text = g.select('.nf-brush-selection-right-text');
    var bg = g.select('.nf-brush-selection-right-text-bg');

    var display = this.get('rightDisplay');

    if(!display) {
      g.attr('hidden', true);
    } else {
      g.attr('hidden', null);
    }

    text.text(display);

    var textPadding = this.get('textPadding');
    var rightX = this.get('rightX');
    var graphHeight = this.get('graphHeight');
    var graphWidth = this.get('graphWidth');
    var bbox = text[0][0].getBBox();

    var doublePad = textPadding * 2;
    var width = bbox.width + doublePad;
    var height = bbox.height + doublePad;
    var x = Math.min(graphWidth - width, rightX);
    var y = graphHeight - height;

    g.attr('transform', 'translate(%@, %@)'.fmt(x, y));
    
    text.attr('x', textPadding).
      attr('y', textPadding);

    bg.attr('width', width).
      attr('height', height);
  },

  _onRightChange: Ember.on(
    'didInsertElement',
    Ember.observer('right', 'graphHeight', 'graphWidth', 'textPadding', function(){
      Ember.run.once(this, this._updateRightText);
    })
  ),

  leftDisplay: Ember.computed('left', 'formatter', function(){
    var formatter = this.get('formatter');
    var left = this.get('left');
    return formatter ? formatter(left) : left;
  }),

  rightDisplay: Ember.computed('right', 'formatter', function(){
    var formatter = this.get('formatter');
    var right = this.get('right');
    return formatter ? formatter(right) : right;
  }),

  isVisible: Ember.computed('left', 'right', function(){
    var left = +this.get('left');
    var right = +this.get('right');
    return left === left && right === right;
  }),

  leftX: Ember.computed('xScale', 'left', function() {
    var left = this.get('left') || 0;
    var scale = this.get('xScale');
    return scale ? scale(left) : 0; 
  }),

  rightX: Ember.computed('xScale', 'right', function() {
    var right = this.get('right') || 0;
    var scale = this.get('xScale');
    return scale ? scale(right) : 0;
  }),

  graphWidth: Ember.computed.alias('graph.graphWidth'),
  
  graphHeight: Ember.computed.alias('graph.graphHeight'),

  rightWidth: Ember.computed('rightX', 'graphWidth', function() {
    return (this.get('graphWidth') - this.get('rightX')) || 0;
  }),
});