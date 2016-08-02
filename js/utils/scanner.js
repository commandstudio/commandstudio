/* Mustache.js Scanner */

define( function() {
/**
 * A simple string scanner that is used by the template parser to find
 * tokens in template strings.
 */
  function Scanner ( string ) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  Scanner.prototype.reset = function reset () {
    this.tail = this.string;
    this.pos = 0;
  };

/**
 * Returns `true` if the tail is empty (end of string).
 */
  Scanner.prototype.eos = function eos () {
    return this.tail === "";
  };

/**
 * Tries to match the given regular expression at the current position.
 * Returns the matched text if it can match, the empty string otherwise.
 */
  Scanner.prototype.scan = function scan ( re ) {
    var match = this.tail.match( re );

    if ( !match || match.index !== 0 )
      return "";

    var string = match[0];

    this.tail = this.tail.substring( string.length );
    this.pos += string.length;

    return string;
  };

/**
 * Skips all text until the given regular expression can be matched. Returns
 * the skipped string, which is the entire tail if no match can be made.
 */
  Scanner.prototype.scanUntil = function scanUntil ( re ) {
    var index = this.tail.search( re ), match;

    switch ( index ) {
    case -1:
      match = this.tail;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring( 0, index );
      this.tail = this.tail.substring( index );
    }

    this.pos += match.length;

    return match;
  };

  Scanner.prototype.scanBlock = function scanBlock () {
    return mtrim( this.scanUntil( /\n\S/ ) );
  };

  function mtrim( string ) {
    return string.replace( /(?:^[\t ]+|[\t ]+$)/gm, "" );
  }

  return Scanner;
} );