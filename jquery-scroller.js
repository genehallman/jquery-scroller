(function ( $ ) {
  var scrollers = {};

  var stepFn = function(states, scroll, height) {
        
    var current = $.extend({}, states[0].orig_properties);
    
    for (var i in states) {
      var state = states[i];
      console.log("logger", states[0]);


      if (scroll <= state.top) {
        console.log("pre state " + i, current);
        state.el.css(current);
        return;
      } else if (scroll > state.top && scroll < state.bottom) {
        console.log("mid state " + i, current);
        var new_props = {};
        var ratio = (scroll - state.top) / (state.bottom - state.top);

        for (var key in state.properties) {
          new_props[key] = parseInt(current[key], 10) +
            (ratio * (parseInt(state.properties[key], 10) - parseInt(current[key], 10)));
        }
        state.el.css(new_props);
        return;
      } else if (scroll >= state.bottom) {
        $.extend(current, state.properties);
        if (i == states.length - 1) {
          console.log("post state " + i, current);
          state.el.css(current);
          return;
        }
      }
    }
  };

  $(window).scroll(function() {
      var scroll = $(document).scrollTop() + ($(window).height()/2);
      var height = $(document).height();

      console.log(Math.round(scroll/height * 100));

      for (var selector in scrollers) {
        if (selector != "#welcome") {
          var old_log = console.log;
          console.log = function() {};
        }
        
        console.log(selector);
        stepFn(scrollers[selector], scroll, height);

        if (selector != "#welcome") {
          console.log = old_log;
        }

      }
  });
  
  $.fn.scroller = function(properties, options) {
    var keys = [],
      scroll = $(document).scrollTop() + ($(window).height()/2),
      height = $(document).height(),
      top = options['top'] || 0,
      bottom = options['bottom'] || height;

    for(var k in properties) {
      keys.push(k);
    }

    if (typeof(top) == "string" && top.charAt(top.length-1) == "%") {
      top = height * parseFloat(top) / 100;
    }
    if (typeof(bottom) == "string" && bottom.charAt(bottom.length-1) == "%") {
      bottom = height * parseFloat(bottom) / 100;
    }


    if (!scrollers[this.selector]) {
      console.log("creating...");
      scrollers[this.selector] = [];
    }
    console.log(this.selector);
    scrollers[this.selector].push({
      top: top,
      bottom: bottom,
      options: options,
      animating: false,
      properties: properties,
      orig_properties: this.css(keys),
      keys: keys,
      el: this
    });
    
    stepFn(scrollers[this.selector], scroll, height);
    
    return this;
  };

}( jQuery ));
