/* Slider */
(function($){
	$.fn.slider = function(custom){		
		//Settings
		var setting = $.extend({
			min : 0,
			max : 100,
			onMove : function(){},
			onChange : function(){},
			values : [0],
			offset : -5,
			integer : true,
			showViewer : false,
			viewerPrefix : '',
			viewerSufix : ''
		}, custom || {});			
		return this.each(function(){
			var $this = $(this),
				width = $this.width(),
				range = setting.max - setting.min,
				rangeBarDraw = function(){},
				len = setting.values.length,
				getValue = function(x){
					var val =  ((x - setting.offset)*range/width)+setting.min;
					if(setting.integer){
						return Math.round(val);
					}else{
						return val;
					}
				},
				getPosition = function(value){
					if(value<setting.min) value = setting.min;
					if(value>setting.max) value = setting.max;
					var posX = Math.round((value - setting.min)*width/range);
					return posX + setting.offset;
				};
			//Start
			this.values = function(arr){
				if(arr){
					setting.values = arr;
				}else{
					return setting.values;
				}
			}
			for(var i=0;i<len;i++){
				$this.append($('<span class="pin"></span>').css('left',getPosition(setting.values[i])+'px'));
			}
			if(len<3){
				var $rangeBar = $('<span class="range"></span>');
				rangeBarDraw = function(){
					if(len==1){
						$rangeBar.width(getPosition(setting.values[0])-setting.offset)
					}
					if(len==2){
						$rangeBar.css({
							'left' : getPosition(setting.values[0])-setting.offset +'px',
							'width' : getPosition(setting.values[1])-getPosition(setting.values[0]) +'px'
						});
					}
				}
				$this.append($rangeBar);
				rangeBarDraw();
			}
			if(setting.showViewer){
				var $viewer = $('<span class="viewer"></span>');
				$this.append($viewer);
				$this.css('marginLeft',-1*parseInt($viewer.css('left'))+'px');
				$viewer.html(setting.viewerPrefix + setting.values[0]+setting.viewerSufix)
			}
			//Events
			$this.find('.pin').each(function(index){
				var $self = $(this),
					dragging = false,
					dragDif = 0;
				$self.mousedown(function (e) {					
                    dragDif = e.pageX - $self.offset().left;
                    dragging = true;
                    return false;
                });
				$('html,body').mousemove(function (e) {
					if(dragging){
						var posX = Math.round(e.pageX - $this.offset().left - dragDif);
						if (posX < setting.offset) posX = setting.offset;
						if (posX > width+setting.offset) posX = width+setting.offset;
						$self.css({
                            'left': posX + 'px'
                        });
                        setting.values[index] = getValue(posX);
                        rangeBarDraw();
                        if(setting.showViewer){
							$viewer.html(setting.viewerPrefix + setting.values[0]+setting.viewerSufix)
						}
                        setting.onMove(setting.values);
						return false;
					}
				}).mouseup(function () {
                    if (dragging) {
                    	dragging = false;
                    	setting.onChange(setting.values);
                      	return false;
                    }
                });
			});
		});
	};
})(jQuery);

