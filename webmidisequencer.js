(function(){

	var SqSequencer = function(o){

		this.midiAccess = null;
		this.devices = {};
		this.ports = {in : [], out : []};

		this.current8thNote = 0;
		this.tempo = o.tempo || 50;
		this.loopLength = o.loopLength || 8;
		this.startTime;

		this.noteLength = 200; // All Notes have same lenght,
		this.nextNoteTime = 0.0;
		this.currentTime;


		this.isPlaying = false;
		this.timeoutID = null;
		this.sequenceNotes = [[0x80, 60, 0x7f], [0x80, 60, 0x7f], [0x80, 60, 0x7f], [0x80, 60, 0x7f], [0x80, 60, 0x7f], [0x80, 60, 0x7f], [0x80, 60, 0x7f], [0x80, 60, 0x7f]];

		this.isConnected = false;

		// this.direction = 'reversedir'; // possible choice are linear, reversedir;
		this.direction = 'linear'; // possible choice are linear, reversedir;

		this.step = 1;

	}

	SqSequencer.prototype = {
		load: function(){
			if(navigator.requestMIDIAccess){
				navigator.requestMIDIAccess({
					sysex: false
				}).then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this) );
			}else{
				alert('No MIDI Support in this Browser');
			}
			this.initControls();
		},

		onMIDISuccess: function(midiAccess){
			this.midiAccess = midiAccess;
			if(typeof this.midiAccess.inputs === "function"){
				this.devices.inputs=this.midiAccess.inputs();
				this.devices.outputs=this.midiAccess.outputs();
			}else{
				var inputs = this.midiAccess.inputs.values();
				this.devices.inputs = [];
				for(var i=inputs.next();i && !i.done;i=inputs.next()){
						this.devices.inputs.push(i.value);
				}

				var outputs = this.midiAccess.outputs.values();
				this.devices.outputs = [];
				for(var o=outputs.next();o && !o.done;o=outputs.next()){
						this.devices.outputs.push(o.value);
				}
				this.setMidiOutputSelect();

			}

		},

		setMidiOutputSelect : function(){
			var self = this;
			var select = document.getElementById('outputportselector');
			for(var i=0;i<this.devices.outputs.length;i++){
				select.options[i] = new Option(this.devices.outputs[i]['name'], this.devices.outputs	[i]['id']);
			}
			/* set Event handler for midi output connection */
			document.getElementById('chooseOutputDevice')
				.addEventListener('click', function(event){
					event.preventDefault();
					var deviceID = document.getElementById('outputportselector').value;
					if(!self.isConnected){
						self.connectMidiOutputToPort(0,deviceID);
						self.isConnected = true;
						this.value='Disconnect';
					}else{
						self.disconnectMidiOutputFromPort(0, deviceID);
						self.isConnected = false;
						this.value = 'Connect';
					}
			});

			/* Force Connexion Developement Purpose */
			var deviceID = document.getElementById('outputportselector').value;
			self.connectMidiOutputToPort(0,deviceID);
			self.isConnected = true;
			document.getElementById('chooseOutputDevice').value='Disconnect';

		},

		onMIDIFailure: function(msg){


			alert('No access to midi Device - Error:'+msg);

		},

		connectMidiOutputToPort : function( portID, deviceID){
			this.ports.out[portID] = deviceID;
			console.log('Device '+ this.ports.out[portID] +' connected to port '+ portID + '');
		},
		disconnectMidiOutputFromPort : function(portID, deviceID){
			console.log('Device '+ this.ports.out[portID] +' disconnected from port '+ portID + '');
			this.ports.out.splice(portID,1);
		},

		initControls : function(){
			var self = this;

			/* knobs */
			$(document).ready(function(){

				$('.knob').knob({
					'min': 0,
					'max': 100,
                                'step': 1,
					'bgColor': '#ECF0F1',
					'fgColor': '#95a5a6',
					'stopper': false,
					'cursor' : 2,
					'displayInput': true,
					'width' : 100,
					'height': 100,
					'release' : function(v){

						// self.sequenceNotes[id][1] = v;
					 }
				});
			});

			/*  play / stop button  */
			document.getElementById('play')
				.addEventListener('click', function(){
					if(!self.isConnected){
						alert('You must connect a MIDI output device first !!');
						return;
					}else if(self.isPlaying){
						self.stop();
						this.classList.remove('active');
					}else{
						self.play();
						this.classList.add('active');
					}

			});

			/* tempo change */
			var el = document.getElementById('tempo');
			if(el){
					el.addEventListener('change', function(){
					self.tempo = this.value;
					console.log('tempo', self.tempo );
				})
			};

			// var ele = document.getElementById('notelength');
			// ele.addEventListener('change', function(){
			// 	self.noteLength = this.value;
			// 	// console.log('tempo', self.tempo );
			// })

			/* click on step button */
			var buttons = document.querySelectorAll('.step_btn');
			var buttonslen = buttons.length;
			for(var i=0; i<buttonslen;i++){
				(function(index){
					var el = buttons[index];
					el.addEventListener('click', function(){

						var msgType = 0x90;
						if(this.classList.contains('active')){ // Si le bouton est actif
							msgType = 0x80;
						}
						var id = el.id.split('_')[1];

						var v = $('#knob_'+id).val(); // On recupere la valeur du knob


						var index = id-1;
						self.sequenceNotes[index] = [msgType, v, 0x7f];

						this.classList.toggle('active'); // On passe le step  active
						// self.updateLoopLength();		// on definit loopLength via le nbre de step actif

					});
				}(i));
			}


			/** Direction choice, should be a select option maybe, In fact something else other than buttons */

			// var el = document.getElementById('linear');
			// console.log(el);
			// if(el){

			// 	el.addEventListener('click', function(){
			// 		self.direction = 'linear';
			// 		this.classList.toggle('active');
			// 	});
			// }

		},

		updateLoopLength: function(){
			var elems = document.querySelectorAll('.step_btn.active');
			elemslen = elems.length;
			this.loopLength = (elemslen) ? elems[elemslen -1].id.split('_')[1] : 0;

		},

		play : function(){

			// this.updateLoopLength(); // on definit loopLength via le nbre de step actif (FOR ACTIVE STEP MODE )
			this.current8thNote=0;   // on demarre au step 0
			this.nextNoteTime = window.performance.now();
			this.schedule();
			this.isPlaying = true;
		},

		stop : function(){
			this.isPlaying = false;
			clearTimeout(this.timeoutID);
			this.current8thNote = 0;
			this.resetPlayhead();
		},


		sendNote: function(midiAccess, noteMsg, portID, noteLength, noteTime){
			var output = midiAccess.outputs.get(portID);
			output.send( noteMsg, noteTime);
			output.send( [0x80, noteMsg[1], 0x40], noteTime + noteLength );	// Note off message
		},


		schedule: function(){
			var self = this;
			var portID = this.ports.out[0]; /* Get first output port, assuming it is connected !! */

			this.currentTime = window.performance.now();
			while(this.nextNoteTime < this.currentTime + 100 ) {
				this.sendNote(this.midiAccess, this.sequenceNotes[this.current8thNote], portID, this.noteLength, this.nextNoteTime);
				this.drawPlayHead( this.current8thNote );
				this.nextNote();
			}
			this.timeoutID = setTimeout(function(){self.schedule();}, 0);
		},


		nextNote: function(){
			var secondsPerBeat = 60 / this.tempo;
			this.nextNoteTime += (0.5 * secondsPerBeat)*1000;

			switch(this.direction){
				case 'linear' :
					this.current8thNote++;
					if(this.current8thNote == this.loopLength)
						// loopLength atteint, on reprend à 0
						this.current8thNote = 0;
				break;

				case 'reversedir' :
					this.current8thNote += this.step;
					if(this.current8thNote == this.loopLength  -1 || this.current8thNote == 0 ){
						this.step = -this.step;
					}
				break;
			}
		},


		resetPlayhead  : function(){
			var leds = document.querySelectorAll('.led');
			for(var i=0;i<leds.length; i++)
				leds[i].style.backgroundColor = '#FFF';
		},

		drawPlayHead : function(index){
			console.log(this.current8thNote);
			var lastIndex = ((this.step == 1 ) ? (index + this.loopLength -1 ) : (index + this.loopLength +1 ))  % (this.loopLength) ;
			var elnew = document.getElementById('LED_'+(index+1));
			elnew.style.backgroundColor = '#ECF0F1';
			var elold = document.getElementById('LED_'+(lastIndex+1));
			elold.style.backgroundColor = '#FFF';

// console.warn('index', index+1);
// console.warn('lastindex', lastIndex+1);

		}
	};

	if(typeof window!=='undefined'){
		window.SqSequencer = SqSequencer;

	}
})();










