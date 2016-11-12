define( [ "utils/scanner" ], function( Scanner ) {
  var CT = {};

  CT.relativeDirections = {
    "-x": [ -1, 0, 0 ],
    "+x": [ 1, 0, 0 ],
    "-y": [ 0, -1, 0 ],
    "+y": [ 0, 1, 0 ],
    "-z": [ 0, 0, -1 ],
    "+z": [ 0, 0, 1 ]
  };

  CT.serialize = function( data ) {
    var serialized = "",
      elements = [];
    if( typeof data === "object" ) {
      if( typeof data.length === "undefined" ) {
        var value;
        for( var attr in data ) {
          value = CT.serialize( data[attr] );
          elements.push( attr + ":" + value );
        }
        serialized = "{" + elements.join( "," ) + "}";
      } else {
        data.forEach( function( value ) {
          elements.push( CT.serialize( value ) );
        } );
        serialized = "[" + elements.join( "," ) + "]";
      }
    } else if( typeof data === "string" ) {
      serialized = data;
      var scanner = new Scanner( data ),
        balance = [],
        specialChars = /[\[\]\{\}\"\\]/;

      while( !scanner.eos() ) {
        scanner.scanUntil( specialChars );
        var specialChar = scanner.scan( specialChars );

        if( specialChar === "" ) continue;

        else if( specialChar === "\\" ) scanner.scan( /[.\n]/ );
        else if( specialChar.match( /[\[\{]/ ) ) {
          balance.unshift( specialChar );
        }
        else if( specialChar === "]" && balance[0] === "[" || specialChar === "}" && balance[0] === "{" ) {
          balance.shift();
        } else if( specialChar === "\"" ) {
          if( balance[0] === "\"" ) balance.shift();
          else balance.unshift( specialChar );
        } else {
          balance.unshift( "lol" );
          break;
        }
      }
      if( typeof balance[0] !== "undefined" ) {
        serialized = "\"" + serialized.replace( /(["\\])/g, "\\$1" ) + "\"";
      }

    } else {
      serialized = data;
    }
    return serialized;
  };

  CT.numOp = function( operator, n1, n2 ) {
    var n1Relative = n1[0] === "~",
      n2Relative = n2[0] === "~",
      n1Value = +( n1Relative ? n1.substr( 1 ) : n1 ),
      n2Value = +( n2Relative ? n2.substr( 1 ) : n2 ),
      result = n1Relative ? "~" : "";

    if( operator === "+" ) {
      result += n1Value + n2Value;
    }
    else if( operator === "-" ) {
      result += n1Value - n2Value;
    }
    else if( operator === "*" ) {
      result += n1Value * n2Value;
    }
    else if( operator === "/" ) {
      if( n2Value === 0 ) throw "DIVISION_BY_ZERO";
      result += n1Value / n2Value;
    }
    else if( operator === "%" ) {
      result += n1Value % n2Value;
    }

    return result;
  };

  CT.numsOp = function( operator, n1, n2 ) {
    var result = [],
      i = n1.length;

    if( n1.length === n2.length ) {
      while( i-- ) {
        result[i] = CT.numOp( operator, n1[i], n2[i] );
      }
    }
    else if( n2.length === 1 ) {
      while( i-- ) {
        result[i] = CT.numOp( operator, n1[i], n2[0] );
      }
    }
    else {
      throw "INVALID_OPERATION";
    }

    return result;
  };

  return CT;
} );