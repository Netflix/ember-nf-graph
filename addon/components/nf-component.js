import Ember from 'ember';
import layout from '../templates/components/nf-component';

const {
  assert,
  isPresent
} = Ember;

/**
  Renders a custom component with the given component name.

  ## Example

  The following example will render a custom svg image component at (0, 50):

        {{#graph.component 'my-custom-svg-image' as |image|}}
          {{component image src="images/star.svg"}}
        {{/graph.component}}

  @namespace components
  @class nf-component
  @extends Ember.Component
*/
const NfComponent = Ember.Component.extend({
  layout,
  tagName: '',

  /**
    The name of the component to be rendered.
    @property componentName
    @type String
    @default ''
  */
  componentName: '',

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
  */
  graph: null,

  /**
    The scale source
    @property scaleSource
    @type d3.nf-graph
    @default graph
  */
 scaleSource: null,

 init(){
   this._super(...arguments);
   assert('[ember-nf-graph] A component name must be passed into nf-component.', isPresent(this.get('componentName')));
 }
});

NfComponent.reopenClass({
  positionalParams: ['componentName']
});

export default NfComponent;
