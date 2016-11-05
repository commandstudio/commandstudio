define( function() {

  var errorMessages = {
    "INCORRECT_INDENTATION": "Incorrect indentation",
    "NOT_A_NUMBER": "Not a number \"%value\"",
    "UNDECLARED_VAR": "Undeclared variable \"%value\"",
    "UNDEFINED_VAR": "Undefined variable \"%value\"",
    "UNEXPECTED_TOKEN": "Unexpected token \"%type\"",
    "NO_COMMAND": "Compilation resulted in no commands"
  };

  function CSError( code, token ) {
    this.name = "CSError";
    this.token = token != null ? token : null;
    this.code = code;
    this.line = token != null && token.line != null ? token.line : null;
  }

  CSError.prototype.toString = function() {
    var error = this,
      message = errorMessages[ this.code ];

    message = message.replace( /%(\w+)/, function( match, attr ) {
      return error.token[attr];
    } );

    if( this.line !== null ) {
      message = message + " on line " + this.line;
    }

    return message;
  };

  return CSError;

} );