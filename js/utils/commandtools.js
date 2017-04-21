define( function() {
  var CT = {};

  CT.relativeDirections = {
    "-x": [ -1, 0, 0 ],
    "+x": [ 1, 0, 0 ],
    "-y": [ 0, -1, 0 ],
    "+y": [ 0, 1, 0 ],
    "-z": [ 0, 0, -1 ],
    "+z": [ 0, 0, 1 ]
  };

  CT.entityNames = {
    "current": {
      "falling_block": "falling_block",
      "commandblock_minecart": "commandblock_minecart"
    },
    "old": {
      "falling_block": "FallingSand",
      "commandblock_minecart": "MinecartCommandBlock"
    }
  };

  CT.serialize = function( data ) {
    var serialized = "",
      elements = [];

    if( typeof data === "object" && typeof data.length === "undefined" ) {
      var value;
      for( var attr in data ) {
        value = CT.serialize( data[attr] );
        elements.push( attr + ":" + value );
      }
      serialized = "{" + elements.join( "," ) + "}";
    }

    else if( typeof data === "object" && typeof data.length !== "undefined" ) {
      data.forEach( function( value ) {
        elements.push( CT.serialize( value ) );
      } );
      serialized = "[" + elements.join( "," ) + "]";
    }

    else if( typeof data === "string" ) {
      var balance = [],
        specialChars = /[\[\]\{\}\"\\, ]/,
        tail = data,
        escape = false,
        pos = 0, len = data.length,
        match, specialChar;

      while( pos < len ) {
        match = tail.match( specialChars );

        if( match === null ) {
          break;
        }
        else {
          specialChar = match[0];
        }

        if( specialChar === "\\" || specialChar === " " ) {
          escape = true;
          break;
        }
        else {

          if( specialChar === "{" || specialChar === "[" ) {
            balance.unshift( specialChar );
          }
          else if( specialChar === "]" && balance[0] === "[" || specialChar === "}" && balance[0] === "{" ) {
            balance.shift();
          }
          else if( specialChar === "\"" ) {
            if( balance[0] === "\"" ) balance.shift();
            else balance.unshift( specialChar );
          }
          else if( specialChar === "," ) {
            if( balance[0] == null ) {
              escape = true;
              break;
            }
          }
          else {
            escape = true;
            break;
          }

          pos += match.index;
          tail = tail.slice( match.index + specialChar.length );
        }
      }

      escape = escape || balance[0] != null;

      serialized = data;
      if( escape === true ) {
        serialized = "\"" + serialized.replace( /(["\\])/g, "\\$1" ) + "\"";
      }
    }
    else {
      serialized = data;
    }
    return serialized;
  };

  CT.numRelative = function( num ) {
    return num[0] === "~";
  };

  CT.numVal = function( num ) {
    return +( num[0] === "~" ? num.substr( 1 ) : num );
  };

  CT.numOp = function( operator, n1, n2 ) {
    var n1Relative = n1[0] === "~",
      n1Value = CT.numVal( n1 ),
      n2Value = CT.numVal( n2 ),
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

    if( result === "~0" ) result = "~";

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