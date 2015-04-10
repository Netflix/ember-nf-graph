/**
  utilities for dealing with d3 scales
  @namespace utils.nf
  @module scale-utils
*/

/**
  Ensures the output of a scale function is something palatable by SVG.
  @method normalizeScale
  @param scale {d3.scale} the scale to use to get the value
  @param val {any} the value to transform with the scale
  @return {Number} the output of the scale function, but if NaN, it will return 0.
*/
function normalizeScale(scale, val) {
  return (scale ? scale(val) : 0) || 0;
}

export { normalizeScale };