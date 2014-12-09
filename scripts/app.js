(function(){
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	var audioCtx = new AudioContext();
	var W = window.innerWidth;
	var H = window.innerHeight;
	
	// start
	init();
	// reload of every n seconds requires destroying the current set first, otherwise build-up occurs
		// setInterval(init, 5000);

	// reload of every n seconds requires destroying the current set first, otherwise build-up occurs
	// setInterval(init, 5000);

	function init(){
		// var p1.x = preset['p1'].x || Math.random() * W;
		var p1 = panner(audioCtx, {x: Math.random() * W, y: Math.random() * H, z: 100});
		var p2 = panner(audioCtx, {x: Math.random() * W, y: Math.random() * H, z: 10});
		var p3 = panner(audioCtx, {x: Math.random() * W, y: Math.random() * H, z: 100});
		var p4 = panner(audioCtx, {x: Math.random() * W/2, y: Math.random() * H/2, z: 10});

		var n1 = noise(audioCtx, "pink", p1.pan);
		var n2 = noise(audioCtx, "pink", p2.pan);
		var n3 = noise(audioCtx, "pink", p3.pan);
		var n4 = noise(audioCtx, "pink", p4.pan);

		// create the preset obj
		var preset = {
			'n1': n1, 
			'p1': p1.set,
			'n2': n2, 
			'p2': p2.set, 
			'n3': n3, 
			'p3': p3.set, 
			'n4': n4, 
			'p4': p4.set
		};

		// localStorage.clear();
		// set localStorage preset on click
		document.body.addEventListener('click', function(){ savepreset(preset); }, false);
		// load localStorage preset on dblclick
		// loadpreset needs to return a obj with param values in init() scope
		// assign panner params to preset param or random * _ 
		document.body.addEventListener('dblclick', function(){ loadpreset(preset); }, false);
	}
/* Audio Functions */
	function Modulator (context, type, freq, gain) {
		this.modulator = context.createOscillator();
		this.gain = contexto.createGain();
		this.modulator.type = type;
		this.modulator.frequency.value = freq;
		this.gain.gain.value = gain;
		this.modulator.connect(this.gain);
		this.modulator.start(0);
		console.log('Mod:', type, freq, gain);
	}

	function noise(context, type, pan, filter){
		//type = {type: "brown", gain: n}
		var n, ng, lfo, lfog, oset = {};
		switch(type.toLowerCase()){
			case "brown":
				n = context.createBrownNoise();
				break;
			case "white":
				n = context.createWhiteNoise();
				break;
			case "pink":
				n = context.createPinkNoise();
			default:
				break;
		}
		/*
			var modulatorStackNode = [
					new Modulator(audioCtx, "sawtooth", 100*Math.random(), 100*Math.random()),
					new Modulator(audioCtx, "square", 100*Math.random(), 100*Math.random()),
					new Modulator(audioCtx, "sine", 100*Math.random(), 100*Math.random()),
					new Modulator(audioCtx, "square", 100*Math.random(), 100*Math.random()),
					new Modulator(audioCtx, "sine", 100*Math.random(), 100*Math.random())
			].reduce(function (input, output) {
					input.gain.connect(output.modulator.frequency);
					return output;
			});
			
			var osc = audioCtx.createOscillator();
			osc.type = "sine";
			osc.frequency.value = wd.temp;
			modulatorStackNode.gain.connect(osc.frequency);

			var filter = audioCtx.createBiquadFilter();
			filter.frequency.value = wd.pressure;
			filter.Q.value = 10;
			osc.connect(filter);
			filter.connect(audioCtx.destination);
		*/
		ng = context.createGain();

		lfo = context.createOscillator();
		lfo.frequency.value = Math.random() * 20; //controls the crazy | values above 1000 connects to the depths of hell
		lfog = context.createGain();
		lfog.gain.value = Math.random() * 100;

		lfo.start(0);
		lfo.connect(lfog);
		lfog.connect(ng.gain);

		if(pan){ //gain is low when pan is enabled
			n.connect(pan);
			pan.connect(ng);
			ng.gain.value = 10;
			ng.connect(context.destination);
		} else{
			n.connect(ng);
			ng.gain.value = 1;
			ng.connect(context.destination);	
		}

		//return current settings
		oset['lfofreqval'] = lfo.frequency.value;
		oset['lfogainval'] = lfog.gain.value;

		return oset;
	}

	function panner(context, position, velocity){
		//position = {x: x, y: y, z: z}
		//velocity = {x: x, y: y, z: z}
		var panner, listener, pset = {}; 
		panner = context.createPanner();
		listener = context.listener;

		listener.dopplerFactor = 1;
		listener.speedOfSound = 343.3;
		listener.setOrientation(0,0,-1,0,1,0);
		listener.setPosition(W/2, H/2, 300);

		panner.panningModel = 'equalpower';
		panner.setOrientation(1,0,0);
		// function pan(event) {
		// 	var x = this.valueAsNumber,
		// 	    y = 0,
		// 	    z = 1 - Math.abs(x);
		// 	panner.setPosition(x,y,z);
		// }
		panner.setPosition(position.x, position.y, 1-Math.abs(position.x));
		panner.setVelocity(100,0,100);

		//return current settings
		pset['panX'] = position.x;
		pset['panY'] = position.y;
		
		return {
			pan: panner,
			set: pset
		};
	}
	
	function filter(context, type, freq){
	/*
			var pinkNoise = audioCtx.createPinkNoise();
			var pinkGain = audioCtx.createGain();
			var pinkFilter = audioCtx.createBiquadFilter();
			pinkGain.gain.value = 100;
			pinkFilter.frequency.value = 1.618;
			pinkNoise.connect(pinkFilter);
			pinkFilter.connect(pinkGain);

			var saw = audioCtx.createOscillator();
			// type
			saw.type = saw.SAWTOOTH;
			//freq
			saw.frequency.value = 150.0;
			var sawGain = audioCtx.createGain();
			sawGain.gain.value = 0.2;

			saw.start(0);
			saw.connect(sawGain);
			pinkGain.connect(saw.frequency);
			sawGain.connect(audioCtx.destination);
			*/
			// return sawGain;
	}
/* Utilities */
	function create(){

	}

	function time(){
		var d = new Date(),
				y = d.getFullYear(),
				mo = d.getMonth(),
				da = d.getDay(),
				h = d.getHours(),
				m = d.getMinutes(),
				s = d.getSeconds()
		return {
			alltime: y + '-' + mo + '-' + da + '_' + h + ':' + m + ':' + s,
			year: y,
			month: m,
			day: da,
			hour: h,
			minute: m,
			second: s
		};
	}

	function savepreset(obj){
		var name = prompt("Save Preset Named: "), ostring = JSON.stringify(obj);
		if(!name) return;
		name += ' = ' + time().all.toString();
		localStorage.setItem(name, ostring);
		console.log('saved', name);
	}
	function loadpreset(obj){
		var name = prompt("Load Preset Named: "), ostring = JSON.parse(obj);
		if (!name) return;

		// loop over obj
		// assign to keys in return obj
		// return obj 
	}

	function counter(min, max){
		var n = min || 0, max = max || 0, down = false;
		// var timer = setInterval(function(){
		// 	if (n == max) {
		// 		down = true;
		// 	} else if(n == min) {
		// 		down = false;
		// 	}
		// 	if(down){ 
		// 		n--;
		// 	} else {
		// 		n++;	
		// 	}
		// }, speed);
		// return setInterval(arguments.callee, speed);
		
		var count = min;
		var counterIncrement = 1;
		var counter = setInterval(timer, speed); 

		function timer() {
			count += counterIncrement;
			if(count == min || count == max ) {
					counterIncrement = -counterIncrement;
			}
			//console.log(count);
		}
		return count;
	}

	function print_data(data){
		var info = document.createElement('div');
		for(p in data){
			info.innerHTML += p + ' : ' + data[p] + '<br>';
		}
		document.body.appendChild(info);
	}

	/* ios enable sound output */
	window.addEventListener('touchstart', function(){
		//create empty buffer
		var buffer = audioCtx.createBuffer(1, 1, 22050);
		var source = audioCtx.createBufferSource();
		source.buffer = buffer;
		source.connect(audioCtx.destination);
		source.start(0);
	}, false);
		
})();