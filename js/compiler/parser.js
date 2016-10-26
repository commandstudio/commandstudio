define( function() {

  var symbols = [
    { name: "eos", pattern: /$/ },
    { name: "eol", pattern: /\n/ },

    { name: ":", pattern: /:/ },
    { name: "~", pattern: /~/ },
    { name: ".", pattern: /\./ },

    { name: "-", pattern: /-/ },

    { name: "spaces", pattern: /[ \t]+/ },
    { name: "number", pattern: /\d+/ },
    { name: "keyword", pattern: /(?:chain)\b/ },
    { name: "var", pattern: /\$\w+/ }
  ];

  function Parser( input ) {
    if( typeof input === "string" ) this.tokens = this.parseTokens( input );
    this.pos = 0;
  }

  Parser.prototype.parseTokens = function( code ) {
    var tokens = [],
      nextToken, nextTokenPosition, match;

    while( code !== "" ) {
      nextToken = null;

      symbols.forEach( function( symbol ) {
        match = code.match( symbol.pattern );
        if( match !== null && ( nextToken === null || nextTokenPosition > match.index ) ) {
          nextToken = { type: symbol.name, value: match[0] };
          nextTokenPosition = match.index;
        }
      } );

      if( nextToken === null ) {
        tokens.push( { type: "text", value: code } );
        break;
      }

      if( nextTokenPosition > 0 ) {
        tokens.push( { type: "text", value: code.substr( 0, nextTokenPosition ) } );
      }

      if( nextToken !== null ) {
        if( nextToken.type === "escaped" ) {
          nextToken = { type: "text", value: nextToken.value.substr( 1 ) };
          nextTokenPosition += 1;
        }
        tokens.push( nextToken );
      }

      code = code.substr( nextTokenPosition + nextToken.value.length );
    }

    tokens.push( { type: "eos", value: null } );

    return this.cleanTokens( tokens );
  };

  Parser.prototype.cleanTokens = function( rawTokens ) {
    var tokens = [];

    for( var i = 0, l = tokens.length ; i < l ; i++ ) {
      // TODO
    }

    return rawTokens;
  };

  Parser.prototype.eos = function() {
    return this.current().type === "eos";
  };

  Parser.prototype.eol = function() {
    return this.current().type === "eol" || this.eos();
  };

  Parser.prototype.current = function() {
    return this.tokens[ this.pos ];
  };

  Parser.prototype.next = function() {
    this.pos++;
  };

  Parser.prototype.eat = function( tokenType, tokenValue ) {
    var currentToken = this.current();
    if( currentToken.type !== tokenType || tokenValue != null && currentToken.value !== tokenValue ) {
      throw "Unexpected token: " + currentToken.type;
    }
    this.next();
    return currentToken;
  };

  Parser.prototype.skip = function( tokenType ) {
    while( this.current().type === tokenType ) this.next();
  };

  return Parser;

} );