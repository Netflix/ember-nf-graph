/* globals getComputedStyle, Image, Blob, URL */
/**
  @module utils/nf/svg-dom
*/

/**
  Traverses an element and all of its descendants, setting their
  inline style property to whatever the computed style is.
  @method inlineAllStyles
  @param element {Element} the dom element to traverse.
  @private
*/
function inlineAllStyles(element) {
  var styles = getComputedStyle(element);
  for(var key in styles) {
    if(styles.hasOwnProperty(key)) {
      element.style[key] = styles[key];
    }
  }
  
  for(var i = 0; i < element.childNodes.length; i++) {
    var node = element.childNodes[i];
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
  var clone = svg.cloneNode(true);
  var parent = svg.parentElement;
  
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', svg.getAttribute('width'));
  canvas.setAttribute('height', svg.getAttribute('height'));
  var context = canvas.getContext('2d');
  
  parent.insertBefore(clone, svg);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  inlineAllStyles(clone);
  
  var img = new Image();  
  var blob = new Blob([clone.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
  clone.remove();
  var url = URL.createObjectURL(blob);
  
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
    var dlUrl = url.replace('image/png', 'image/octet-stream');
    location.href = dlUrl;
  });
}

/**
  @method getMousePoint
  @param container {SVGElement} the container reference to get the mouse position from
  @param e {MouseEvent} A DOM mouse event
  @return {Array} the [x,y] data of the mouse position relative to the container
*/
export function getMousePoint(container, e) {
  var x, y;
  
  if(e && e.hasOwnProperty('clientX') && e.hasOwnProperty('clientY')) {
    var svg = container.ownerSVGElement || container;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      point = point.matrixTransform(container.getScreenCTM().inverse());
      x = point.x;
      y = point.y;
    } else {
      var rect = container.getBoundingClientRect();
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
  var x2 = w + x;
  var y2 = h + y;
  return 'M%@1,%@2 L%@1,%@4 L%@3,%@4 L%@3,%@2 L%@1,%@2'.fmt(x, y, x2, y2);
}