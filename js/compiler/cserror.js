define( function() {

  var errorMessages = {
    "INCORRECT_INDENTATION": "Incorrect indentation",
    "NOT_A_NUMBER": "Not a number: %value",
    "UNDECLARED_VAR": "Undeclared variable: %value",
    "UNDEFINED_VAR": "Undefined variable: %value",
    "UNEXPECTED_TOKEN": "Unexpected token: %type"
  };

  function CSError( code, token ) {
    this.name = "CSError";
    this.token = token;
    this.code = code;
  }

  CSError.prototype.toString = function() {
    var error = this,
      message = errorMessages[ this.code ];

    message = message.replace( /%(\w+)/, function( match, attr ) {
      return error.token[attr];
    } );

    return message;
  };

  return CSError;

} );