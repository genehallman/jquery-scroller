(function ( $ ) {
  var states = [];
  var started = false;
  var body = null;

  var stepFn = function(state, scroll, height, trigger_callback) {
    return function() {
      if (state['top'] > scroll) {
        state.el.css(state['orig_properties']);
        if (trigger_callback) { state['callback'].call(state.el, 'above', state); }
        return;
      }
      if (state['bottom'] < scroll) {
        state.el.css(state['properties']);
        if (trigger_callback) { state['callback'].call(state.el, 'below', state); }
        return;
      }

      var top = state['top'],
        bottom = state['bottom'],
        new_props = {};

      var ratio = (scroll - top) / (bottom - top);
      for (var key in state['properties']) {
        new_props[key] = parseInt(state['orig_properties'][key], 10) +
          (ratio * (parseInt(state['properties'][key], 10) - parseInt(state['orig_properties'][key], 10)));
      }
      state.el.css(new_props);
    };
  };

  var startScroller = function() {
    started = setInterval(function() {
      var scroll = body.scrollTop();
      var height = body.height();
      
      for (var i in states) {

        if (states[i]['top'] <= scroll && states[i]['bottom'] >= scroll) {
          if (!states[i]['animating']) {
            states[i]['animating'] = true;
          }
        } else if (states[i]['animating']) {
          states[i]['animating'] = false;
          stepFn(states[i], scroll, height, true)();
        }

        if (states[i]['animating']) {
          stepFn(states[i], scroll, height)();
        }
      }
    }, 10);
  };
  
  $.fn.scroller = function(properties, options) {
    if (!body) {
      body = $('body');
    }
    var keys = [],
      scroll = body.scrollTop(),
      height = body.height(),
      top = options['top'] || 0,
      bottom = options['bottom'] || height;

    for(var k in properties) {
      keys.push(k);
    }
    if (top && typeof(top) == "string"  &&
      top.charAt(top.length-1) == "%") {
      top = height * parseInt(top, 10) / 100;
    }
    if (bottom && typeof(bottom) == "string"  &&
      bottom.charAt(bottom.length-1) == "%") {
      bottom = height * parseInt(bottom, 10) / 100;
    }

    states.push({
      top: top,
      bottom: bottom,
      options: options,
      el: this,
      animating: false,
      properties: properties,
      orig_properties: this.css(keys),
      callback: options['callback'] || function() {console.log(arguments[0])}
    });
    stepFn(states[states.length -1], scroll, height)();
    
    if (!started) {
      startScroller();
    }
    return this;
  };

}( jQuery ));
