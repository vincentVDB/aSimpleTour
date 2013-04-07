  /**
 * jQuery aSimpleTour
 *
 * @description Tour web
 * @author alvaro.veliz@gmail.com
 * @servedby perkins (http://p.erkins.com)
 * 
 * Dependencies :
 * - jQuery scrollTo
 * 
 * This idea is based on http://tympanus.net/codrops/2010/12/21/website-tour/ by Manoela Lic (https://twitter.com/#!/crnacura)
 */

(function( $ ) {

  var settings = {
    data : [],
    autoStart : false,
    controlsPosition : 'TR',
    welcomeMessage : '<h2>Tour</h2><p>Welcome to the Tour Plugin</p>',
    buttons : {
      next : 'Next >>',
      prev : '<< Previous',
      start : 'Start >>',
      end : 'End [X]'
    },
    controlsColors : {
      background: 'rgb(8, 68, 142)', // IE7
      color: '#fff'
    },
    tooltipColors : {
      background: 'rgb(0, 0, 0)', // IE7
      color: '#fff'
    }
  };

  var options, step, steps;
  var ew, eh, el, et;
  var started = false;
  var direction = 'f';

  var $tooltip    = $('<div>',{
                      id         : 'tourtip',
                      className  : 'tourtip',
                      html       : ''
                    }).css({
                      'display'     : 'none',
                      'z-index'     : '999',    //vdb
                      'padding'     : '10px 20px',
                      'position'    : 'absolute',
                      'font-family' : 'sans-serif',
                      'border-radius' : '5px',
                      'font-size'   : '12px',
                      'box-sizing'  : 'border-box'
                    });

  var methods = {
    init : function( opts ) {
      if (started == false ) {
        started = true;
        options = $.extend(settings, opts);
        
      	// HTML control panel 
        controls = '<div id="tourControls">\
		    	<button id="tourEnd" style="float:right;">'+options.buttons.end+'</button>\
          <div id="tourText">'+options.welcomeMessage+'</div>\
          <div id="tourButtons">\
            <button id="tourNext"  style="float:right;">'+options.buttons.start+'</button>\
            <button id="tourPrev" style="display:none">'+options.buttons.prev+'</button>\
          </div>\
        </div>';
        
        $controlsCss = { 'display' : 'block', 
        		 'z-index': '999', // vdb
        		 'position': 'fixed', 
        		 'width' : '200px', 
        		 'padding' : '10px 20px', 
        		 'border-radius' : '10px', 
        		 'font-family' : 'sans-serif' };
        $controls = $(controls).css($controlsCss).css(options.controlsColors);
        $cpos = methods.getControlPosition(options.controlsPosition);
        $controls.css($cpos);
        $('body').append($controls);

        $tooltip.css(options.tooltipColors);

        step = -1;
        steps = options.data.length;
        $('body').prepend($tooltip);  
      }
    },
    next : function() {
      direction = 'f';
      do{ // vdb02
        step++;
  
        if (step == steps) {
          methods.destroy();
          return; // vdb02
        }else{
          $tooltip.hide();
          stepData = options.data[step];
  
          if (step < steps - 1 ) {
            $('#tourPrev').show();
            $('#tourNext').show().html(options.buttons.next);
          }else{
      		  $('#tourNext').hide();
          }
        }
      }while( methods.setTooltip(stepData) == false ); // vdb02
    },
    prev : function() {
      direction = 'b';

      $tooltip.hide();
    	do{ // vdb02

        if (step < steps) {
          $('#tourNext').show().html(options.buttons.next);
        }
  
        if (step <= 0) {
          $('#tourPrev').hide();
          //$('#tourEnd').hide();
          $('#tourNext').html(options.buttons.start);
          step--;
          return;
        }
        else {
          step--;
          stepData = options.data[step];
        }
  	}while( methods.setTooltip(stepData) == false ); // vdb02

  },
    setTooltip : function(stepData) {
      $element = $(stepData.element);
    	if( $element.length == 0 ){	// vdb02
  			return false; // vdb02
  		};

      if (stepData.controlsPosition) {
        methods.setControlsPosition(stepData.controlsPosition);
      }

      if (stepData.tooltip) {
        $tooltip.html(stepData.tooltip);
        text = (typeof stepData.text != 'undefined') ? stepData.text : stepData.welcomeMessage;
        $('#tourText').html(text);
        
        tooltipPos = (typeof stepData.position == 'undefined') ? 'BL' : stepData.position;
        $pos = methods.getTooltipPosition(tooltipPos, $element);
        
        $tooltip.css({ 'top': $pos.top+'px', 'left': $pos.left+'px' });
        $tooltip.show('fast');  

        $.scrollTo($tooltip, 400, { offset : -100});
      }


      if (typeof stepData.callback != 'undefined') {
        if (stepData.callback == 'click') {
          urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
          urlslugRegex = /^[a-z0-9-]+$/;

          if (urlRegex.test($element.attr('href')) || urlslugRegex.test($element.attr('href')) ) {
            location.href = $element.attr('href');
          }
          else {
            $element.trigger('click');  
          }
        }
        else {
          if (typeof eval(stepData.callback) == 'function') {
            eval(stepData.callback);
          }
        }
      }

      if (stepData.next === true) {
        if (direction == 'f') {
          methods.next();  
        }
        else {
          methods.prev();
        }
      }
      return true; // vdb02

    },
    setControlsPosition : function(pos) {
      chtml = $controls.html();
      $controls.remove();
      $controls = $(controls).html(chtml);
      $controls = $controls.css($controlsCss).css(options.controlsColors);
      position = methods.getControlPosition(pos);
      $controls.css(position);
      $('body').append($controls);
    },
    getTooltipPosition : function(pos, $e) {
      ew = $element.outerWidth();
      eh = $element.outerHeight();
      el = $element.offset().left;
      et = $element.offset().top;
      tw = $tooltip.width() + parseInt($tooltip.css('padding-left')) + parseInt($tooltip.css('padding-right'));
      th = $tooltip.height() + parseInt($tooltip.css('padding-top')) +  + parseInt($tooltip.css('padding-bottom'));

      $('.tourArrow').remove();
      tbg = $tooltip.css('background-color');

      $upArrow = $('<div class="tourArrow"></div>').css({ 'position' : 'absolute', 'display' : 'block', 'width' : '0', 'height' : '0', 'border-left' : '5px solid transparent', 'border-right' : '5px solid transparent', 'border-bottom' : '5px solid '+tbg });
      $downArrow = $('<div class="tourArrow"></div>').css({ 'position' : 'absolute', 'display' : 'block', 'width' : '0', 'height' : '0', 'border-left' : '5px solid transparent', 'border-right' : '5px solid transparent', 'border-top' : '5px solid '+tbg });
      $rightArrow = $('<div class="tourArrow"></div>').css({ 'position' : 'absolute', 'display' : 'block', 'width' : '0', 'height' : '0', 'border-top' : '5px solid transparent', 'border-bottom' : '5px solid transparent', 'border-left' : '5px solid '+tbg });
      $leftArrow = $('<div class="tourArrow"></div>').css({ 'position' : 'absolute', 'display' : 'block', 'width' : '0', 'height' : '0', 'border-top' : '5px solid transparent', 'border-bottom' : '5px solid transparent', 'border-right' : '5px solid '+tbg });

      switch (pos) {
        case 'BL' :
          position = { 'left'  : el, 'top' : et + eh + 10 };
          $upArrow.css({ top: '-5px', left: tw/2 - 10/2 });
          $tooltip.prepend($upArrow);
          break;

        case 'BR' :
          position = { 'left'  : el + (ew - tw), 'top' : et + eh + 10 };
          $upArrow.css({ top: '-5px', left: tw/2 - 10/2 });
          $tooltip.prepend($upArrow);
          break;

        case 'TL' :
          position = { 'left'  : el, 'top' : (et - th) - 10 };
          $downArrow.css({ top: th, left: tw/2 - 10/2 });
          $tooltip.append($downArrow);
          break;

        case 'TR' :
          position = { 'left'  : el + (ew - tw), 'top' : (et - th) - 10 };
          $downArrow.css({ top: th, left: tw/2 - 10/2 });
          $tooltip.append($downArrow);
          break;

        case 'RT' :
          position = { 'left'  : (el + ew) + 10, 'top' : et };
          $leftArrow.css({ top: th/2 - 10/2, left: '-5px' });
          $tooltip.prepend($leftArrow);
          break;

        case 'RB' :
          position = { 'left'  : (el + ew) + 10, 'top' : et + (eh - th) }; 
          $leftArrow.css({ top: th/2 - 10/2, left: '-5px' });
          $tooltip.prepend($leftArrow);
          break;

        case 'LT' :
          position = { 'left'  : (el - tw) - 10, 'top' : et };
          $rightArrow.css({ top: th/2 - 10/2, right: '-5px' });
          $tooltip.prepend($rightArrow);
          break;

        case 'LB' :
          position = { 'left'  : (el - tw) - 10, 'top' : et + (eh - th) };
          $rightArrow.css({ top: th/2 - 10/2, right: '-5px' });
          $tooltip.prepend($rightArrow);
          break;

        case 'B'  :
          position = { 'left'  : el + (ew - tw)/2, 'top' : (et + eh) + 10 };
          $upArrow.css({ top: '-5px', left: tw/2 - 10/2 });
          $tooltip.prepend($upArrow);
          break;

        case 'L'  :
          position = { 'left'  : (el - tw) - 10, 'top' : et + (eh - th)/2 };
          $rightArrow.css({ top: th/2 - 10/2, right: '-5px' });
          $tooltip.prepend($rightArrow);
          break;

        case 'T'  :
          position = { 'left'  : el + (ew - tw)/2, 'top' : (et - th) - 10 };
          $downArrow.css({ top: th, left: tw/2 - 10/2 });
          $tooltip.append($downArrow);
          break;

        case 'R'  :
          position = { 'left'  : (el + ew) + 10, 'top' : et + (eh - th)/2 };
          $leftArrow.css({ top: th/2 - 10/2, left: '-5px' });
          $tooltip.prepend($leftArrow);
          break;
      }
      return position;
    },
    getControlPosition: function(pos) {
      switch (pos)
      {
        case 'TR':
          pos = { 'top' : '10px', 'right' : '10px' };
          break;

        case 'TL':
          pos = { 'top' : '10px', 'left' : '10px' };
          break;

        case 'BL':
          pos = { 'bottom' : '10px', 'left' : '10px' };
          break;

        case 'BR':
          pos = { 'bottom' : '10px', 'right' : '10px' };
          break;
      }
      return pos;
    },
    destroy : function() {
      $('#tourControls').remove();
      $('#tourtip').remove();
      $tooltip.css({ 'display' : 'none' }).html('');
      step = -1;
      started = false;
    }
  };

  //$('#tourNext').live('click', function() { // live : deprecied
  $(document).on('click', '#tourNext', function() {
    methods.next();
  });

  //$('#tourPrev').live('click', function() {
  $(document).on('click', '#tourPrev', function() {
    methods.prev();
  });

  // $('#tourEnd').live('click', function() {
  $(document).on('click', '#tourEnd', function() {
    methods.destroy();
  })

  $.fn.aSimpleTour = function( method )
  {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } 
    else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } 
    else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.aSimpleTour' );
    }   
  };

})(jQuery);

// Direct Access
$.aSimpleTour = function(opts) { $.fn.aSimpleTour(opts); }
