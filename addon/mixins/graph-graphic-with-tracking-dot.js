import Ember from 'ember';
import { getMousePoint } from '../utils/nf/svg-dom';
import computed from 'ember-new-computed';

var { on, observer } = Ember;

export default Ember.Mixin.create({
  /**
    Gets or sets the tracking mode of the component.

    Possible values are:

    - 'none': no tracking behavior
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
    @default 'none'
  */
  trackingMode: 'none',

  /**
    The radius of the tracking dot in pixels
    @property trackingDotRadius
    @type {number}
    @default 2.5
  */
  trackingDotRadius: 2.5,

  /**
    The action to send on `didTrack`.
    @property didTrack
    @type String
    @default null
  */
  didTrack: null,

  /**
    The value of the data that is being tracked by the component.
    @property trackedData
    @type {Object} an object with the following values:  
      - point: an { x, y } pair for the exact px coordinates inside the graph-content
      - graphX: domain x value at mouse position
      - graphY: domain y value at mouse position
      - x: nearest x data value
      - y: nearest y data value
      - data: nearest raw data
      - renderX: domain x value to render a tracking dot at (stacked areas are offset)
      - renderY: domain x value to render a tracking dot at (stacked areas are offset)
      - mouseX: mouse x position in pixels
      - mouseY: mouse y position in pixels
    @default null
  */
  trackedData: null,

  /**
    The value of the data that is being tracked by the component, ONLY if the 
    graph-content is currently being hovered.
    @property hoverData
    @type {Object} an object with the following values:  
      - point: an { x, y } pair for the exact px coordinates inside the graph-content
      - graphX: domain x value at mouse position
      - graphY: domain y value at mouse position
      - x: nearest x data value
      - y: nearest y data value
      - data: nearest raw data
      - renderX: domain x value to render a tracking dot at (stacked areas are offset)
      - renderY: domain x value to render a tracking dot at (stacked areas are offset)
      - mouseX: mouse x position in pixels
      - mouseY: mouse y position in pixels
    @default null
  */
  hoverData: null,

  _showTrackingDot: true,

  /**
    Gets or sets whether the tracking dot should be shown at all.
    @property showTrackingDot
    @type {boolean}
    @default true
  */
  showTrackingDot: computed('trackedData', {
    get() {
      return Boolean(this._showTrackingDot && this.get('trackedData'));
    },

    set(value) {
      this._showTrackingDot = value;
    }
  }),

  /**
    Observes changes to tracked data and sends the
    didTrack action.
    @method _trackedDataChanged
    @private
  */
  _trackedDataChanged: Ember.observer('trackedData', function(){
    var trackedData = this.get('trackedData');
    this.set('hoverData', this._hovered ? trackedData : null);

    if(this.get('didTrack')) {
      this.sendAction('didTrack', {
        x: trackedData.x,
        y: trackedData.y,
        data: trackedData.data,
        source: this,
        graph: this.get('graph'),
      });
    }
  }),

  _cleanup: function(){
    if(this._onHoverCleanup) {
      this._onHoverCleanup();
    }
    if(this._onEndCleanup) {
      this._onEndCleanup();
    }
  },

  _updateTrackingHandling() {
    var { trackingMode, selected } = this.getProperties('trackingMode', 'selected');

    this._cleanup();

    switch(trackingMode) {
      case 'hover':
        this._onHoverTrack();
        this._onEndUntrack();
        break;
      case 'snap-first':
        this._onHoverTrack();
        this._onEndSnapFirst();
        break;
      case 'snap-last':
        this._onHoverTrack();
        this._onEndSnapLast();
        break;
      case 'selected-hover':
        if(selected) {
          this._onHoverTrack();
          this._onEndUntrack();
        }
        break;
      case 'selected-snap-first':
        if(selected) {
          this._onHoverTrack();
          this._onEndSnapFirst();
        }
        break;
      case 'selected-snap-last':
        if(selected) {
          this._onHoverTrack();
          this._onEndSnapLast();
        }
        break;
    }
  },

  _onHoverTrack() {
    var content = this._content;

    var mousemoveHandler = e => {
      this._hovered = true;
      var evt = this._getEventObject(e);
      this.set('trackedData', evt);
    };

    content.on('mousemove', mousemoveHandler);

    this._onHoverCleanup = () => {
      content.off('mousemove', mousemoveHandler);
    };
  },

  _hovered: false,

  _onEndUntrack() {
    var content = this._content;

    var mouseoutHandler = () => {
      this.set('trackedData', null);
    };

    content.on('mouseout', mouseoutHandler);

    this._onEndCleanup = () => {
      content.off('mouseout', mouseoutHandler);
    };

    if(!this._hovered) {
      this.set('trackedData', null);
    }
  },

  _onEndSnapLast() {
    var content = this._content;

    var mouseoutHandler = () => {
      this._hovered = false;
      this.set('trackedData', this.get('lastVisibleData'));
    };

    var changeHandler = () => {
      if(!this._hovered) {
        this.set('trackedData', this.get('lastVisibleData'));
      }
    };

    content.on('mouseout', mouseoutHandler);
    this.addObserver('lastVisibleData', this, changeHandler);

    this._onEndCleanup = () => {
      content.off('mouseout', mouseoutHandler);
      this.removeObserver('lastVisibleData', this, changeHandler);
    };

    changeHandler();
  },

  _onEndSnapFirst() {
    var content = this._content;

    var mouseoutHandler = () => {
      this._hovered = false;
      this.set('trackedData', this.get('firstVisibleData'));
    };

    var changeHandler = () => {
      if(!this._hovered) {
        this.set('trackedData', this.get('firstVisibleData'));
      }
    };

    content.on('mouseout', mouseoutHandler);
    this.addObserver('firstVisibleData', this, changeHandler);

    this._onEndCleanup = () => {
      content.off('mouseout', mouseoutHandler);
      this.removeObserver('firstVisibleData', this, changeHandler);
    };

    changeHandler();
  },

  _trackingModeChanged: on('init', observer('trackingMode', 'selected', function() {
    Ember.run.once(this, this._updateTrackingHandling);
  })),

  _getEventObject(e) {
    var { xScale, yScale } = this.getProperties('xScale', 'yScale');
    var content = this._content;
    var point = getMousePoint(content[0], e);
    var graphX = xScale.invert(point.x);
    var graphY = yScale.invert(point.y);
    var near = this.getDataNearXRange(point.x);

    if(!near) {
      return {
        point,
        graphX,
        graphY,
        mouseX: point.x,
        mouseY: point.y,
      };
    }

    var { x, y, data, renderX, renderY } = near;
    return {
      point,
      graphX,
      graphY,
      x,
      y,
      data,
      renderX,
      renderY,
      mouseX: point.x,
      mouseY: point.y
    };
  },

  didInsertElement() {
    this._super.apply(arguments);
    this._content = this.$().parents('.nf-graph-content');
  },

  willDestroyElement() {
    this._super.apply(arguments);
    this._cleanup();
  }
});