/**
 * @name        jQuery KnobKnob plugin
 * @author      Martin Angelov
 * @version     1.0
 * @url         https://tutorialzine.com/2011/11/pretty-switches-css3-jquery/
 * @license     MIT License
 */

(function($){

    $.fn.knobKnob = function(props){

        var options = $.extend({
            snap: 0,
            value: 0,
            turn: function(){}
        }, props || {});

        var tpl = '<div class="knob">\
                <div class="top"></div>\
                <div class="base"></div>\
            </div>';

        return this.each(function(){

            var el = $(this);
            el.append(tpl);

            var knob = $('.knob',el)
                knobTop = knob.find('.top'),
                startDeg = -1,
                currentDeg = 0,
                rotation = 0,
                lastDeg = 0,
                doc = $(document);

            if(options.value > 0 && options.value <= 359){
                rotation = currentDeg = options.value;
                knobTop.css('transform','rotate('+(currentDeg)+'deg)');
                options.turn(currentDeg/179); // here was 359
            }

            knob.on('mousedown', function(e){

                e.preventDefault();

                var offset = knob.offset();
                var center = {
                    y : offset.top + knob.height()/2,
                    x: offset.left + knob.width()/2
                };

                var a, b, deg, tmp,
                    rad2deg = 180/Math.PI;

                knob.on('mousemove.rem',function(e){

                    a = center.y - e.pageY;
                    b = center.x - e.pageX;
                    deg = Math.atan2(a,b)*rad2deg;

                    // we have to make sure that negative
                    // angles are turned into positive:
                    if(deg<0){
                        deg = 360 + deg;
                    }

                    // Save the starting position of the drag
                    if(startDeg == -1){
                        startDeg = deg;
                    }

                    // Calculating the current rotation
                    tmp = Math.floor((deg-startDeg) + rotation);

                    // Making sure the current rotation
                    // stays between 0 and 359
                    if(tmp < 0){
                        tmp = 180 + tmp; // here was 360
                    }
                    else if(tmp > 179){ // here was 359
                        tmp = tmp % 180; // here was 360
                    }

                    // Snapping in the off position:
                    if(options.snap && tmp < options.snap){
                        tmp = 0;
                    }

                    // This would suggest we are at an end position;
                    // we need to block further rotation.
                    if(Math.abs(tmp - lastDeg) > 90){ // here was 180
                        return false;
                    }

                    currentDeg = tmp;
                    lastDeg = tmp;

                    knobTop.css('transform','rotate('+(currentDeg)+'deg)');
                    options.turn(currentDeg/179); // here was 359
                });

                doc.on('mouseup.rem',function(){
                    knob.off('.rem');
                    doc.off('.rem');

                    // Saving the current rotation
                    rotation = currentDeg;

                    // Marking the starting degree as invalid
                    startDeg = -1;
                });
            });
        });
    };

})(jQuery);

$(function(){

    var rad2deg = 180/Math.PI;
    var deg = 0;
    var bars = $('#bars');

    var colorBars = bars.find('.colorBar');
    var numBars = 0, lastNum = -1;

    $('#control').knobKnob({
        snap : 10,
        value: 154,
        turn : function(ratio){
            numBars = Math.round(colorBars.length*ratio);

            // Update the dom only when the number of active bars
            // changes, instead of on every move

            if(numBars == lastNum){
                return false;
            }
            lastNum = numBars;

            colorBars.removeClass('active').slice(0, numBars).addClass('active');
        }
    });

});
