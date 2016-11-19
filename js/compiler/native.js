define( [
  "utils/commandtools"
], function(
  CT
) {
  var Native = {};

  function roundNum( num, precision ) {
    precision = Math.pow( 10, precision );
    var result = Math.round( num * precision ) / precision;

    if( isNaN( result ) ) throw new Error();
    return result;
  }

  var defs = Native.defs = {};

  // Utils

  defs[ "^pos_current" ] = function( args, context ) {
    if( context.get( "mode" ) !== "chain" ) throw new Error();
    var chain = context.get( "output" );
    return chain.currentBlock.getPosition();
  };

  defs[ "^pos_abs" ] = function( args, context ) {
    if( args.length < 1 ) throw new Error();
    var chain = context.get( "output" ),
      targetPosition = args[0].split( /\s+/ ),
      currentPosition = chain.currentBlock.position,
      result = CT.numsOp( "-", targetPosition, currentPosition );
    return result.join( " " );
  };

  // Math

  defs[ "^min" ] = function( args ) {
    if( args.length < 1 ) throw new Error();
    var min = CT.numVal( args[0] ), val;
    for( var i = 1, l = args.length ; i < l ; i++ ) {
      val = CT.numVal( args[i] );
      if( ! ( val > min ) ) min = val;
    }
    if( isNaN( min ) ) throw new Error();
    return min;
  };

  defs[ "^max" ] = function( args ) {
    if( args.length < 1 ) throw new Error();
    var max = CT.numVal( args[0] ), val;
    for( var i = 1, l = args.length ; i < l ; i++ ) {
      val = CT.numVal( args[i] );
      if( ! ( val < max ) ) max = val;
    }
    if( isNaN( max ) ) throw new Error();
    return max;
  };

  defs[ "^round" ] = function( args ) {
    if( args.length < 1 ) throw new Error();
    var num = CT.numVal( args[0] ),
      precision = args[1] != null ? args[1] : 0;
    return roundNum( num, precision );
  };

  defs[ "^sin" ] = function( args ) {
    if( args.length < 1 ) throw new Error();
    var num = CT.numVal( args[0] ),
      precision = args[1] != null ? args[1] : null,
      result = Math.sin( num * Math.PI / 180 );
    if( precision !== null ) result = roundNum( result, precision );
    return result;
  };

  defs[ "^cos" ] = function( args ) {
    if( args.length < 1 ) throw new Error();
    var num = CT.numVal( args[0] ),
      precision = args[1] != null ? args[1] : null,
      result = Math.cos( num * Math.PI / 180 );
    if( precision !== null ) result = roundNum( result, precision );
    return result;
  };

  defs[ "^abs" ] = function( args ) {
    if( args.length < 1 ) throw new Error();
    var result = CT.numVal( args[0] );
    if( result < 0 ) result = -result;
    return result;
  };

  defs[ "^pow" ] = function( args ) {
    if( args.length < 2 ) throw new Error();
    var num = CT.numVal( args[0] ),
      power = CT.numVal( args[1] );
    return Math.pow( num, power );
  };

  return Native;
} );