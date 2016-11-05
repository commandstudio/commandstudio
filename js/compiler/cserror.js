define( function() {

  var errorMessages = {
    "INCORRECT_INDENTATION": "Incorrect indentation",
    "NOT_A_NUMBER": "Not a number \"%value\"",
    "UNDECLARED_VAR": "Undeclared variable \"%value\"",
    "UNDEFINED_VAR": "Undefined variable \"%value\"",
    "UNEXPECTED_TOKEN": "Unexpected token \"%type\"",
    "INCORRECT_NAME": "Incorrect name \"%data\"",
    "NO_COMMAND": "Compilation resulted in no commands",
    "TOO_LONG": "Summon command is too long! (%data characters)"
  };

  function CSError( code, token, data ) {
    this.name = "CSError";
    this.token = token != null ? token : null;
    this.code = code;
    this.line = token != null && token.line != null ? token.line : null;
    this.data = data != null ? data : null;
  }

  CSError.prototype.toString = function() {
    var error = this,
      message = errorMessages[ this.code ];

    message = message.replace( /%(\w+)/, function( match, attr ) {
      if( attr === "data" ) return error.data;
      return error.token[attr];
    } );

    if( this.line !== null ) {
      message = message + " on line " + this.line;
    }

    return message;
  };

  return CSError;

} );