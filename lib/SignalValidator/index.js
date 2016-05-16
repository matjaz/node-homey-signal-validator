"use strict";

var util 	= require('util');
var extend 	= util._extend;

function SignalValidator( signal, opts ) {

	this.signal = signal;
	this.opts 	= extend({
		frequency: undefined // 433, 868, ir
	}, opts);

}

SignalValidator.prototype.valid = function(){

	var results = [];

	function check( message, result ){
		if( result !== true ) results.push(message);
	}

	// first, check if the signal is valid
	// START GENERIC TESTS
	check( 'invalid_interval_type'			, typeof this.signal.interval == 'number' );
	// END GENERIC TESTS

	// second, check if the signal is valid for the specific frequency
	if( typeof this.opts.frequency == 'string' ) {
		check( 'invalid_frequency'			, typeof this[ 'valid_' + this.opts.frequency ] == 'function' );

		if( typeof this[ 'valid_' + this.opts.frequency ] == 'function' ) {
			this[ 'valid_' + this.opts.frequency ].call( this, function(){
				return check.apply( this, arguments );
			}.bind(this));
		}

	}

	return ( results.length > 0 ) ? results : true;
}

SignalValidator.prototype.valid_433 = function( check ) {
	var modulation = ['ASK', 'FSK', 'PSK'];
	var defDefinition = { repetitions: 10, interval: 5000, 
		rxTimeout: 0, rxBandwidth: 325000, deviation: 50000,
		modulation: modulation.indexOf('ASK'), carrier: 433920000 };

	this.signal = extend(this.signal, defDefinition);

	// START 433 TESTS
	check( 'sensitivity_out_of_range', this.signal.sensitivity >= 0.1 && this.signal.sensitivity <= 1.0);
	check( 'repetitions_out_of_range', this.signal.repetitions >= 0 && this.signal.repetitions <= 255);
	check( 'interval_out_of_range', (this.signal.interval >= 50 && this.signal.interval <= 32767));
	check( 'manchesterUnit_out_of_range', (this.signal.manchsterUnit == 0 || (this.signal.manchesterUnit >= 50 && this.signal.manchesterUnit <= 32767) ));
	check( 'frequency_out_of_range', this.signal.carrier >= 433000000 && this.signal.carrier <= 433990000);
	check( 'bandwidth_out_of_range', this.signal.rxBandwidth >= 58000 && this.signal.rxBandwidth <= 100000);
	check( 'deviation_out_of_range', this.signal.deviation >= 5000 && this.signal.deviation <= 100000);
	check( 'rxTimeout_out_of_range', this.signal.rxTimeout >= 0 && this.signal.rxTimeout <= 255);
	check( 'modulation_out_of_range', this.signal.modulation >= 0 && this.signal.rxTimeout <= 2);

	// END 433 TESTS
}

SignalValidator.prototype.valid_868 = function( check ) {
	var modulation = ['ASK', 'FSK', 'PSK'];
	var defDefinition = { repetitions: 10, interval: 5000, 
		rxTimeout: 0, rxBandwidth: 325000, deviation: 50000,
		modulation: modulation.indexOf('ASK'), carrier: 868200000 };

	// START 868 TESTS
	check( 'sensitivity_out_of_range', this.signal.sensitivity >= 0.1 && this.signal.sensitivity <= 1.0);
	check( 'repetitions_out_of_range', this.signal.repetitions >= 0 && this.signal.repetitions <= 255);
	check( 'interval_out_of_range', (this.signal.interval >= 50 && this.signal.interval <= 32767));
	check( 'manchesterUnit_out_of_range', (this.signal.manchesterUnit >= 50 && this.signal.manchesterUnit <= 32767));
	check( 'frequency_out_of_range', this.signal.carrier >= 868000000 && this.signal.carrier <= 868990000);
	check( 'bandwidth_out_of_range', this.signal.rxBandwidth >= 58000 && this.signal.rxBandwidth <= 100000);
	check( 'deviation_out_of_range', this.signal.deviation >= 5000 && this.signal.deviation <= 100000);
	check( 'rxTimeout_out_of_range', this.signal.rxTimeout >= 0 && this.signal.rxTimeout <= 255);
	check( 'modulation_out_of_range', this.signal.modulation >= 0 && this.signal.rxTimeout <= 2);
	// END 868 TESTS

}

SignalValidator.prototype.valid_ir = function( check ) {

	// START 868 TESTS
	check( 'bar'							, this.signal.sof.length > 100 );
	// END 868 TESTS

}

module.exports = SignalValidator;