import Ember from 'ember';

/**
  A component for grouping and stacking `nf-area` components in an `nf-graph`.
  
  This component looks at the order of the `nf-area` components underneath it 
  and uses the ydata of the next sibling `nf-area` component to determine the bottom 
  of each `nf-area` components path to be drawn.

  ### Example

      {{#nf-graph width=300 height=100}}
        {{#nf-graph-content}}
          {{#nf-area-stack}}
            {{nf-area data=myData xprop="time" yprop="high"}}
            {{nf-area data=myData xprop="time" yprop="med"}}
            {{nf-area data=myData xprop="time" yprop="low"}}
          {{/nf-area-stack}}
        {{/nf-graph-content}}
      {{/nf-graph}}

  @namespace components
  @class nf-area-stack 
*/
export default Ember.Component.extend({
  tagName: 'g',

  /**
    Used by `nf-area` to identify an area stack parent
    @property isAreaStack
    @type Boolean
    @default true
    @readonly
  */
  isAreaStack: true,

  /**
    Whether or not to add the values together to create the stacked area
    @property aggregate
    @type {boolean}
    @default false
  */
  aggregate: Ember.computed(function(key, value) {
    if(arguments.length > 1) {
      this._aggregate = value;
    } else if(typeof this._aggregate === 'undefined') {
      Ember.warn('nf-area-stack.aggregate must be set. Currently defaulting to `false` but will default to `true` in the future.')
      this._aggregate = false;
    }
    return this._aggregate;
  }),

  /**
    The collection of `nf-area` components under this stack.
    @property areas
    @type Array
    @readonly
  */
  areas: Ember.computed(function(){
    return Ember.A();
  }),

  /**
    Registers an area component with this stack. Also links areas to one
    another by setting `nextArea` on each area component.
    @method registerArea
    @param area {Ember.Component} The area component to register.
  */
  registerArea: function(area) {
    var areas = this.get('areas');
    var prev = areas[areas.length - 1];
    
    if(prev) {
      prev.set('nextArea', area);
      area.set('prevArea', prev);
    }
    
    areas.pushObject(area);
  },

  /**
    Unregisters an area component from this stack. Also updates next
    and previous links.
    @method unregisterArea
    @param area {Ember.Component} the area to unregister
  */
  unregisterArea: function(area) {
    var prev = area.get('prevArea');
    var next = area.get('nextArea');

    if(next) {
      next.set('prevArea', prev);
    }
    
    if(prev) {
      prev.set('nextArea', next);
    }

    this.get('areas').removeObject(area);
  },
});