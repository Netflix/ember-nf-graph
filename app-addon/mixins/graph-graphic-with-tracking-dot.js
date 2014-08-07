import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';

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

  showTrackingDot: property('trackedData.x', 'trackedData.y', function(x, y) {
    return typeof x === 'number' && typeof y === 'number';
  }),

  updateTrackedData: function(){
    var trackingMode = this.get('trackingMode');
    var hoverDataX = this.get('hoverData.x');
    var hoverDataY = this.get('hoverData.y');
    var firstVisibleData = this.get('firstVisibleData');
    var lastVisibleData = this.get('lastVisibleData');
    var selected = this.get('selected');
    var vx, vy;
    var firstX = firstVisibleData ? firstVisibleData[0] : null;
    var firstY = firstVisibleData ? firstVisibleData[1] : null;
    var lastX = lastVisibleData ? lastVisibleData[0] : null;
    var lastY = lastVisibleData ? lastVisibleData[1] : null;
    var isHovered = typeof hoverDataX === 'number' &&  typeof hoverDataY === 'number';

    var setToHover = function(){
      vx = hoverDataX;
      vy = hoverDataY;
    };

    var snapFirstBehavior = function(){        
      if(isHovered) {
        setToHover();
      } else {
        vx = firstX;
        vy = firstY;
      }
    };

    var snapLastBehavior = function(){
      if(isHovered) {
        setToHover();
      } else {
        vx = lastX;
        vy = lastY;
      }
    };

    switch(trackingMode) {
      case 'none':
        break;
      case 'hover':
        if(isHovered) {
          setToHover();
        }
        break;
      case 'selected-hover':
        if(selected && isHovered) {
          setToHover();
        }
        break;
      case 'snap-first':
        snapFirstBehavior();
        break;
      case 'selected-snap-first':
        if(selected) {
          snapFirstBehavior();
        }
        break;
      case 'snap-last':
        snapLastBehavior();
        break;
      case 'selected-snap-last':
        if(selected) {
          snapLastBehavior();
        }
        break;
    }

    this.set('trackedData', {
      x: vx,
      y: vy
    });
  },

  _watchTrackingChanges: function(){
    Ember.run.scheduleOnce('render', this, this.updateTrackedData);
  }.observes('trackingMode', 'hoverData.x', 'hoverData.y', 'firstVisibleData', 'lastVisibleData', 'selected').on('didInsertElement'),
});