// mobile menu init
function initMobileNav() {
	jQuery('body').mobileNav({
		menuActiveClass: 'nav-active',
		menuOpener: '.nav-opener'
	});
}

// init sticky header
function initStickyBlock() {
 jQuery('#header').classOnScroll({
		fixedClass: 'fixed',
		heightRatio: 10
	});
}

function initSlickCarousel() {
	jQuery('.slick-slider').slick({
		slidesToScroll: 1,
		arrows: false,
		rows: 0,
		adaptiveHeight: true,
		slidesToShow: 2,
		responsive: [{
			breakpoint: 1024,
			settings: {
				slidesToScroll: 1,
				slidesToShow: 2
			}
		}, {
			breakpoint: 768,
			settings: {
				dots: true,
				slidesToScroll: 1,
				slidesToShow: 1
			}
		}]
	});

	jQuery('.slick-slider-3-slides').slick({
		slidesToScroll: 1,
		arrows: false,
		rows: 0,
		dots: true,
		adaptiveHeight: true,
		slidesToShow: 3,
		responsive: [{
			breakpoint: 1024,
			settings: {
				slidesToScroll: 1,
				slidesToShow: 2
			}
		}, {
			breakpoint: 768,
			settings: {
				dots: true,
				slidesToScroll: 1,
				slidesToShow: 1
			}
		}]
	});
}

/*
 * Simple Mobile Navigation
 */
;(function($) {
	function MobileNav(options) {
		this.options = $.extend({
			container: null,
			hideOnClickOutside: false,
			menuActiveClass: 'nav-active',
			menuOpener: '.nav-opener',
			menuDrop: '.nav-drop',
			toggleEvent: 'click',
			outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
		}, options);
		this.initStructure();
		this.attachEvents();
	}
	MobileNav.prototype = {
		initStructure: function() {
			this.page = $('html');
			this.container = $(this.options.container);
			this.opener = this.container.find(this.options.menuOpener);
			this.drop = this.container.find(this.options.menuDrop);
		},
		attachEvents: function() {
			var self = this;

			if(activateResizeHandler) {
				activateResizeHandler();
				activateResizeHandler = null;
			}

			this.outsideClickHandler = function(e) {
				if(self.isOpened()) {
					var target = $(e.target);
					if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
						self.hide();
					}
				}
			};

			this.openerClickHandler = function(e) {
				e.preventDefault();
				self.toggle();
			};

			this.opener.on(this.options.toggleEvent, this.openerClickHandler);
		},
		isOpened: function() {
			return this.container.hasClass(this.options.menuActiveClass);
		},
		show: function() {
			this.container.addClass(this.options.menuActiveClass);
			if(this.options.hideOnClickOutside) {
				this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
			}
		},
		hide: function() {
			this.container.removeClass(this.options.menuActiveClass);
			if(this.options.hideOnClickOutside) {
				this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
			}
		},
		toggle: function() {
			if(this.isOpened()) {
				this.hide();
			} else {
				this.show();
			}
		},
		destroy: function() {
			this.container.removeClass(this.options.menuActiveClass);
			this.opener.off(this.options.toggleEvent, this.clickHandler);
			this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
		}
	};

	var activateResizeHandler = function() {
		var win = $(window),
			doc = $('html'),
			resizeClass = 'resize-active',
			flag, timer;
		var removeClassHandler = function() {
			flag = false;
			doc.removeClass(resizeClass);
		};
		var resizeHandler = function() {
			if(!flag) {
				flag = true;
				doc.addClass(resizeClass);
			}
			clearTimeout(timer);
			timer = setTimeout(removeClassHandler, 500);
		};
		win.on('resize orientationchange', resizeHandler);
	};

	$.fn.mobileNav = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function() {
			var $container = jQuery(this);
			var instance = $container.data('MobileNav');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				$container.data('MobileNav', new MobileNav($.extend({
					container: this
				}, opt)));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
}(jQuery));

/*
 * class on scroll plugin
 */
;(function($) {
 'use strict';
 var win = jQuery(window);
 function ClassOnScroll(options) {
  this.options = $.extend({
   holder: null,  // блок, на который довешивается класс
   fixedClass: 'fixed',  // класс , который довесится на holder 
   compareBlock: 'div', // блок, относительно которого идет сравнение
   blockHeight: false, // сравнивает с высотой указанного блока 
   blockTop: false, // сравнивает с расстоянием от начала окна до указанного блока
   heightRatio: false // сравнивает с указанной величиной 
  }, options);
  this.init();
 }
 ClassOnScroll.prototype = {
  init: function() {
   if (this.options.holder) {
    this.findElements();
    this.attachEvents();
   }
  },
  findElements: function() {
   this.holder = jQuery(this.options.holder);
   this.compareBlock = jQuery(this.options.compareBlock);
  },
  attachEvents: function() {
   var self = this;
   self.onScroll();
   win.bind('scroll resize orientationchange', function() { self.onScroll(); });
  },
  onScroll: function() {
   var self = this;
   if (this.options.blockHeight){
    this.scrollHeight  = this.compareBlock.innerHeight();
   }

   if (this.options.blockTop){
    this.scrollHeight  = this.compareBlock.offset().top;
   }

   if (this.options.heightRatio){
    this.scrollHeight  = this.options.heightRatio;
   }

   if (typeof this.options.addBlocks === 'string') {
    $(this.options.addBlocks).each(function(){
     self.scrollHeight += jQuery(this).outerHeight();
    });
   }

   self.scrollTop = win.scrollTop();
   if (self.scrollTop > self.scrollHeight){
    self.holder.addClass(self.options.fixedClass);
   } else {
    self.holder.removeClass(self.options.fixedClass);
   }
  },
  makeCallback: function(name) {
   if (typeof this.options[name] === 'function') {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    this.options[name].apply(this, args);
   }
  }
 };
 // jQuery plugin interface
 $.fn.classOnScroll = function(options) {
  return this.each(function() {
   var params = $.extend({}, options, {holder: this}),
    instance = new ClassOnScroll(params);
   $.data(this, 'ClassOnScroll', instance);
  });
 };

 // module exports
 window.ClassOnScroll = ClassOnScroll;
}(jQuery));

jQuery(function() {
	initMobileNav();
	initStickyBlock();
	initSlickCarousel();
});