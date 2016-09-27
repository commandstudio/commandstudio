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
  }

  Parser.prototype.eos = function() {
    return this.tail === "";
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
      }
    }

    if( nextTokenPosition > 0 ) {
      nextToken = { type: "text", value: this.tail.substr( 0, nextTokenPosition ) };
    }

    return nextToken;
  };

  Parser.prototype.next = function() {
    var nextToken = this.peek();
    this.pos += nextToken.value.length;
    this.tail = this.tail.substr( nextToken.value.length );
    return nextToken;
  };

  return Parser;

} );

