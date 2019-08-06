// offset = decalage
// Calcul du périmètre d'un cercle : 2 * pi * RAYON
(function(){
	var Knob = (function(){
		var min = 0,
		max = 100,
		init = function(){
			var k = document.getElementById('knob');
			var c = document.getElementById('cursor');
			var i =  document.getElementById('value');
			_events.mouseWheel(k, c, i);
			_events.onClick(k);
		};

		var _events = {
			mouseWheel : function(el, c, i){
				el.addEventListener('wheel', function(ev){
					ev.preventDefault();
					_rotate(ev,  c,  2, i );
				}, {capture:true, passive: false} );
			},
			onClick : function(el){
				el.addEventListener('click', function(ev){
					console.log(ev);
				});
			}
		}

		var _rotate = function(ev, SVGelement, angle, input ){
			var transforms = SVGelement.transform.baseVal;
			var current_angle = Math.max(Math.min(transforms[0].angle, 360), 0);
			// Mousewheel dir
			var delta = ( ev.deltaY < 0 ? 1 : -1 ) * angle ;
			// Rotation angle
			var nAngle = current_angle + delta;
console.log(nAngle);
			// Translate Deg to 0-100 scale
			input.value = degToVal(nAngle);

			// Draw
			requestAnimationFrame(function(){
				SVGelement.setAttribute('transform',  'rotate(' +  nAngle   + ', 125, 125)');
			});
		}

		function degToVal(deg){
			var unit = (deg / 3.6) % 360;
			// console.log('deg', deg);
			// console.log('unit', unit);
			return Math.ceil((unit === 0 ? 100 : unit));
		}

		return {
			init: init
		};

	})();

Knob.init();
})();

