define( [
  "compiler/scope",
  "utils/scanner",
  "compiler/def",
  "compiler/blockpile",
  "commandtools"
], function(
  Scope,
  Scanner,
  Def,
  BlockPile,
  CT
) {

  var expressionRes = {
    "openingDef": /\^\w+\s*\(/,
    "closingDef": /\)/,
    "openingOperation": /\{#/,
    "closingOperation": /#\}/,
    "variable": /\$\w+/
  };

  function extractRe( re ) {
    var match = re.toString().match( /^\/(.+)\/[a-z]*$/ );
    return match[1];
  }

  function combineRes() {
    var res = [],
      i = arguments.length,
      j, re;

    while( i-- ) {
      for( j in arguments[i] ) {
        re = arguments[i][j];
        res.push( extractRe( re ) );
      }
    }

    return new RegExp( "(?:" + res.join( "|" ) + ")" );
  }

  var expressionRe = combineRes( expressionRes );

  function Compiler() {
    this.files = {};
  }

  Compiler.prototype = {

    setFiles: function( files ) {
      this.files = files;
    },

    compile: function( fileName ) {
      var code = this.files[ fileName ],
        scope = new Scope(),
        output = "";

      scope.addInclude( fileName );
      this.prepareScope( code, scope );
      scope.resetIncludes();
      scope.addInclude( fileName );
      output = this.parseSection( code, scope );
      var blockPiles = this.generateBlocks( output );

      console.log( "blockPiles", blockPiles );
      if( blockPiles.every( function( pile ){ return pile.blocks.length === 0 } ) ) {
        app.ui.popin.show( "alert", {
          "title": "Error",
          "text": "Compilation resulted in no command blocks."
        } );
        return "";
      }

      var command = CT.summonPiles( blockPiles );
      if( command.length > 32500 ) {
        app.ui.popin.show( "alert", {
          "title": "Error",
          "text": "Warning: summon command is too long! (" + command.length + " characters)"
        } );
      }

      return command;
    },

    prepareScope: function( code, scope ) {
      code = this.cleanCode( code );

      var scanner = new Scanner( code ),
        line, match;

      // Includes

      while( !scanner.eos() ) {
        scanner.scanUntil( /^include(?:\s|$)/m );
        line = scanner.scan( /.*/ );

        if( line.match( /^include(?:\s|$)/ ) ) {
          match = line.match( /^include\s+(\w+)$/ );
          if( match === null ) throw "Incorrect include on line : " + line;

          var include = match[1];
          if( typeof this.files[ include ] === "undefined" ) throw "Missing file for include : " + include;

          if( ! scope.hasInclude( include ) ) {
            scope.addInclude( include );
            this.prepareScope( this.files[ include ], scope );
          }
        }
      }

      // Defs

      scanner.reset();

      while( !scanner.eos() ) {
        scanner.scanUntil( /^def(?:\s|$)/m );
        line = scanner.scan( /.*/ );

        if( line.match( /^def(?:\s|$)/ ) ) {
          match = line.match( /^def\s+\^(\w+)\s*\(([^\)]*)\)$/ );
          if( match === null ) throw "Incorrect def on line : " + line;

          scanner.scan( /\n/ );
          var defName = match[1],
            defArgs = match[2],
            defCode = scanner.scanBlock(),
            def = new Def( defArgs, defCode );

          scope.setDef( defName, def );
          // console.log( 'def', def );
        }
      }
    },

    parseSection: function( code, scope ) {
      var output = "",

        match;

      code = this.cleanCode( code );

      var scanner = new Scanner( code );
      while( !scanner.eos() ) {
        var block = scanner.scanBlock();
        scanner.scan( /\n/ );

        block = this.reduceBlock( block );

        // Includes
        if( block.match( /^include(?:\s|$)/ ) ) {
          match = block.match( /^include\s+(\w+)$/ );
          if( match === null ) throw "Incorrect include on line : " + block;

          var include = match[1];
          if( typeof this.files[ include ] === "undefined" ) throw "Missing file for include : " + include;

          if( !scope.hasInclude( include ) ) {
            scope.addInclude( include );
            this.parseSection( this.files[ include ], scope );
          }
          continue;
        }

        // Declarations

        // Def
        if( block.match( /^def(?:\s|$)/ ) ) continue;

        // Variable
        if( ( match = block.match( /^\$(\w+)\s*=\s*(.+)/ ) ) !== null ) {
          scope.setVar( match[1], this.parseExpressions( new Scanner( match[2] ), scope ) );
          continue;
        }

        block = this.parseExpressions( new Scanner( block ), scope );

        // Compiler instructions
        if( block.match( /^position(?:\s|$)/ ) ) {
          match = block.match( /^position\s+(?:~?-?\d+|~)\s+(?:~?-?\d+|~)\s+(?:~?-?\d+|~)$/ );
          if( match === null ) throw "Incorrect position on line : " + block;
        }

        if( block.match( /^default(?:\s|$)/ ) ) {
          match = block.match( /^default\s+([irc\?!01]+)$/ );
          if( match === null ) throw "Incorrect default on line : " + block;
        }

        if( output === "" ) output = block;
        else output += "\n" + block;

        // console.log('block', block);
      }

      output = this.unescapeCharacters( output );

      console.log( "output", output );
      return output;
    },

    unescapeCharacters: function( str ) {
      return str.replace( /\\(.?)/g, "$1" );
    },

    cleanCode: function( code ) {
      return code.replace( /[\t ]*(?:\/\/.*)?$/mg, "" );
    },

    parseExpressions: function( scanner, scope, context ) {
      if( typeof context === "undefined" ) context = null;

      var output = "", escape, tag;

      while( !scanner.eos() ) {
        output += scanner.scanUntil( expressionRe );

        tag = scanner.scan( expressionRe );

        if( ( escape = output.match( /(\\)+$/ ) ) !== null ) {
          if( escape[0].length % 2 === 1 ) {
            output += tag;
            continue;
          }
        }

        // Variable
        if( tag.match( expressionRes.variable ) ) {
          var varName = tag.match( /\w+/ )[0];
          output += scope.getVar( varName );
        }

        // Def
        if( tag.match( expressionRes.openingDef ) ) {
          var defName = tag.match( /\w+/ )[0],
            defArgs = this.parseExpressions( scanner, scope, "def" );
          output += this.executeDef( scope, defName, defArgs );
        }
        else if( tag.match( expressionRes.closingDef ) ) {
          // if( context !== 'def' ) throw 'Unexpected def ending ")"';
          if( context === "def" ) {
            context = null;
            break;
          }
          else {
            output += tag;
            continue;
          }
        }

        // Operations
        else if( tag.match( expressionRes.openingOperation ) ) {
          var operation = this.parseExpressions( scanner, scope, "operation" );
          output += this.calculateOperation( operation );
        }
        else if( tag.match( expressionRes.closingOperation ) ) {
          if( context !== "operation" ) throw "Unexpected operation ending \"}}\"";
          context = null;
          break;
        }

      }

      if( context !== null ) throw "Unbalanced " + context;
      return output;
    },

    executeDef: function( scope, defName, defArgs ) {
      var def = scope.getDef( defName );
      if( def === null ) throw "Call to undefined def : " + defName;
      var defScope = new Scope( scope );
      return def.execute( this, defScope, defArgs );
    },

    calculateOperation: function( operation ) {
      operation = operation.trim();

      while( operation.match( /(?:~?-?\d+|~)\s+(?:~?-?\d+|~)\s+(?:~?-?\d+|~)\s*\+\s*(?:~?-?\d+|~)\s+(?:~?-?\d+|~)\s+(?:~?-?\d+|~)/ ) ) {
        operation = operation.replace( /((?:~?-?\d+|~)\s+(?:~?-?\d+|~)\s+(?:~?-?\d+|~))\s*\+\s*((?:~?-?\d+|~)\s+(?:~?-?\d+|~)\s+(?:~?-?\d+|~))/,
          function( match, c1, c2 ) {
            return CT.addCoordinates( c1, c2 );
          }
        );
      }

      return operation;
    },

    reduceBlock: function( block ) {
      var lines = block.split( /$/m );

      lines = lines.map( function( line, i ) {
        line = line.trim();
        if( line !== "" && i > 0 ) {
          if( line[0] === "+" ) line = line.slice( 1 );
          else line = " " + line;
        }
        return line;
      } );

      return lines.join( "" );
    },

    generateBlocks: function( code ) {
      var compiler = this,
        currentPile = new BlockPile(),
        blockPiles = [ currentPile ],
        scanner = new Scanner( code ),
        defaultAttr = "c1!", blockAttr,
        match;

      while( !scanner.eos() ) {
        var line = scanner.scanUntil( /\n/ );
        scanner.scan( /\n/ );

        // Position
        if( ( match = line.match( /^position\s+((?:~?-?\d+|~))\s+((?:~?-?\d+|~))\s+((?:~?-?\d+|~))$/ ) ) !== null ) {
          currentPile = new BlockPile( match.slice( 1 ).join( " " ) );
          blockPiles.push( currentPile );
          continue;
        }

        // Default
        if( ( match = line.match( /^default\s+([irc\?!01]+)$/ ) ) !== null ) {
          defaultAttr = this.reduceAttr( defaultAttr + match[1] );
          continue;
        }

        // BlockAttr
        blockAttr = defaultAttr;
        line = line.replace( /^([irc01\?!]+):/, function( match, attr ) {
          blockAttr = compiler.reduceAttr( blockAttr + attr );
          return "";
        } );

        currentPile.pushCommandBlock( blockAttr, line );
      }
      return blockPiles;
    },

    reduceAttr: function( attr ) {
      var type = "",
        active = "",
        conditional = "",

        i = attr.length, c;

      while( i-- ) {
        c = attr[i];
        if( c.match( /[irc]/ ) && type === "" ) type = c;
        else if( c.match( /[\?!]/ ) && conditional === "" ) conditional = c;
        else if( c.match( /[01]/ ) && active === "" ) active = c;
      }

      return type + active + conditional;
    }

  };

  return Compiler;

} );