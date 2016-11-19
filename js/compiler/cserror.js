define( function() {

  var errorMessages = {
    "UNEXPECTED_TOKEN": "Unexpected token \"%type\"",
    "INCORRECT_INDENTATION": "Incorrect indentation",
    "NOT_A_NUMBER": "Not a number \"%value\"",
    "INCORRECT_NAME": "Incorrect name \"%data\"",
    "UNDECLARED_VAR": "Undeclared variable \"%value\"",
    "UNDEFINED_VAR": "Undefined variable \"%value\"",
    "UNDEFINED_DEF": "Call to undefined def \"%value\"",
    "NATIVE_DEF_ERROR": "Error using native def \"%value\"",
    "INCORRECT_DEFAULT": "Incorrect use of default",
    "INCORRECT_INVERT": "Incorrect use of invert",
    "INCORRECT_STATS": "Incorrect use of stats",
    "INCLUDE_FAIL": "Failed to include file \"%data\", file not found",
    "INVALID_COORDINATES": "Invalid coordinates",
    "INVALID_DIRECTION": "Invalid direction",
    "INVALID_OPERATION": "Invalid operation",
    "DIVISION_BY_ZERO": "Division by zero",
    "TOO_MANY_ARGUMENTS": "Too many arguments on def \"%value\"",
    "NO_COMMAND_BLOCK": "No command block",
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