import Ember from 'ember';

/**
  Adds tracking dot functionality to a component such as {{#crossLink "components.nf-line"}}{{/crossLink}}
  or {{#crossLink "components.nf-area"}}{{/crossLink}}
  
  @namespace mixins
  @class graph-graphic-with-tracking-dot
  */
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
    The {{#crossLink "mixins.graph-data-graphic/data:property"}}{{/crossLink}} item to plot the tracking dot at.

    @property trackedData 
    @type Array
    @default null
    */
  trackedData: null,
  
  _trackingDot: null,

  /**
    An model of the tracking dot's position and size
    @property trackingDot
    @default { x: 0, y: 0, visible: false, radius: 2 }
    @type Object
    @readonly
    */
  trackingDot: function(name, value){ 
    if(arguments.length > 1) {
      this._trackingDot = value;
    }

    if(!this._trackingDot) {
      this._trackingDot = {
        x: 0,
        y: 0,
        visible: false,
        radius: 2
      };
    }

    return this._trackingDot;
  }.property('_trackingDot'),

  /**
    Observes the {{#crossLink "mixin.graph-graphic-with-tracking-dot/trackedData:property"}}{{/crossLink}},
    {{#crossLink "components.nf-graph/xScale:property"}}{{/crossLink}} and
    {{#crossLink "components.nf-graph/yScale:property"}}{{/crossLink}}
    and updates the {{#crossLink "mixin.graph-graphic-with-tracking-dot/trackingDot:property"}}{{/crossLink}}
    accordingly.

    @method updateTrackingDot
    */
  updateTrackingDot: function(){
    var trackedData = this.get('trackedData');
    var xScale = this.get('graph.xScale');
    var yScale = this.get('graph.yScale');

    if(!trackedData || !xScale || !yScale) {
      this.set('trackingDot.visible', false);
    } else {
      this.set('trackingDot.visible', true);
      this.set('trackingDot.x', xScale(trackedData.x));
      this.set('trackingDot.y', yScale(trackedData.y));
    }
  }.observes('trackedData', 'graph.xScale', 'graph.yScale'),

  /**
    Initializes the tracking dot when the component is assigned a graph.

    @method _hasGraph
    @private
    */
  _hasGraph: function(){
    var self = this;
    var graph = self.get('graph');
    graph.hoverChange(function(e, data){
      var trackingMode = self.get('trackingMode');
      var selected = self.get('isSelected');
      var xScale = self.get('graph.xScale');
      
      if(trackingMode === 'none' || (trackingMode.indexOf('selected-') === 0 && !selected)) {
        self.set('trackedData', null);
      } else {
        var found = self.getNearestDataToXPosition(data.x, self.get('visibleData'), xScale);
        self.set('trackedData', found ? {
          x: found[0],
          y: found[1]
        } : null);
      } 
    });

    graph.hoverEnd(function() {
      self._trackingModeDidChange();
    });
  }.observes('graph'),

  /**
    Observes changes other than mouse hovers that might update the {{#crossLink "mixins.graph-graphic-with-tracking-dot/trackedData"}}{{/crossLink}}
    and updates accordingly.
    
    @method _updateTrackedData
    */
  _updateTrackedData: function(){
    var trackingMode = this.get('trackingMode');
    var selected = this.get('isSelected');
    var selectable = this.get('selectable');
    var last = this.get('lastVisibleData');
    var first = this.get('firstVisibleData');
    var data = null;

    switch(trackingMode) {
      case 'selected-snap-last':
        if(selectable && selected) {
          data = last;
        }
        break;
      case 'selected-snap-first':
        if(selectable && selected) {
          data = first;
        }
        break;
      case 'snap-last':
        data = last;
        break;
      case 'snap-first':
        data = first;
        break;
    }
    
    this.set('trackedData', data ? {
      x: data[0],
      y: data[1],
      data: data.data
    } : null);
  }.observes('trackingMode', 'lastVisibleData', 'firstVisibleData', 'isSelected', 'selectable').on('init'),
});