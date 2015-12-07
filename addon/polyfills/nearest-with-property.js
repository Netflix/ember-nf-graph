import Ember from 'ember';

/**
 A shim for old `nearestWithProperty` support. You should yield an instance
 and pass that to your child components in Ember >2.0.0.

 @namespace shims
 */
export default function nearestWithProperty(prop, parent) {
  nearestWithProp = this.get('prop');
  if (!nearestWithProp) {
    while(true) {
      parent = parent.get('parentView');
      if (typeof parent === 'undefined' || !parent) { return; }
      if (parent[prop]) { return parent; }
    }
  }
  return nearestWithProp;
}
