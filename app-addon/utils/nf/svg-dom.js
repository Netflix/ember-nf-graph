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
function svgToImageUrl(svg, callback) {
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

function downloadSvg(svg) {
  svgToImageUrl(svg, function(url) {
    var dlUrl = url.replace('image/png', 'image/octet-stream');
    location.href = dlUrl;
  });
}