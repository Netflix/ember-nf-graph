import Ember from 'ember';
import GraphMouseEvent from 'ember-nf-graph/utils/nf/graph-mouse-event';
import DataGraphic from 'ember-nf-graph/mixins/graph-data-graphic';
import RequiresScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';
import HasGraphParent from 'ember-nf-graph/mixins/graph-has-graph-parent';
import computed from 'ember-new-computed';

const get = Ember.get;
const { or } = Ember.computed;

/**
  A tracking graphic component used to do things like create tracking dots for nf-area or nf-line.
  @namespace components
  @class nf-tracker
  @uses mixins.graph-has-graph-parent
  @uses mixins.graph-data-graphic
  @uses mixins.graph-requires-scale-source
  */
export default Ember.Component.extend(HasGraphParent, DataGraphic, RequiresScaleSource, {
  tagName: 'g',

  classNameBindings: [':nf-tracker'],

  attributeBindings: ['transform'],

  /**
    Gets or sets the tracking mode of the component.

    Possible values are:

    - 'hover': only track while mouse hover
    - 'snap-last': track while mouse hover, but snap to the last data element when not hovering
    - 'snap-first': track while mouse hover, but snap to the first data element when not hovering
    - 'selected-hover': The same as `'hover'` tracking mode, but only when the compononent is 
    {{#crossLink "mixins.graph-selectable-graphic/selected:property"}}{{/crossLink}}
    - 'selected-snap-last': The same as `'snap-last'` tracking mode, but only when the compononent is 
    {{#crossLink "mixins.graph-selectable-graphic/selected:property"}}{{/crossLink}}
    - 'selected-snap-first': The same as `'snap-first'` tracking mode, but only when the compononent is 
    {{#crossLink "mixins.graph-selectable-graphic/selected:property"}}{{/crossLink}}

    @property trackingMode
    @type String
    @default 'hover'
  */
  trackingMode: 'hover',

  isTracker: true,

  trackedData: null,

  isShouldTrack: or('isSelectedHoverMode', 'isHoverMode'),

  isSelectedHoverMode: computed('trackingMode', {
    get() {
      var mode = this.get('trackingMode');
      return mode === 'selected-hover' || mode === 'selected-snap-first' || mode === 'selected-snap-last';
    }
  }),

  isHoverMode: computed('trackingMode', {
    get() {
      var mode = this.get('trackingMode');
      return mode === 'hover' || mode === 'snap-first' || mode === 'snap-last';
    }
  }),

  hoverData: null,

  isHovered: false,

  transform: computed('trackedData.x', 'trackedData.y', 'xScale', 'yScale', {
    get() {
      var xScale = this.get('xScale');
      var yScale = this.get('yScale');
      var x = xScale && xScale(this.get('trackedData.x') || 0);
      var y = yScale && yScale(this.get('trackedData.y') || 0);
      return 'translate(' + x + ',' + y + ')';
    }
  }),

  showTracker: computed('trackedData.graphX', 'trackedData.graphY', {
    get() {
      var trackedData = this.get('trackedData');
      if(trackedData) {
        var x = get(trackedData, 'x');
        var y = get(trackedData, 'y');
        return +x === +x && +y === +y;
      }
    }
  }),

  _updateHovered: Ember.observer('isShouldTrack', 'hoverData', function(){
    if(this.get('isShouldTrack')) {
      this.set('trackedData', this.get('hoverData'));
    }
  }),

  _processUpdateUnhovered: function(){
    if(!this.get('isHovered')) {
      var mode = this.get('trackingMode');
      var selected = this.get('selected');
      if(mode === 'snap-last' || (selected && mode === 'selected-snap-last')) {
        this.set('trackedData', this.get('lastVisibleData'));
      }
      if(mode === 'snap-first' || (selected && mode === 'selected-snap-first')) {
        this.set('trackedData', this.get('firstVisibleData'));
      }
    }
  },

  _updateUnhovered: Ember.on('didInsertElement', Ember.observer(
    'isHovered',
    'trackingMode',
    'firstVisibleData',
    'lastVisibleData',
    'selected',
    function(){
      Ember.run.scheduleOnce('actions', this, this._processUpdateUnhovered);
    }
  )),

  /**
    The action name to send to the controller when the `hoverChange` event fires
    @property hoverChange
    @type String
    @default null
  */
  hoverChange: null,

  /**
    Event handler for content hoverChange event. Triggers `didHoverChange`.
    @method didContentHoverChange
    @params e {utils.nf.graph-mouse-event}
    @private
  */
  didContentHoverChange(e){
    var graphContentElement = this.get('graphContentElement');

    this.trigger('didHoverChange', GraphMouseEvent.create({
      originalEvent: e.get('originalEvent'),
      source: this,
      graphContentElement: graphContentElement,
    }));
  },

  /**
    Event handler for didHoverChange. Sends hoverChange action.
    @method didHoverChange
    @param e {utils.nf.graph-mouse-event}
  */
  didHoverChange(e) {
    var isHoverMode = this.get('isHoverMode');
    var isSelectedHoverMode = this.get('isSelectedHoverMode');
    var selected = this.get('selected');

    if(!this.get('isHovered')) {
      this.set('isHovered', true);
    }

    if(isHoverMode || (selected && isSelectedHoverMode)) {
      this.set('hoverData', e);
    }

    if(this.get('hoverChange')) {
      this.sendAction('hoverChange', e);
    }
  },

  /**
    Name of the action to send on `hoverEnd`
    @property hoverEnd
    @type String
    @default null
  */
  hoverEnd: null,

  /**
    Event handler for didHoverEnd. Updates tracked data, and sends hoverEnd action.
    @function didHoverEnd
    @params e {Object} hover end event object.
  */
  didHoverEnd(e) {
    this.set('hoverData', null);

    if(this.get('isHovered')) {
      this.set('isHovered', false);
    }

    if(this.get('hoverEnd')) {
      this.sendAction('hoverEnd', {
        originalEvent: e.get('originalEvent'),
        source: this,
        graph: this.get('graph'),
      });
    }
  },

  /**
    The action to send on `didTrack`.
    @property didTrack
    @type String
    @default null
  */
  didTrack: null,

  /**
    Observes changes to tracked data and sends the
    didTrack action.
    @method _sendDidTrack
    @private
  */
  _sendDidTrack: Ember.observer('trackedData', function(){
    if(this.get('didTrack')) {
      this.sendAction('didTrack', {
        x: this.get('trackedData.x'),
        y: this.get('trackedData.y'),
        data: this.get('trackedData.data'),
        source: this,
        graph: this.get('graph'),
      });
    }
  }),

  /**
    The action to send on `willTrack`
    @property willTrack
    @type String
    @default null
  */
  willTrack: null,

  graphContentElement: computed('graph', {
    get() {
      return this.get('graph').$('.nf-graph-content')[0];
    }
  }),

  /**
    Observes impending changes to trackedData and sends
    the willTrack action.
    @method _sendWillTrack
    @private
  */
  _sendWillTrack: Ember.beforeObserver('trackedData', function(){
    if(this.get('willTrack')) {
      this.sendAction('willTrack', {
        x: this.get('trackedData.x'),
        y: this.get('trackedData.y'),
        data: this.get('trackedData.data'),
        source: this,
        graph: this.get('graph'),
      });
    }
  }),

  /**
    Handles the graph-content's hoverEnd event and triggers didHoverEnd
    @method didContentHoverEnd
    @param e {utils.nf.graph-mouse-action-context}
    @private
  */
  didContentHoverEnd(e){
    var graph = this.get('graph');

    this.trigger('didHoverEnd', {
      originalEvent: e,
      source: this,
      graph: graph,
    });
  },

  didInsertElement() {
    this._super.apply(arguments);
    var content = this.get('graph.content');
    content.on('didHoverChange', this, this.didContentHoverChange);
    content.on('didHoverEnd', this, this.didContentHoverEnd);
  },

  willDestroyElement(){
    this._super.apply(arguments);
    var content = this.get('graph.content');
    if(content) {
      content.off('didHoverChange', this, this.didContentHoverChange);
      content.off('didHoverEnd', this, this.didContentHoverEnd);
    }
  }
});