// HACK: this is to patch JQuery to not be completely behind the times with its treatment of SVG classes
(function($) {
  function _identity(x) { return x; }

  function _getClassArray(el) {
    return el.getAttribute('class').split(' ').filter(_identity);
  }

  if($) {
    // Modern browsers only for now!
    // Open to pull requests.
    $.fn.addClass = function(value) {
      var proceed = typeof value === "string" && value;

      if (proceed) {
        var toAdd = value.split(' ');

        $(this).each(function(i, el) {
          if(el.classList) {
            toAdd.forEach(function(cls) {
              if(cls) {
                el.classList.add(cls);
              }
            });
          } else {
            el.setAttribute('class', _getClassArray(el).concat(toAdd).join(' '));
          }
        });
      }

      return $(this);
    };

    $.fn.removeClass = function(value) {
      return $(this).each(function(i, el) {
        var toRemove = (value || '').split(' ').filter(_identity);
        if(el.classList) {
          toRemove.forEach(function(cls) {
            if(cls) {
              el.classList.remove(cls);
            }
          });
        } else {
          var classes = _getClassArray(el);
          el.setAttribute('class', classes.filter(function(cls) {
            return toRemove.indexOf(cls);
          }).join(' '));
        }
      });
    };
  }
}(window.jQuery));
