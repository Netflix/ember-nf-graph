import Ember from 'ember';
import layout from 'ember-nf-graph/templates/components/nf-area-stack';
import computed from 'ember-new-computed';

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
  layout,
  tagName: 'g',

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  /**
    Whether or not to add the values together to create the stacked area
    @property aggregate
    @type {boolean}
    @default false
  */
  aggregate: computed({
    get() {
      Ember.warn('nf-area-stack.aggregate must be set. Currently defaulting to `false` but will default to `true` in the future.');
      return this._aggregate = false;
    },
    set(key, value) {
      return this._aggregate = value;
    }
  }),

  /**
    The collection of `nf-area` components under this stack.
    @property areas
    @type Array
    @readonly
  */
  areas: computed(function(){
    return Ember.A();
  }),

  /**
    Registers an area component with this stack. Also links areas to one
    another by setting `nextArea` on each area component.
    @method registerArea
    @param area {Ember.Component} The area component to register.
  */
  registerArea: function(area) {
    let areas = this.get('areas');
    let prev = areas[areas.length - 1];

    Ember.run.schedule('afterRender', () => {
      if(prev) {
        prev.set('nextArea', area);
        area.set('prevArea', prev);
      }

      areas.pushObject(area);
    });
  },

  /**
    Unregisters an area component from this stack. Also updates next
    and previous links.
    @method unregisterArea
    @param area {Ember.Component} the area to unregister
  */
  unregisterArea: function(area) {
    let prev = area.get('prevArea');
    let next = area.get('nextArea');

    Ember.run.schedule('afterRender', () => {
      if(next) {
        next.set('prevArea', prev);
      }

      if(prev) {
        prev.set('nextArea', next);
      }

      this.get('areas').removeObject(area);
    });
  },
});
