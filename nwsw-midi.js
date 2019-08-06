function NWMidiSystem()
{
	this.h=this.synth=this.launchpadIn=this.launchpadOut=false;
}

NWMidiSystem.prototype.Init = function(h)
{
	this.h=h;

	h.inputs.forEach(function(port) {
		if (!this.launchpadIn && port.name.match("Launchpad")) this.launchpadIn = port;
	},this);

	h.outputs.forEach(function(port) {
		if (port.name.match("Launchpad")) { if (!this.launchpadOut) this.launchpadOut = port; }
		else if (!this.synth) this.synth = port;
	},this);
}

NWMidiSystem.prototype.htmlLoadPlaySynthList = function(c)
{
	c.html('');

	this.h.outputs.forEach(function(d) {
		var newOption = $('<option>').text(d.name);
		if (this.launchpadOut == d) newOption.prop('disabled',true);
		if (this.synth == d) newOption.prop('selected',true);
		c.append(newOption);
	},this);
}

NWMidiSystem.prototype.changeSynth = function(name)
{
	this.h.outputs.forEach(function(d) {
		if (d.name == name) this.synth = d;
	},this);
}

NWMidiSystem.DrumKitTypes = ["Standard","Room","Power","Electronic","TR-808","Jazz","Brush","Orchestral","Sound FX","MT-32","Generic"];
NWMidiSystem.DrumKits = [
'High Q|Slap|Scratch Push|Scratch Pull|Sticks|Square Click|Metronome Click|Metronome Bell|Kick Drum 2|Kick Drum 1|Side Stick|Snare Drum 1|Hand Clap|Snare Drum 2|Low Tom 2|Closed Hi-Hat|Low Tom 1|Pedal Hi-Hat|Mid Tom 2|Open Hi-Hat|Mid Tom 1|High Tom 2|Crash Cymbal|High Tom 1|Ride Cymbal|Chinese Cymbal|Ride Bell|Tambourine|Splash Cymbal|Cowbell|Crash Cymbal 2|Vibra-Slap|Ride Cymbal 2|High Bongo|Low Bongo|Mute Conga Hi|Open Conga Hi|Low Conga|High Timbale|Low Timbale|High Agogo|Low Agogo|Cabasa|Maracas|Short Whistle Hi|Long Whistle Lo|Short Guiro|Long Guiro|Claves|High Woodblock|Low Woodblock|Mute Cuica|Open Cuica|Mute Triangle|Open Triangle|Shaker|Jingle Bell|Belltree|Castanets|Mute Surdo|Open Surdo',
'High Q|Slap|Scratch Push|Scratch Pull|Sticks|Square Click|Metronome Click|Metronome Bell|Kick Drum 2|Kick Drum 1|Side Stick|Snare Drum 1|Hand Clap|Snare Drum 2|Room Lo Tom 2|Closed Hi-Hat|Room Lo Tom 1|Pedal Hi-Hat|Room Mid Tom 2|Open Hi-Hat|Room Mid Tom 1|Room Hi Tom 2|Crash Cymbal|Room Hi Tom 1|Ride Cymbal|Chinese Cymbal|Ride Bell|Tambourine|Splash Cymbal|Cowbell|Crash Cymbal 2|Vibra-Slap|Ride Cymbal 2|High Bongo|Low Bongo|Mute Conga Hi|Open Conga Hi|Low Conga|High Timbale|Low Timbale|High Agogo|Low Agogo|Cabasa|Maracas|Short Whistle Hi|Long Whistle Lo|Short Guiro|Long Guiro|Claves|High Woodblock|Low Woodblock|Mute Cuica|Open Cuica|Mute Triangle|Open Triangle|Shaker|Jingle Bell|Belltree|Castanets|Mute Surdo|Open Surdo',
'High Q|Slap|Scratch Push|Scratch Pull|Sticks|Square Click|Metronome Click|Metronome Bell|Kick Drum 2|Mondo Kick|Side Stick|Gated Snare|Hand Clap|Snare Drum 2|Room Lo Tom 2|Closed Hi-Hat|Room Lo Tom 1|Pedal Hi-Hat|Room Mid Tom 2|Open Hi-Hat|Room Mid Tom 1|Room Hi Tom 2|Crash Cymbal|Room Hi Tom 1|Ride Cymbal|Chinese Cymbal|Ride Bell|Tambourine|Splash Cymbal|Cowbell|Crash Cymbal 2|Vibra-Slap|Ride Cymbal 2|High Bongo|Low Bongo|Mute Conga Hi|Open Conga Hi|Low Conga|High Timbale|Low Timbale|High Agogo|Low Agogo|Cabasa|Maracas|Short Whistle Hi|Long Whistle Lo|Short Guiro|Long Guiro|Claves|High Woodblock|Low Woodblock|Mute Cuica|Open Cuica|Mute Triangle|Open Triangle|Shaker|Jingle Bell|Belltree|Castanets|Mute Surdo|Open Surdo',
'High Q|Slap|Scratch Push|Scratch Pull|Sticks|Square Click|Metronome Click|Metronome Bell|Kick Drum 2|Kick Drum 1|Side Stick|Snare Drum|Hand Clap|Gated Snare Drum|Elec Lo Tom 2|Closed Hi-Hat|Elec Lo Tom 1|Pedal Hi-Hat|Elec Mid Tom 2|Open Hi-Hat|Mid Tom 1|High Tom 2|Crash Cymbal|High Tom 1|Ride Cymbal|Reverse Cymbal|Ride Bell|Tambourine|Splash Cymbal|Cowbell|Crash Cymbal 2|Vibra-Slap|Ride Cymbal 2|High Bongo|Low Bongo|Mute Conga Hi|Open Conga Hi|Low Conga|High Timbale|Low Timbale|High Agogo|Low Agogo|Cabasa|Maracas|Short Whistle Hi|Long Whistle Lo|Short Guiro|Long Guiro|Claves|High Woodblock|Low Woodblock|Mute Cuica|Open Cuica|Mute Triangle|Open Triangle|Shaker|Jingle Bell|Belltree|Castanets|Mute Surdo|Open Surdo',
'High Q|Slap|Scratch Push|Scratch Pull|Sticks|Square Click|Metronome Click|Metronome Bell|Kick Drum 2|Bass Drum|Rim Shot|Snare Drum|Hand Clap|Snare Drum 2|Low Tom 2|Closed Hi-Hat|Low Tom 1|Closed Hi-Hat|Mid Tom 2|Open Hi-Hat|Mid Tom 1|High Tom 2|Cymbal|High Tom 1|Ride Cymbal|Reverse Cymbal|Ride Bell|Tambourine|Splash Cymbal|808 Cowbell|Crash Cymbal 2|Vibra-Slap|Ride Cymbal 2|High Bongo|Low Bongo|808 High Conga|808 Mid Conga|808 Low Conga|High Timbale|Low Timbale|High Agogo|Low Agogo|Cabasa|808 Maracas|Short Whistle Hi|Long Whistle Lo|Short Guiro|Long Guiro|808 Claves|High Woodblock|Low Woodblock|Mute Cuica|Open Cuica|Mute Triangle|Open Triangle|Shaker|Jingle Bell|Belltree|Castanets|Mute Surdo|Open Surdo',
'High Q|Slap|Scratch Push|Scratch Pull|Sticks|Square Click|Metronome Click|Metronome Bell|Jazz BD 2|Jazz BD 1|Side Stick|Snare Drum 1|Hand Clap|Snare Drum 2|Low Tom 2|Closed Hi-Hat|Low Tom 1|Pedal Hi-Hat|Mid Tom 2|Open Hi-Hat|Mid Tom 1|High Tom 2|Crash Cymbal|High Tom 1|Ride Cymbal|Chinese Cymbal|Ride Bell|Tambourine|Splash Cymbal|Cowbell|Crash Cymbal 2|Vibra-Slap|Ride Cymbal 2|High Bongo|Low Bongo|Mute Hi Conga|Open Hi Conga|Low Conga|High Timbale|Low Timbale|High Agogo|Low Agogo|Cabasa|Maracas|Short Hi Whistle|Long Lo Whistle|Short Guiro|Long Guiro|Claves|High Woodblock|Low Woodblock|Mute Cuica|Open Cuica|Mute Triangle|Open Triangle|Shaker|Jingle Bell|Belltree|Castanets|Mute Surdo|Open Surdo',
'High Q|Slap|Scratch Push|Scratch Pull|Sticks|Square Click|Metronome Click|Metronome Bell|Jazz BD 2|Jazz BD 1|Side Stick|Brush Tap|Brush Slap|Brush Swirl|Low Tom 2|Closed Hi-Hat|Low Tom 1|Pedal Hi-Hat|Mid Tom 2|Open Hi-Hat|Mid Tom 1|High Tom 2|Crash Cymbal|High Tom 1|Ride Cymbal|Chinese Cymbal|Ride Bell|Tambourine|Splash Cymbal|Cowbell|Crash Cymbal 2|Vibra-Slap|Ride Cymbal 2|High Bongo|Low Bongo|Mute Hi Conga|Open Hi Conga|Low Conga|High Timbale|Low Timbale|High Agogo|Low Agogo|Cabasa|Maracas|Short Hi Whistle|Long Lo Whistle|Short Guiro|Long Guiro|Claves|High Woodblock|Low Woodblock|Mute Cuica|Open Cuica|Mute Triangle|Open Triangle|Shaker|Jingle Bell|Belltree|Castanets|Mute Surdo|Open Surdo',
'Closed Hi-Hat|Pedal Hi-Hat|Open Hi-Hat|Ride Cymbal|Sticks|Square Click|Metronome Click|Metronome Bell|Bass Drum 2|Bass Drum 1|Side Stick|Concert Snare|Castanets|Snare Drum|Tympani F|Tympani F#|Tympani G|Tympani G#|Tympani A|Tympani A#|Tympani B|Tympani C|Tympani C#|Tympani D|Tympani D#|Tympani E|Tympani F|Tambourine|Splash Cymbal|Cowbell|Cymbal 2|Vibra-Slap|Cymbal 1|High Bongo|Low Bongo|Mute Hi Conga|Open Hi Conga|Low Conga|High Timbale|Low Timbale|High Agogo|Low Agogo|Cabasa|Maracas|Short Hi Whistle|Long Lo Whistle|Short Guiro|Long Guiro|Claves|High Woodblock|Low Woodblock|Mute Cuica|Open Cuica|Mute Triangle|Open Triangle|Shaker|Jingle Bell|Belltree|Castanets|Mute Surdo|Open Surdo',
'||||||||||||High Q|Slap|Scratch Push|Scratch Pull|Sticks|Square Click|Metronome Click|Metronome Bell|Guitar Fret Noise|Guitar Cut Noise Up|Guitar Cut Noise Down|Double Bass String Slap|Flute Key Click|Laughing|Screaming|Punch|Heartbeat|Footsteps 1|Footsteps 2|Applause|Door Creaking|Door Closing|Scratch|Wind Chimes|Car Engine|Car Brakes|Car Passing|Car Crash|Siren|Train|Jet Plane|Helicopter|Starship|Gun Shot|Machine Gun|Laser Gun|Explosion|Dog Bark|Horse Gallop|Birds Tweet|Rain|Thunder|Wind|Seashore|Stream|Bubble',
'||||||||Acoustic Bass Drum|Acoustic Bass Drum|Rim Shot|Acoustic Snare Drum|Hand Clap|Electronic Snare Drum|Acoustic Low Tom|Closed Hi-Hat|Acoustic Low Tom|Open Hi-Hat 1|Acoustic Mid Tom|Open Hi-Hat 2|Acoustic Mid Tom|Acoustic Hi Tom|Crash Cymbal|Acoustic Hi Tom|Ride Cymbal|||Tambourine||Cowbell||||High Bongo|Low Bongo|Mute Hi Conga|High Conga|Low Conga|High Timbale|Low Timbale|High Agogo|Low Agogo|Cabasa|Maracas|Short Whistle|Long Whistle|Quijada||Claves|Laughing|Screaming|Punch|Heartbeat|Footsteps 1|Footsteps 2|Applause|Door Creaking|Door Closing|Scratch|Wind Chimes|Car Engine|Car Brakes|Car Passing|Car Crash|Siren|Train|Jet Plane|Helicopter|Starship|Gun Shot|Machine Gun|Laser Gun|Explosion|Dog Bark|Horse Gallop|Birds Tweet|Rain|Thunder|Wind|Seashore|Stream|Bubble',
'|'
];
NWMidiSystem.DrumKitPatch = [0,8,16,24,25,32,40,48,56,127,0];
//
NWMidiSystem.GetKitTypes = function() {return NWMidiSystem.DrumKitTypes;}
NWMidiSystem.GetKitTypeIndex = function(t) {
	switch (typeof(t)) {
	case 'number': return t;
	case 'string': return NWMidiSystem.DrumKitTypes.indexOf(t);
	default: return -1;
	}
}
//
NWMidiSystem.GetKitTypeOfficialName = function(t) {
	t = NWMidiSystem.GetKitTypeIndex(t);
	return NWMidiSystem.DrumKitTypes[t] || "Generic";
}
//
NWMidiSystem.GetSustainableDrums = function(kittype) {
	if (NWMidiSystem.GetKitTypeIndex(kittype) != 8) return [];
	var a = [];
	NWLoopPlayer.buildUserDrumKit('47-84').forEach(function(v) {a[v] = 1;});
	return a;
}
//
NWMidiSystem.GetDrumName = function(pitch,kittype) {
	var kitstr = NWMidiSystem.DrumKits[NWMidiSystem.GetKitTypeIndex(kittype)] || '|';
	var kit = kitstr.split('|');
	var idx = pitch - 27;
	return (idx in kit) ? kit[idx] : ('#'+pitch);
}
//
NWMidiSystem.GetDrumKitInstrumentPatch = function(kit) {return NWMidiSystem.DrumKitPatch[NWMidiSystem.GetKitTypeIndex(kit)] || 0;}
//
NWMidiSystem.prototype.changeSynthDrumType = function(t)
{
	if (nwswMidi.synth) nwswMidi.synth.send([0xc9,NWMidiSystem.GetDrumKitInstrumentPatch(t)]);
}

var nwswMidi = new NWMidiSystem();

// -----------------------------------------
function NWLoopPlayer(drumtype,drumkit,beatsPerBar,resPerBeat,numBars)
{
	nwswMidi.changeSynthDrumType(drumKitType);

	beatsPerBar = beatsPerBar || 4;
	resPerBeat = resPerBeat || 4;
	numBars = numBars || 1;

	this.kit = drumkit;
	this.kitSize = drumkit.length;
	this.sustainableDrums = NWMidiSystem.GetSustainableDrums(drumtype);
	this.beatsPerBar = beatsPerBar;
	this.triggersPerBeat = resPerBeat;
	this.numBars = numBars;
	this.numTriggers = numBars*beatsPerBar*resPerBeat;
	this.triggerMap = new Array(1024);
	this._tempo = 120;
	this.triggerInterval = 500/resPerBeat;
	this.scheduleWindow = 200;
	this.startTime = 0;
	this.noteTime = 0;
	this.triggerNum = 0;
	this.timerID = null;
	this.defaultVelocity = 108;

	for (var i=0;i<this.numTriggers;i++) this.triggerMap[i] = new Uint8Array(8);

	this.timeProc = $.proxy(this.doLoop,this);
}

NWLoopPlayer.buildUserDrumKit = function(s) {
	var newkit = new Array();
	var userkit = s.split(',');
	var vReRange = /^([0-9]+)\-([0-9]+)$/;
	function doAddValue(v) {if ((v > 0) && (v < 128) && ($.inArray(v,newkit) < 0)) {newkit.push(v);}}
	for (var i=0;i<userkit.length;i++) {
		var d = userkit[i];
		var a = vReRange.exec(d);
		if (a) {
			var r1 = parseInt(a[1],10),r2 = parseInt(a[2],10);
			for (var v=r1;v<=r2;v++) doAddValue(v);
		} else {
			doAddValue(parseInt(d,10));
		}
	}

	return newkit;
}

NWLoopPlayer.prototype = {
get tempo() {return this._tempo;},

set tempo(t) {
	this._tempo = Math.max(Number(t),20);
	var n = (1000*60), d = (this._tempo*this.triggersPerBeat);
	this.triggerInterval = n/d;
},

setSchedulingPriority: function(activeUser) {
	this.scheduleWindow = activeUser ? 100 : 1200;
},

GetTrigger: function(kitkey,triggernum) {
	return (this.triggerMap[triggernum][Math.floor(kitkey/8)] & (1 << (kitkey%8))) != 0;
},

SetTrigger: function(kitkey,triggernum,val) {
	var dseg = Math.floor(kitkey/8);
	var dbit = 1 << (kitkey%8);
	var a = this.triggerMap[triggernum];
	var v = a[dseg] & ~dbit;
	if (val) v |= dbit;
	a[dseg] = v;
},

triggerDrumSound: function(drumidx) {
	if (nwswMidi.synth) {
		var k = this.kit[drumidx];
		var dur = (k in this.sustainableDrums) ? 1500 : (this.triggerInterval-1);
		nwswMidi.synth.send([0x99,k,this.defaultVelocity]);
		nwswMidi.synth.send([0x89,k,0],window.performance.now()+dur);
	}
},

isLooping: function() {return (this.timerID != null);},

start: function() {
	if (this.isLooping()) return;

	this.timerRes = 20;
	this.scheduleWindow = 200;
	this.startTime = window.performance.now();
	this.nextTrigger = this.startTime+100;
	this.triggerNum = 0;

	this.doLoop();
},

doLoop: function() {
	var currtime = window.performance.now();
	var schedulethru = currtime+this.scheduleWindow;

	while (this.nextTrigger <= schedulethru) {
		for (var i=0;i<this.kitSize;i++) {
			if (this.GetTrigger(i,this.triggerNum)) {
				var midikey = this.kit[i];
				var dur = this.triggerInterval-1;

				if (midikey in this.sustainableDrums) {
					if (this.triggerNum && this.GetTrigger(i,this.triggerNum-1)) dur = 0;
					else {
						dur += this.triggerInterval/2;
						for (i2=this.triggerNum+1;((i2<this.numTriggers) && this.GetTrigger(i,i2));i2++) dur += this.triggerInterval;
					}
				}

				if (nwswMidi.synth && dur) {
					nwswMidi.synth.send([0x99, midikey, this.defaultVelocity], this.nextTrigger);
					nwswMidi.synth.send([0x89, midikey, 0], this.nextTrigger+dur);
				}
			}
		}

		this.nextTrigger += this.triggerInterval;
		if (++this.triggerNum >= this.numTriggers) this.triggerNum = 0;
	}

	this.timerID = setTimeout(this.timeProc, this.timerRes);
},

getPlayingTriggerNum: function(t) {
	t = t || window.performance.now();
	if (this.nextTrigger <= t) return this.triggerNum;
	var tnum = this.triggerNum - Math.floor((this.nextTrigger - t)/this.triggerInterval);
	if (tnum < 0) tnum = this.numTriggers - (Math.abs(tnum) % (this.numTriggers-1));
	return tnum;
},

stop: function() {
	if (this.isLooping()) {
		clearTimeout(this.timerID);
		this.timerID = null;
	}
},

getLoopDataString: function(t) {
	function u8conv(obj,triggeridx) {
		var x=0,nzLen=0,s='';

		for(var i=0;i<obj.kitSize;i++) {
			if (((i%5) == 0) && i) {
				s += x.toString(32);
				if (x) nzLen = s.length;
				x = 0;
			}

			if (obj.GetTrigger(i,triggeridx)) x |= (1 << (i%5));
		}

		if (x) s += x.toString(32);
		else if (nzLen < s.length) s = s.substr(0,nzLen);
		return s;
	}

	var a = Array(this.numTriggers);
	for (var i=0;i<this.numTriggers;i++) a[i] = u8conv(this,i);
	return a.toString();
},

clearPattern: function() {
	for (var i=0,l=this.numTriggers;i<l;i++) {
		var u8a = this.triggerMap[i];
		for (var i2=0,l2=u8a.length;i2<l2;i2++) u8a[i2]=0;
	}
},

copyPattern: function(p) {
	this.clearPattern();

	for (var i=0,l=Math.min(p.length,this.numTriggers);i<l;i++) {
		var s = p[i];
		for (var i2=0,drumidx=0,l2=s.length;(i2<l2)&&(drumidx<this.kitSize);i2++) {
			var seg5bits = parseInt(s[i2],32);
			for (var i3=0;(i3<5)&&(drumidx<this.kitSize);drumidx++,i3++) {
				if (seg5bits & (1<<i3)) this.SetTrigger(drumidx,i,true);
			}
		}

	}
},
}
