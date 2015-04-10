import Ember from 'ember';
import HasGraphParent from 'ember-nf-graph/mixins/graph-has-graph-parent';
import RequireScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';
import SelectableGraphic from 'ember-nf-graph/mixins/graph-selectable-graphic';

/**
  A grouping tag that provides zooming and offset functionality to it's children.

  ## Example

  The following example will show a line of `someData` with a 2x zoom, offset by 30px in both x and y
  directions:

        {{#nf-gg scaleZoomX="2" scaleZoomY="2" scaleOffsetX="30" scaleOffsetY="30"}}
          {{nf-line data=someData}}
        {{/nf-gg}}

  @namespace components
  @class nf-gg
  @extends Ember.Component
  @uses mixins.graph-has-graph-parent
  @uses mixins.graph-require-scale-source
  @uses mixins.graph-selecteble-graphic
*/
export default Ember.Component.extend(HasGraphParent, RequireScaleSource, SelectableGraphic, {
  tagName: 'g',
  
  classNameBindings: [':nf-gg', 'selectable', 'selected'],

  isScaleSource: true,

  click: function() {
    if(this.get('selectable')) {
      this.toggleProperty('selected');
    }
  }
});