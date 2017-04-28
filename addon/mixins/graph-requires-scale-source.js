import Ember from 'ember';
import computed from 'ember-new-computed';

let scaleProperty = function(scaleKey, zoomKey, offsetKey){
  return computed(scaleKey, zoomKey, offsetKey, {
    get() {
      // console.log('HERE');
      let scale = this.get(scaleKey);
      let zoom = this.get(zoomKey);
      let offset = this.get(offsetKey);

      if(zoom === 1 && offset === 0) {
        return scale;
      }

      let copy = scale.copy();
      let domain = copy.domain();
      copy.domain([domain[0] / zoom, domain[1] / zoom]);

      let range = copy.range();
      copy.range([range[0] - offset, range[1] - offset]);

      return copy;
    }
  });
};

/**
  Adds functionality to identify a parent control that will provide an x and
  y scale, then adds scaling properties to the component it's mixed in to.
  @namespace mixins
  @class graph-requires-scale-source
*/
export default Ember.Mixin.create({
  /**
    The x scale used by this component
    @property xScale
    @type d3.scale
    @readonly
  */
  xScale: scaleProperty('scaleSource.xScale', 'scaleZoomX', 'scaleOffsetX'),

  /**
    The y scale used by this component
    @property yScale
    @type d3.scale
    @readonly
  */
  yScale: scaleProperty('scaleSource.yScale', 'scaleZoomY', 'scaleOffsetY'),

  _scaleOffsetX: 0,

  _scaleOffsetY: 0,

  _scaleZoomX: 1,

  _scaleZoomY: 1,

  /**
    The zoom multiplier for the x scale
    @property scaleZoomX
    @type Number
    @default 1
  */
  scaleZoomX: computed({
    get() {
      return this._scaleZoomX || 1;
    },
    set(key, value) {
      return this._scaleZoomX = +value || 1;
    }
  }),

  /**
    The zoom multiplier for the y scale
    @property scaleZoomY
    @type Number
    @default 1
  */
  scaleZoomY: computed({
    get() {
      return this._scaleZoomY || 1;
    },
    set(key, value) {
      return this._scaleZoomY = +value || 1;
    }
  }),

  /**
    The offset, in pixels, for the x scale
    @property scaleOffsetX
    @type Number
    @default 0
  */
  scaleOffsetX: computed({
    get() {
      return this._scaleOffsetX || 0;
    },
    set(key, value) {
      return this._scaleOffsetX = +value || 0;
    }
  }),

  /**
    The offset, in pixels, for the y scale
    @property scaleOffsetY
    @type Number
    @default 0
  */
  scaleOffsetY: computed({
    get() {
      return this._scaleOffsetY || 0;
    },
    set(key, value) {
      return this._scaleOffsetY = +value || 0;
    }
  }),

  init() {
    this._super(...arguments);

    if (!this.get('scaleSource')) {
      this.set('scaleSource', this.get('graph'));
    }
  }
});
