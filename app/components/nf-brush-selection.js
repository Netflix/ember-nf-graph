import Ember from 'ember';
import RequiresScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';

export default Ember.Component.extend(RequiresScaleSource, {
  tagName: 'g',

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  left: undefined,

  right: undefined,

  formatter: null,

  textPadding: 3,

  autoWireUp: true,

  _autoBrushHandler: function(e) {
    this.set('left', Ember.get(e, 'left.x'));
    this.set('right', Ember.get(e, 'right.x'));
  },

  _autoBrushEndHandler: function() {
    this.set('left', undefined);
    this.set('right', undefined);
  },

  _wireToGraph: function(){
    let graph = this.get('graph');
    let auto = this.get('autoWireUp');

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
    let root = d3.select(this.element);
    let g = root.select('.nf-brush-selection-left-display');
    let text = g.select('.nf-brush-selection-left-text');
    let bg = g.select('.nf-brush-selection-left-text-bg');

    let display = this.get('leftDisplay');

    if(!display) {
      g.attr('hidden', true);
    } else {
      g.attr('hidden', null);
    }

    text.text(display);

    let textPadding = this.get('textPadding');
    let leftX = this.get('leftX');
    let graphHeight = this.get('graphHeight');
    let bbox = text[0][0].getBBox();

    let doublePad = textPadding * 2;
    let width = bbox.width + doublePad;
    let height = bbox.height + doublePad;
    let x = Math.max(0, leftX - width);
    let y = graphHeight - height;

    g.attr('transform', `translate(${x} ${y})`);

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
    let root = d3.select(this.element);
    let g = root.select('.nf-brush-selection-right-display');
    let text = g.select('.nf-brush-selection-right-text');
    let bg = g.select('.nf-brush-selection-right-text-bg');

    let display = this.get('rightDisplay');

    if(!display) {
      g.attr('hidden', true);
    } else {
      g.attr('hidden', null);
    }

    text.text(display);

    let textPadding = this.get('textPadding');
    let rightX = this.get('rightX');
    let graphHeight = this.get('graphHeight');
    let graphWidth = this.get('graphWidth');
    let bbox = text[0][0].getBBox();

    let doublePad = textPadding * 2;
    let width = bbox.width + doublePad;
    let height = bbox.height + doublePad;
    let x = Math.min(graphWidth - width, rightX);
    let y = graphHeight - height;

    g.attr('transform', `translate(${x} ${y})`);

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
    let formatter = this.get('formatter');
    let left = this.get('left');
    return formatter ? formatter(left) : left;
  }),

  rightDisplay: Ember.computed('right', 'formatter', function(){
    let formatter = this.get('formatter');
    let right = this.get('right');
    return formatter ? formatter(right) : right;
  }),

  isVisible: Ember.computed('left', 'right', function(){
    let left = +this.get('left');
    let right = +this.get('right');
    return left === left && right === right;
  }),

  leftX: Ember.computed('xScale', 'left', function() {
    let left = this.get('left') || 0;
    let scale = this.get('xScale');
    return scale ? scale(left) : 0;
  }),

  rightX: Ember.computed('xScale', 'right', function() {
    let right = this.get('right') || 0;
    let scale = this.get('xScale');
    return scale ? scale(right) : 0;
  }),

  graphWidth: Ember.computed.alias('graph.graphWidth'),

  graphHeight: Ember.computed.alias('graph.graphHeight'),

  rightWidth: Ember.computed('rightX', 'graphWidth', function() {
    return (this.get('graphWidth') - this.get('rightX')) || 0;
  }),
});
