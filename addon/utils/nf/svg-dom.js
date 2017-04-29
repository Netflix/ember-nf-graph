/* globals getComputedStyle, Image, Blob, URL */
import Ember from 'ember';

/**
  @module utils/nf/svg-dom
*/

const {
  isPresent
} = Ember;

/**
  Traverses an element and all of its descendants, setting their
  inline style property to whatever the computed style is.
  @method inlineAllStyles
  @param element {Element} the dom element to traverse.
  @private
*/
function inlineAllStyles(element) {
  let styles = getComputedStyle(element);
  for(let key in styles) {
    if(styles.hasOwnProperty(key)) {
      element.style[key] = styles[key];
    }
  }

  for(let i = 0; i < element.childNodes.length; i++) {
    let node = element.childNodes[i];
    if(node.nodeType === 1) {
      inlineAllStyles(node);
    }
  }
}

/**
  Renders an SVG element to a Base64 encoded data URI.
  @method svgToImageUrl
  @param svg {SVGSVGElement} the svg element to render
*/
export function svgToImageUrl(svg, callback) {
  let clone = svg.cloneNode(true);
  let parent = svg.parentElement;

  let canvas = document.createElement('canvas');
  canvas.setAttribute('width', svg.getAttribute('width'));
  canvas.setAttribute('height', svg.getAttribute('height'));
  let context = canvas.getContext('2d');

  parent.insertBefore(clone, svg);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  inlineAllStyles(clone);

  let img = new Image();
  let blob = new Blob([clone.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
  clone.remove();
  let url = URL.createObjectURL(blob);

  img.onload = function(){
    context.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    if(callback) {
      callback(canvas.toDataURL());
    }
    canvas.remove();
  };

  img.src = url;
}

/**
  Triggers a download of an image rendered from the passed svg document
  @method downloadSvg
  @param svg {SVGSVGElement} the svg document to render
*/
export function downloadSvg(svg) {
  svgToImageUrl(svg, function(url) {
    let dlUrl = url.replace('image/png', 'image/octet-stream');
    location.href = dlUrl;
  });
}

/**
  @method getMousePoint
  @param container {SVGElement} the container reference to get the mouse position from
  @param e {MouseEvent} A DOM mouse event
  @return {Object} the {x, y} data of the mouse position relative to the container
*/
export function getMousePoint(container, e) {
  let x, y;

  if(e && isPresent(e.clientX) && isPresent(e.clientY)) {
    let svg = container.ownerSVGElement || container;
    if (svg.createSVGPoint) {
      let point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      point = point.matrixTransform(container.getScreenCTM().inverse());
      x = point.x;
      y = point.y;
    } else {
      let rect = container.getBoundingClientRect();
      x = e.clientX - rect.left - container.clientLeft;
      y = e.clientY - rect.top - container.clientTop;
    }
  }

  return {
    x: x,
    y: y,
  };
}

/**
  Creates an SVG path string for a rectangle
  @method getRectPath
  @param x the x position of the rectangle
  @param y {Number} the y position of the rectangle
  @param w {Number} the width of the rectangle
  @param h {Number} the height of the rectangle
  @return {String} the svg path string for the rectangle
*/
export function getRectPath(x, y, w, h) {
  x = +x || 0;
  y = +y || 0;
  w = +w || 0;
  h = +h || 0;
  let x2 = w + x;
  let y2 = h + y;
  return `M${x},${y} L${x},${y2} L${x2},${y2} L${x2},${y} L${x},${y}`;
}
