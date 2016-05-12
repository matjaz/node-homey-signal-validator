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
	check( 'invalid_interval_range'			, this.signal.interval > 0 && this.signal.interval < 10 );

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

	// START 433 TESTS
	check( 'bar'							, this.signal.sof.length > 100 );
	// END 433 TESTS

}

SignalValidator.prototype.valid_868 = function( check ) {

	// START 868 TESTS
	check( 'bar'							, this.signal.sof.length > 100 );
	// END 868 TESTS

}

SignalValidator.prototype.valid_ir = function( check ) {

	// START 868 TESTS
	check( 'bar'							, this.signal.sof.length > 100 );
	// END 868 TESTS

}

module.exports = SignalValidator;