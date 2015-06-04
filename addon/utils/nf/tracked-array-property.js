import Ember from 'ember';
import computed from 'ember-new-computed';

var get = Ember.get;

function trackedArrayProperty(arraySourceProp, trackByProp, backingField) {
  var arraySourceDependency = arraySourceProp + '.[]';

  backingField = backingField || '_%@_trackBy_%@'.fmt(arraySourceProp, trackByProp);

  return computed(arraySourceDependency, {
    get() {
      var array = this.get(backingField);

      if(!Ember.isArray(array)){
        array = Ember.A();
      }

      var trackBy = trackByProp ? this.get(trackByProp) : null;
      var keyFn = !trackBy ? function(d, i) {
        return i;
      } : function(d) {
        return get(d, trackBy);
      };

      var source = this.get(arraySourceProp);

      if(!Ember.isArray(source) || source.length === 0) {
        array = Ember.A();
      } else {
        var sourceKeys = [];
        source.forEach(function(d, i) {
          var key = keyFn(d, i);
          sourceKeys.pushObject(key);
          
          var found = array.find(function(x, i) {
            return keyFn(x, i) === key;
          });
          
          Ember.set(d, '__meta__trackedKey', key);

          if(found) {
            Ember.keys(d).forEach(function(k) {
              var v = get(d, k);
              if(get(found, k) !== v) {
                Ember.set(found, k, v);
              }
            });
          } else {
            array.pushObject(d);
          }
        });

        var d, i;
        for(i = array.length - 1; i >= 0; i--) {
          d = array[i];
          var key = keyFn(d, i);
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