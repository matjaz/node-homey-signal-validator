var SignalValidator = require('..');

var definition = {
	sof: [], // Start of frame
	eof: [295], // End of frame
	words: [
		[295, 885], // 0
		[885, 295]  // 1
	],
	interval: 9565, // Time between repititions
	repetitions: 20,
	sensitivity: 0.7,
	minimalLength: 24,
	maximalLength: 24
}

var opts = {
	frequency: '433'
}

try {
	var signal = new SignalValidator(definition, opts);

	var validResult = signal.valid();
	if( validResult === true ) {
		console.log('valid signal!');
	} else {
		console.log('invalid signal!');
		console.log(JSON.stringify(validResult, false, 4));
	}

} catch(e){
	console.error(e.stack);
}