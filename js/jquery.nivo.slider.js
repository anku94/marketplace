/*
 * jQuery Nivo Slider v2.7.1
 * http://nivo.dev7studios.com
 *
 * Copyright 2011, Gilbert Pellegrom
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * March 2010
 */

(function($) {
    var NivoSlider = function(element, options){
		//Defaults are below
		var settings = $.extend({}, $.fn.nivoSlider.defaults, options);

        //Useful variables. Play carefully.
        var vars = {
            currentSlide: 0,
            currentImage: '',
            totalSlides: 0,
            running: false,
            paused: false,
            stop: false
        };
    
        //Get this slider
        var slider = $(element);
        slider.data('nivo:vars', vars);
        slider.addClass('nivoSlider');
	//Find our slider children
	var default_width=($('#content').width()-20);
	var default_height=($('#content').height()-25);
	slider.width(default_width);
	slider.height(default_height);
	var n_slides=document.getElementById("slider").getElementsByTagName("img");
	var kids = slider.children();
        kids.each(function() {
        /*    var child = $(this);
            var link = '';
            if(!child.is('img')){
                if(child.is('a')){
                    child.addClass('nivo-imageLink');
                    link = child;
                }
                child = child.find('img:first');
            }
            //Get img width & height
            var childWidth = child.width();
            if(childWidth == 0) childWidth = child.attr('width');
            var childHeight = child.height();
            if(childHeight == 0) childHeight = child.attr('height');
            //Resize the slider
	    if(childWidth > slider.width()){
       //         slider.width(childWidth);
            }
            if(childHeight > slider.height()){
	//	 slider.height(childHeight);
            }
            if(link != ''){
                link.css('display','none');
            }
            child.css('display','none');
       */     vars.totalSlides++;
        });
        
        //If randomStart
        if(settings.randomStart){
        	settings.startSlide = Math.floor(Math.random() * vars.totalSlides);
        }
        
        //Set startSlide
        if(settings.startSlide > 0){
            if(settings.startSlide >= vars.totalSlides) settings.startSlide = vars.totalSlides - 1;
            vars.currentSlide = settings.startSlide;
        }
        
        //Get initial image
        if($(kids[vars.currentSlide]).is('img')){
            vars.currentImage = $(kids[vars.currentSlide]);
        } else {
            vars.currentImage = $(kids[vars.currentSlide]).find('img:first');
        }
        //Show initial link
        if($(kids[vars.currentSlide]).is('a')){
            $(kids[vars.currentSlide]).css('display','block');
        }
        
        //Set first background
	var scase = 0;
	if(slider.height()<vars.currentImage.height()) {
		var new_width=(vars.currentImage.width()/vars.currentImage.height())*(slider.height());
		if(new_width<slider.width())
			slider.width(new_width);
		scase = 1;
	}
	if(slider.width()<vars.currentImage.width()) {
		var new_height=(vars.currentImage.height()/vars.currentImage.width())*(slider.width());
		if(new_height<slider.height())
			slider.height(new_height);
		scase = 1;
	}
	if(!scase){
			slider.height(vars.currentImage.height());
			slider.width(vars.currentImage.width());
	}
	slider.css({'background':'url("'+ vars.currentImage.attr('src') +'") no-repeat center ','background-size':'contain','margin':'0 auto','top':(($('#content').height())-slider.height())/2});

//Create caption
        slider.append(
            $('<div class="nivo-caption"><p></p></div>').css({ display:'none', opacity:settings.captionOpacity })
        );		
        
        // Cross browser default caption opacity
        $('.nivo-caption', slider).css('opacity', 0);
		
		// Process caption function
		var processCaption = function(settings){
			var nivoCaption = $('.nivo-caption', slider);
			if(vars.currentImage.attr('title') != '' && vars.currentImage.attr('title') != undefined){
				var title = vars.currentImage.attr('title');
				if(title.substr(0,1) == '#') title = $(title).html();	

				if(nivoCaption.css('opacity') != 0){
					nivoCaption.find('p').stop().fadeTo(settings.animSpeed, 0, function(){
						$(this).html(title);
						$(this).stop().fadeTo(settings.animSpeed, 1);
					});
				} else {
					nivoCaption.find('p').html(title);
				}					
				nivoCaption.stop().fadeTo(settings.animSpeed, settings.captionOpacity);
			} else {
				nivoCaption.stop().fadeTo(settings.animSpeed, 0);
			}
		}
		
        //Process initial  caption
        processCaption(settings);
        settings.manualAdvance=true;
	//In the words of Super Mario "let's a go!"
        var timer = 0;
        if(!settings.manualAdvance && kids.length > 1){
            timer = setInterval(function(){ nivoRun(slider, kids, settings, false); }, settings.pauseTime);
        }
	 n_slides=document.getElementsByClassName("linker").length;
	 for (var i = 0; i < n_slides; i+=1) { 
		 (function (i) { 
		  document.getElementById('slide'+(i+1)).onclick = function () { 
	 		    nivoRun(slider, kids, settings, 'next',i);
		  }; 
		  }) (i); 
	 }
	 n_slides=document.getElementById("mycarousel").getElementsByTagName("li");
	 for (var i = 0; i < n_slides.length; i+=1) { 
		 (function (i) { 
		  n_slides[i].onclick = function () { 
	 		    nivoRun(slider, kids, settings, 'next',i-1);
		  }; 
		  }) (i); 
	 }
	 
	 //Add Direction nav
        if(settings.directionNav){
            slider.append('<div class="nivo-directionNav"><a class="nivo-prevNav">'+ settings.prevText +'</a><a class="nivo-nextNav">'+ settings.nextText +'</a></div>');
            
            //Hide Direction nav
            if(settings.directionNavHide){
                $('.nivo-directionNav', slider).hide();
                slider.hover(function(){
                    $('.nivo-directionNav', slider).show();
                }, function(){
                    $('.nivo-directionNav', slider).hide();
                });
            }
            
            $('a.nivo-prevNav', slider).live('click', function(){
                if(vars.running) return false;
                clearInterval(timer);
                timer = '';
                vars.currentSlide -= 2;
                nivoRun(slider, kids, settings, 'prev');
            });
            
            $('a.nivo-nextNav', slider).live('click', function(){
                if(vars.running) return false;
                clearInterval(timer);
                timer = '';
                nivoRun(slider, kids, settings, 'next');
            });
        }
        
        //Add Control nav
        if(settings.controlNav){
            var nivoControl = $('<div class="nivo-controlNav"></div>');
            slider.append(nivoControl);
            for(var i = 0; i < kids.length; i++){
                if(settings.controlNavThumbs){
                    var child = kids.eq(i);
                    if(!child.is('img')){
                        child = child.find('img:first');
                    }
                    if (settings.controlNavThumbsFromRel) {
                        nivoControl.append('<a class="nivo-control" rel="'+ i +'"><img src="'+ child.attr('rel') + '" alt="" /></a>');
                    } else {
                        nivoControl.append('<a class="nivo-control" rel="'+ i +'"><img src="'+ child.attr('src').replace(settings.controlNavThumbsSearch, settings.controlNavThumbsReplace) +'" alt="" /></a>');
                    }
                } else {
                    nivoControl.append('<a class="nivo-control" rel="'+ i +'">'+ (i + 1) +'</a>');
                }
                
            }
            //Set initial active link
            $('.nivo-controlNav a:eq('+ vars.currentSlide +')', slider).addClass('active');
            
            $('.nivo-controlNav a', slider).live('click', function(){
                if(vars.running) return false;
                if($(this).hasClass('active')) return false;
                clearInterval(timer);
                timer = '';
                slider.css('background','url("'+ vars.currentImage.attr('src') +'") no-repeat ');
                vars.currentSlide = $(this).attr('rel') - 1;
            });
        }
        
        //Keyboard Navigation
        if(settings.keyboardNav){
            $(window).keypress(function(event){
                //Left
                if(event.keyCode == '37'){
                    if(vars.running) return false;
                    clearInterval(timer);
                    timer = '';
                    vars.currentSlide-=2;
                    nivoRun(slider, kids, settings, 'prev');
                }
                //Right
                if(event.keyCode == '39'){
                    if(vars.running) return false;
                    clearInterval(timer);
                    timer = '';
                    nivoRun(slider, kids, settings, 'next');
                }
            });
        }
        
        //For p setting
        if(settings.pauseOnHover){
            slider.hover(function(){
                vars.paused = true;
                clearInterval(timer);
                timer = '';
            }, function(){
                vars.paused = false;
                //Restart the timer
                if(timer == '' && !settings.manualAdvance){
                    timer = setInterval(function(){ nivoRun(slider, kids, settings, false); }, settings.pauseTime);
                }
            });
        }
        
        //Event when Animation finishes
        slider.bind('nivo:animFinished', function(){ 
            vars.running = false; 
            //Hide child links
            $(kids).each(function(){
                if($(this).is('a')){
                    $(this).css('display','none');
                }
            });
            //Show current link
            if($(kids[vars.currentSlide]).is('a')){
                $(kids[vars.currentSlide]).css('display','block');
            }
            //Restart the timer
            if(timer == '' && !vars.paused && !settings.manualAdvance){
                timer = setInterval(function(){ nivoRun(slider, kids, settings, false); }, settings.pauseTime);
            }
            //Trigger the afterChange callback
            settings.afterChange.call(this);
        });
        
        // Add slices for slice animations
        var createSlices = function(slider, settings, vars){
		for(var i = 0; i < settings.slices; i++){
				var sliceWidth = Math.round(slider.width()/settings.slices);
				if(i == settings.slices-1){
					slider.append(
						$('<div class="nivo-slice"></div>').css({ 
							left:(sliceWidth*i)+'px', width:(slider.width()-(sliceWidth*i))+'px',
							height:'0px', 
							opacity:'0', 
							background: 'url("'+ vars.currentImage.attr('src') +'") no-repeat -'+ ((sliceWidth + (i * sliceWidth)) - sliceWidth) +'px 0%',
						})
					);
				} else {
					slider.append(
						$('<div class="nivo-slice"></div>').css({ 
							left:(sliceWidth*i)+'px', width:sliceWidth+'px',
							height:'0px', 
							opacity:'0', 
							background: 'url("'+ vars.currentImage.attr('src') +'") no-repeat -'+ ((sliceWidth + (i * sliceWidth)) - sliceWidth) +'px 0%',
						})
					);
				}
			}
        }
		
		// Add boxes for box animations
		var createBoxes = function(slider, settings, vars){
			var boxWidth = Math.round(slider.width()/settings.boxCols);
			var boxHeight = Math.round(slider.height()/settings.boxRows);
			
			for(var rows = 0; rows < settings.boxRows; rows++){
				for(var cols = 0; cols < settings.boxCols; cols++){
					if(cols == settings.boxCols-1){
						slider.append(
							$('<div class="nivo-box"></div>').css({ 
								opacity:0,
								left:(boxWidth*cols)+'px', 
								top:(boxHeight*rows)+'px',
								width:(slider.width()-(boxWidth*cols))+'px',
								height:boxHeight+'px',
								background: 'url("'+ vars.currentImage.attr('src') +'") no-repeat -'+ ((boxWidth + (cols * boxWidth)) - boxWidth) +'px -'+ ((boxHeight + (rows * boxHeight)) - boxHeight) +'px',
							})
						);
					} else {
						slider.append(
							$('<div class="nivo-box"></div>').css({ 
								opacity:0,
								left:(boxWidth*cols)+'px', 
								top:(boxHeight*rows)+'px',
								width:boxWidth+'px',
								height:boxHeight+'px',
								background: 'url("'+ vars.currentImage.attr('src') +'") no-repeat -'+ ((boxWidth + (cols * boxWidth)) - boxWidth) +'px -'+ ((boxHeight + (rows * boxHeight)) - boxHeight) +'px',
							})
						);
					}
				}
			}
		}

        // Private run method
		var nivoRun = function(slider, kids, settings, nudge, switch_no){
			slider.css('background-image','none');
			slider.width(($('#content').width())-20);
			slider.height(($('#content').height())-25);
			slider.css('margin','0 auto');
			//Get our vars
			var vars = slider.data('nivo:vars');
        		if(switch_no>=-1) vars.currentSlide=switch_no;   
	//Trigger the lastSlide callback
            if(vars && (vars.currentSlide == vars.totalSlides - 1)){ 
		    		settings.lastSlide.call(this);
			}
            
            // Stop
			if((!vars || vars.stop) && !nudge) return false;
			
			//Trigger the beforeChange callback
			settings.beforeChange.call(this);
					
			//Set current background before change
	/*		if(!nudge){
				slider.css('background','url("'+ vars.currentImage.attr('src') +'") no-repeat center');
			} else {
				if(nudge == 'prev'){
					slider.css('background','url("'+ vars.currentImage.attr('src') +'") no-repeat center');
				}
				if(nudge == 'next'){
					slider.css('background','url("'+ vars.currentImage.attr('src') +'") no-repeat center');
				}
			}
	*/		
	/*		slider.fadeTo('slow', 0.3, function()
					{
				$(this).css({'background':'url("css2/default/loading.gif") no-repeat center','background-color':'white'});
					}).fadeTo('slow', 1);
	*/		vars.currentSlide++;
          
		//Trigger the slideshowEnd callback
			if(vars.currentSlide == vars.totalSlides){ 
				vars.currentSlide = 0;
				settings.slideshowEnd.call(this);
			}
			if(vars.currentSlide < 0) vars.currentSlide = (vars.totalSlides - 1);
			//Set vars.currentImage
			if($(kids[vars.currentSlide]).is('img')){
				vars.currentImage = $(kids[vars.currentSlide]);
			} else {
				vars.currentImage = $(kids[vars.currentSlide]).find('img:first');
			}
		/*	if (vars.currentImage.width()>(($('#content').width())-20)) {
				$('.nivo-slice', slider).remove();
				$('.nivo-box', slider).remove();
				slider.width((vars.currentImage.width()/vars.currentImage.height())*(slider.height()));
				slider.css('top',(($('#content').height())-slider.height())/2);
				slider.fadeTo('slow', 0.3, function()
						{
					slider.css({'background':'url("'+ vars.currentImage.attr('src') +'") no-repeat center','background-size':'contain'});
						}).fadeTo('slow', 1);
					return;
			}
			else {
				slider.width(vars.currentImage.width());
				slider.height(vars.currentImage.height());
				slider.css('top',(($('#content').height())-slider.height())/2);
				slider.fadeTo('slow', 0.3, function()
						{
						$(this).css('background','url("'+ vars.currentImage.attr('src') +'") no-repeat center');
						}).fadeTo('slow', 1);
				$('.nivo-slice', slider).remove();
				$('.nivo-box', slider).remove();
				return;
			}
		*/	
				var scase = 0;
				if(slider.height()<vars.currentImage.height()) {
					var new_width=(vars.currentImage.width()/vars.currentImage.height())*(slider.height());
					if(new_width<slider.width())
						slider.width(new_width);
					scase = 1;
				}   
				if(slider.width()<vars.currentImage.width()) {
					var new_height=(vars.currentImage.height()/vars.currentImage.width())*(slider.width());
					if(new_height<slider.height())
						slider.height(new_height);
					scase = 1;
				}   
				if(!scase){
					slider.height(vars.currentImage.height());
					slider.width(vars.currentImage.width());
				}   
				slider.css('top',(($('#content').height())-slider.height())/2);
			if (vars.currentImage.width()>(($('#content').width())-20)||vars.currentImage.height()>($('#content').height()-25)) {
				$('.nivo-slice', slider).remove();
				$('.nivo-box', slider).remove();
				slider.fadeTo('slow', 0.3, function()
						{
				slider.css({'background':'url("'+ vars.currentImage.attr('src') +'") no-repeat center ','background-size':'contain','margin':'0 auto','top':(($('#content').height())-slider.height())/2});
						}).fadeTo('slow', 1);
				return;
			}

			//Set active links
			if(settings.controlNav){
				$('.nivo-controlNav a', slider).removeClass('active');
				$('.nivo-controlNav a:eq('+ vars.currentSlide +')', slider).addClass('active');
			}
			
			//Process caption
			processCaption(settings);
			
			// Remove any slices from last transition
			$('.nivo-slice', slider).remove();
			
			// Remove any boxes from last transition
			$('.nivo-box', slider).remove();
			
			var currentEffect = settings.effect;
			//Generate random effect
			if(settings.effect == 'random'){
				var anims = new Array('sliceDownRight','sliceDownLeft','sliceUpRight','sliceUpLeft','sliceUpDown','sliceUpDownLeft','fold','fade',
                'boxRandom','boxRain','boxRainReverse','boxRainGrow','boxRainGrowReverse');
				currentEffect = anims[Math.floor(Math.random()*(anims.length + 1))];
				if(currentEffect == undefined) currentEffect = 'fade';
			}
            
            //Run random effect from specified set (eg: effect:'fold,fade')
            if(settings.effect.indexOf(',') != -1){
                var anims = settings.effect.split(',');
                currentEffect = anims[Math.floor(Math.random()*(anims.length))];
				if(currentEffect == undefined) currentEffect = 'fade';
            }
            
            //Custom transition as defined by "data-transition" attribute
            if(vars.currentImage.attr('data-transition')){
            	currentEffect = vars.currentImage.attr('data-transition');
            }
		
			//Run effects
			vars.running = true;
			if(currentEffect == 'sliceDown' || currentEffect == 'sliceDownRight' || currentEffect == 'sliceDownLeft'){
				createSlices(slider, settings, vars);
				var timeBuff = 0;
				var i = 0;
				var slices = $('.nivo-slice', slider);
				if(currentEffect == 'sliceDownLeft') slices = $('.nivo-slice', slider)._reverse();
				
				slices.each(function(){
					var slice = $(this);
					slice.css({ 'top': '0px' });
					if(i == settings.slices-1){
						setTimeout(function(){
							slice.animate({ height:'100%', opacity:'1.0' }, settings.animSpeed, '', function(){ slider.trigger('nivo:animFinished'); });
						}, (100 + timeBuff));
					} else {
						setTimeout(function(){
							slice.animate({ height:'100%', opacity:'1.0' }, settings.animSpeed);
						}, (100 + timeBuff));
					}
					timeBuff += 50;
					i++;
				});
			} 
			else if(currentEffect == 'sliceUp' || currentEffect == 'sliceUpRight' || currentEffect == 'sliceUpLeft'){
				createSlices(slider, settings, vars);
				var timeBuff = 0;
				var i = 0;
				var slices = $('.nivo-slice', slider);
				if(currentEffect == 'sliceUpLeft') slices = $('.nivo-slice', slider)._reverse();
				
				slices.each(function(){
					var slice = $(this);
					slice.css({ 'bottom': '0px' });
					if(i == settings.slices-1){
						setTimeout(function(){
							slice.animate({ height:'100%', opacity:'1.0' }, settings.animSpeed, '', function(){ slider.trigger('nivo:animFinished'); });
						}, (100 + timeBuff));
					} else {
						setTimeout(function(){
							slice.animate({ height:'100%', opacity:'1.0' }, settings.animSpeed);
						}, (100 + timeBuff));
					}
					timeBuff += 50;
					i++;
				});
			} 
			else if(currentEffect == 'sliceUpDown' || currentEffect == 'sliceUpDownRight' || currentEffect == 'sliceUpDownLeft'){
				createSlices(slider, settings, vars);
				var timeBuff = 0;
				var i = 0;
				var v = 0;
				var slices = $('.nivo-slice', slider);
				if(currentEffect == 'sliceUpDownLeft') slices = $('.nivo-slice', slider)._reverse();
				
				slices.each(function(){
					var slice = $(this);
					if(i == 0){
						slice.css('top','0px');
						i++;
					} else {
						slice.css('bottom','0px');
						i = 0;
					}
					
					if(v == settings.slices-1){
						setTimeout(function(){
							slice.animate({ height:'100%', opacity:'1.0' }, settings.animSpeed, '', function(){ slider.trigger('nivo:animFinished'); });
						}, (100 + timeBuff));
					} else {
						setTimeout(function(){
							slice.animate({ height:'100%', opacity:'1.0' }, settings.animSpeed);
						}, (100 + timeBuff));
					}
					timeBuff += 50;
					v++;
				});
			} 
			else if(currentEffect == 'fold'){
				createSlices(slider, settings, vars);
				var timeBuff = 0;
				var i = 0;
				
				$('.nivo-slice', slider).each(function(){
					var slice = $(this);
					var origWidth = slice.width();
					slice.css({ top:'0px', height:'100%', width:'0px' });
					if(i == settings.slices-1){
						setTimeout(function(){
							slice.animate({ width:origWidth, opacity:'1.0' }, settings.animSpeed, '', function(){ slider.trigger('nivo:animFinished'); });
						}, (100 + timeBuff));
					} else {
						setTimeout(function(){
							slice.animate({ width:origWidth, opacity:'1.0' }, settings.animSpeed);
						}, (100 + timeBuff));
					}
					timeBuff += 50;
					i++;
				});
			}  
			else if(currentEffect == 'fade'){
				createSlices(slider, settings, vars);
				
				var firstSlice = $('.nivo-slice:first', slider);
                firstSlice.css({
                    'height': '100%',
                    'width': slider.width() + 'px'
                });
    
				firstSlice.animate({ opacity:'1.0' }, (settings.animSpeed*2), '', function(){ slider.trigger('nivo:animFinished'); });
			}          
            else if(currentEffect == 'slideInRight'){
				createSlices(slider, settings, vars);
				
                var firstSlice = $('.nivo-slice:first', slider);
                firstSlice.css({
                    'height': '100%',
                    'width': '0px',
                    'opacity': '1'
                });

                firstSlice.animate({ width: slider.width() + 'px' }, (settings.animSpeed*2), '', function(){ slider.trigger('nivo:animFinished'); });
            }
            else if(currentEffect == 'slideInLeft'){
				createSlices(slider, settings, vars);
				
                var firstSlice = $('.nivo-slice:first', slider);
                firstSlice.css({
                    'height': '100%',
                    'width': '0px',
                    'opacity': '1',
                    'left': '',
                    'right': '0px'
                });

                firstSlice.animate({ width: slider.width() + 'px' }, (settings.animSpeed*2), '', function(){ 
                    // Reset positioning
                    firstSlice.css({
                        'left': '0px',
                        'right': ''
                    });
                    slider.trigger('nivo:animFinished'); 
                });
            }
			else if(currentEffect == 'boxRandom'){
				createBoxes(slider, settings, vars);
				
				var totalBoxes = settings.boxCols * settings.boxRows;
				var i = 0;
				var timeBuff = 0;
				
				var boxes = shuffle($('.nivo-box', slider));
				boxes.each(function(){
					var box = $(this);
					if(i == totalBoxes-1){
						setTimeout(function(){
							box.animate({ opacity:'1' }, settings.animSpeed, '', function(){ slider.trigger('nivo:animFinished'); });
						}, (100 + timeBuff));
					} else {
						setTimeout(function(){
							box.animate({ opacity:'1' }, settings.animSpeed);
						}, (100 + timeBuff));
					}
					timeBuff += 20;
					i++;
				});
			}
			else if(currentEffect == 'boxRain' || currentEffect == 'boxRainReverse' || currentEffect == 'boxRainGrow' || currentEffect == 'boxRainGrowReverse'){
				createBoxes(slider, settings, vars);
				
				var totalBoxes = settings.boxCols * settings.boxRows;
				var i = 0;
				var timeBuff = 0;
				
				// Split boxes into 2D array
				var rowIndex = 0;
				var colIndex = 0;
				var box2Darr = new Array();
				box2Darr[rowIndex] = new Array();
				var boxes = $('.nivo-box', slider);
				if(currentEffect == 'boxRainReverse' || currentEffect == 'boxRainGrowReverse'){
					boxes = $('.nivo-box', slider)._reverse();
				}
				boxes.each(function(){
					box2Darr[rowIndex][colIndex] = $(this);
					colIndex++;
					if(colIndex == settings.boxCols){
						rowIndex++;
						colIndex = 0;
						box2Darr[rowIndex] = new Array();
					}
				});
				
				// Run animation
				for(var cols = 0; cols < (settings.boxCols * 2); cols++){
					var prevCol = cols;
					for(var rows = 0; rows < settings.boxRows; rows++){
						if(prevCol >= 0 && prevCol < settings.boxCols){
							/* Due to some weird JS bug with loop vars 
							being used in setTimeout, this is wrapped
							with an anonymous function call */
							(function(row, col, time, i, totalBoxes) {
								var box = $(box2Darr[row][col]);
                                var w = box.width();
                                var h = box.height();
                                if(currentEffect == 'boxRainGrow' || currentEffect == 'boxRainGrowReverse'){
                                    box.width(0).height(0);
                                }
								if(i == totalBoxes-1){
									setTimeout(function(){
										box.animate({ opacity:'1', width:w, height:h }, settings.animSpeed/1.3, '', function(){ slider.trigger('nivo:animFinished'); });
									}, (100 + time));
								} else {
									setTimeout(function(){
										box.animate({ opacity:'1', width:w, height:h }, settings.animSpeed/1.3);
									}, (100 + time));
								}
							})(rows, prevCol, timeBuff, i, totalBoxes);
							i++;
						}
						prevCol--;
					}
					timeBuff += 100;
				}
			}
		}
		
		// Shuffle an array
		var shuffle = function(arr){
			for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
			return arr;
		}
        
        // For debugging
        var trace = function(msg){
            if (this.console && typeof console.log != "undefined")
                console.log(msg);
        }
        
        // Start / Stop
        this.stop = function(){
            if(!$(element).data('nivo:vars').stop){
                $(element).data('nivo:vars').stop = true;
                trace('Stop Slider');
            }
        }
        
        this.start = function(){
            if($(element).data('nivo:vars').stop){
                $(element).data('nivo:vars').stop = false;
                trace('Start Slider');
            }
        }
        
        //Trigger the afterLoad callback
        settings.afterLoad.call(this);
		return this;
    };
        
    $.fn.nivoSlider = function(options) {
    
        return this.each(function(key, value){
            var element = $(this);
            // Return early if this element already has a plugin instance
            if (element.data('nivoslider')) return element.data('nivoslider');
            // Pass options to plugin constructor
            var nivoslider = new NivoSlider(this, options);
            // Store plugin object in this element's data
            element.data('nivoslider', nivoslider);
        });

	};
	
	//Default settings
	$.fn.nivoSlider.defaults = {
		effect: 'random',
		slices: 15,
		boxCols: 8,
		boxRows: 4,
		animSpeed: 500,
		pauseTime: 3000,
		startSlide: 0,
		directionNav: true,
		directionNavHide: true,
		controlNav: true,
		controlNavThumbs: false,
        controlNavThumbsFromRel: false,
		controlNavThumbsSearch: '.jpg',
		controlNavThumbsReplace: '_thumb.jpg',
		keyboardNav: true,
		pauseOnHover: true,
		manualAdvance: false,
		captionOpacity: 0.8,
		prevText: 'Prev',
		nextText: 'Next',
		randomStart: false,
		beforeChange: function(){},
		afterChange: function(){},
		slideshowEnd: function(){},
        lastSlide: function(){},
        afterLoad: function(){}
	};
	
	$.fn._reverse = [].reverse;
})(jQuery);
