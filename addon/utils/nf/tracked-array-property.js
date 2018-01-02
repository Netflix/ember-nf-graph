import Ember from 'ember';
import { computed } from '@ember/object';

let get = Ember.get;

function trackedArrayProperty(arraySourceProp, trackByProp, backingField) {
  let arraySourceDependency = arraySourceProp + '.[]';

  backingField = backingField || '_%@_trackBy_%@'.fmt(arraySourceProp, trackByProp);

  return computed(arraySourceDependency, {
    get() {
      let array = this.get(backingField);

      if(!Ember.isArray(array)){
        array = Ember.A();
      }

      let trackBy = trackByProp ? this.get(trackByProp) : null;
      let keyFn = !trackBy ? function(d, i) {
        return i;
      } : function(d) {
        return get(d, trackBy);
      };

      let source = this.get(arraySourceProp);

      if(!Ember.isArray(source) || source.length === 0) {
        array = Ember.A();
      } else {
        let sourceKeys = [];
        source.forEach(function(d, i) {
          let key = keyFn(d, i);
          sourceKeys.pushObject(key);

          let found = array.find(function(x, i) {
            return keyFn(x, i) === key;
          });

          Ember.set(d, '__meta__trackedKey', key);

          if(found) {
            Ember.keys(d).forEach(function(k) {
              let v = get(d, k);
              if(get(found, k) !== v) {
                Ember.set(found, k, v);
              }
            });
          } else {
            array.pushObject(d);
          }
        });

        let d, i;
        for(i = array.length - 1; i >= 0; i--) {
          d = array[i];
          let key = keyFn(d, i);
          if(sourceKeys.indexOf(key) === -1) {
            array.removeObject(d);
          }
        }
      }

      this.set(backingField, array);

      return array;
    }
  });
}

export default trackedArrayProperty;
