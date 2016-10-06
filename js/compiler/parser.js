define( function() {

  var symbols = [
    { name: "eos", pattern: /$/ },
    { name: "eol", pattern: /\n/ },
    { name: "spaces", pattern: /[ \t]+/ },
    { name: "var", pattern: /\$\w+/ }
  ];

  function Parser( code ) {
    this.code = code;
    this.tail = code;
    this.pos = 0;
    this.next();
  }

  Parser.prototype.buildStream = function( code ) {
    
  };

  Parser.prototype.eos = function() {
    return this.currentToken.type === "eos";
  };

  Parser.prototype.eol = function() {
    return this.currentToken.type === "eol" || this.eos();
  };

  Parser.prototype.peek = function() {
    var nextToken = null,
      nextTokenPosition;

    var symbol, match;
    for( var i = 0, l = symbols.length ; i < l ; i++ ) {
      symbol = symbols[i];
      match = this.tail.match( symbol.pattern );
      if( match !== null && ( nextToken === null || match.index < nextTokenPosition ) ) {
        nextToken = { type: symbol.name, value: match[0] };
        nextTokenPosition = match.index;
      }
    }

    if( nextTokenPosition > 0 ) {
      nextToken = { type: "text", value: this.tail.substr( 0, nextTokenPosition ) };
    }

    return nextToken;
  };

  Parser.prototype.next = function() {
    this.currentToken = this.peek();
    this.pos += this.currentToken.value.length;
    this.tail = this.tail.substr( this.currentToken.value.length );
  };

  return Parser;

} );