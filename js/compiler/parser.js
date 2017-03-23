define( [
  "compiler/cserror"
], function(
  CSError
) {

  var symbols = [
    { name: "eol", pattern: /\n/ },
    { name: "escaped", pattern: /`.?/ },

    { name: "comment", pattern: /\/\// },
    { name: "comment_start", pattern: /\/\*/},

    { name: ".", pattern: /\./ },
    { name: ",", pattern: /,/ },
    { name: ":", pattern: /:/ },
    { name: ";", pattern: /;/ },
    { name: "(", pattern: /\(/ },
    { name: ")", pattern: /\)/ },
    { name: "|", pattern: /\|/ },

    { name: "=>", pattern: /=>/ },
    { name: "~", pattern: /~/ },
    { name: "=", pattern: /=/ },
    { name: "+", pattern: /\+/ },
    { name: "-", pattern: /-/ },
    { name: "*", pattern: /\*/ },
    { name: "/", pattern: /\// },
    { name: "%", pattern: /%/ },

    { name: "spaces", pattern: /[ \t]+/ },
    { name: "number", pattern: /\d+/ },
    { name: "keyword", pattern: /(?:chain|default|def|include|invert|marker|var|void)\b/ },
    { name: "def", pattern: /\^\w+/ },
    { name: "var", pattern: /\$\w+/ }
  ];

  function Parser( input ) {
    this.tokens = typeof input === "string" ? this.parseTokens( input ) : input;
    this.saves = [];
    this.setPos( 0 );
  }

  Parser.prototype.parseTokens = function( code ) {
    var tokens = [],
      currentLine = 1,
      nextToken, nextTokenPosition, match;

    while( code !== "" ) {
      nextToken = null;

      symbols.forEach( function( symbol ) {
        match = code.match( symbol.pattern );
        if( match !== null && ( nextToken === null || nextTokenPosition > match.index ) ) {
          nextToken = { type: symbol.name, value: match[0], line: currentLine };
          nextTokenPosition = match.index;
        }
      } );

      if( nextToken === null ) nextTokenPosition = code.length;

      if( nextTokenPosition > 0 ) {
        tokens.push( { type: "text", value: code.substr( 0, nextTokenPosition ), line: currentLine } );
      }

      if( nextToken !== null ) {
        if( nextToken.type === "eol" ) {
          currentLine++;
        }
        else if( nextToken.type === "escaped" ) {
          nextToken.type = "text";
          nextToken.value = nextToken.value.substr( 1 );
          nextTokenPosition += 1;
        }

        if( nextToken.type === "comment" ) {
          nextTokenPosition = code.match( /(?:\n|$)/ ).index;
        }
        else if( nextToken.type === "comment_start" ) {
          currentLine += code.match(/[\s\S]*\*\//)[0].split(/\r\n|\r|\n/).length-1;
          nextTokenPosition = code.match( /\*\// ).index+2;
        }
        else {
          tokens.push( nextToken );
          nextTokenPosition += nextToken.value.length;
        }
      }

      code = code.substr( nextTokenPosition );
    }

    if( tokens.length > 0 ) tokens.push( { type: "eol", value: null, line: currentLine } );
    tokens.push( { type: "eos", value: null, line: currentLine } );

    return this.cleanTokens( tokens );
  };

  Parser.prototype.cleanTokens = function( rawTokens ) {
    var tokens = [],
      buffer = [];

    for( var i = 0, l = rawTokens.length ; i < l ; i++ ) {
      var rawToken = rawTokens[i];

      if( rawToken.type === "eol" ) {
        if( buffer.length > 0 && buffer[0].type === "eol" ) buffer = [ buffer[0] ];
        else buffer = [ rawToken ];
      }
      else if( rawToken.type === "spaces" ) {
        buffer.push( rawToken );
      }
      else {
        tokens = tokens.concat( buffer );
        tokens.push( rawToken );
        buffer = [];
      }
    }

    return tokens;
  };

  Parser.prototype.setPos = function( pos ) {
    this.pos = pos;
    this.current = this.tokens[ this.pos ];
  };

  Parser.prototype.save = function() {
    this.saves.push( this.pos );
  };

  Parser.prototype.popSave = function() {
    return this.saves.pop();
  };

  Parser.prototype.restore = function() {
    this.setPos( this.popSave() );
  };

  Parser.prototype.eos = function() {
    return this.current.type === "eos";
  };

  Parser.prototype.eol = function() {
    return this.current.type === "eol" || this.eos();
  };

  Parser.prototype.next = function() {
    this.setPos( this.pos + 1 );
  };

  Parser.prototype.peek = function() {
    return this.tokens[ this.pos + 1 ];
  };

  Parser.prototype.require = function( tokenType, tokenValue ) {
    var currentToken = this.current;
    if( currentToken.type !== tokenType || tokenValue != null && currentToken.value !== tokenValue ) {
      var expectedToken = ( tokenValue == null ) ? tokenType : tokenValue;
      throw new CSError( "UNEXPECTED_TOKEN", currentToken, expectedToken );
    }
  };

  Parser.prototype.eat = function( tokenType, tokenValue ) {
    var currentToken = this.current;
    this.require( tokenType, tokenValue );
    this.next();
    return currentToken;
  };

  Parser.prototype.skip = function( tokenType ) {
    while( this.current.type === tokenType ) this.next();
  };

  Parser.prototype.skipUntil = function( tokenType ) {
    while( this.current.type !== tokenType && this.eos() === false ) this.next();
  };

  Parser.prototype.readUntil = function( tokenTypes ) {
    var tokens = [];
    if( typeof tokenTypes === "string" ) tokenTypes = [ tokenTypes ];

    while( this.eos() === false && tokenTypes.indexOf( this.current.type ) === -1 ) {
      tokens.push( this.current );
      this.next();
    }

    return tokens;
  };

  return Parser;

} );