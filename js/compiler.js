define( [
  "compiler/parser",
  "compiler/context",
  "compiler/scope",
  "compiler/chain",
  "compiler/cserror",
  "commandtools"
], function(
  Parser,
  Context,
  Scope,
  Chain,
  CSError,
  CT
) {

  function compareStrLength( a, b ) {
    return a.length - b.length;
  }

  var numRe = /^(?:~?-?(?:\.\d+|\d+\.?\d*)|~)$/,
    nameRe = /^\w+$/,
    attrRe = /^[irc01!\?]+$/;

  function Compiler() {
    this.files = {};
  }

  Compiler.prototype.setFiles = function( files ) {
    this.files = files;
  };

  Compiler.prototype.compile = function( fileName, options ) {
    this.options = options;

    var context = new Context(),
      scope = new Scope(),
      commands = [];

    // scope.addInclude( fileName );
    // this.prepareScope( code, scope );
    // scope.resetIncludes();
    // scope.addInclude( fileName );

    context.set( "scope", scope );
    context.set( "mode", "commands" );
    context.set( "output", commands );
    context.set( "indentation", "" );
    context.set( "attr", "" );

    this.parseFile( fileName, context );

    var compiledCommand = this.compileCommands( commands );

    if( compiledCommand > 32500 ) {
      throw new CSError( "TOO_LONG", null, compiledCommand.length );
    }

    return compiledCommand;
  };

  Compiler.prototype.requireIndentation = function( parser, context ) {
    var currentIndentation = context.get( "indentation" ),
      token = parser.current;

    parser.require( "spaces" );

    if( compareStrLength( token.value, currentIndentation ) > 0 ) {
      return token.value;
    }
    else {
      throw new CSError( "INCORRECT_INDENTATION", token );
    }
  };

  Compiler.prototype.parseNumber = function( parser ) {
    var number = "",
      firstToken = parser.current;

    if( parser.current.type === "~" ) {
      number += "~";
      parser.next();
    }
    if( parser.current.type === "-" ) {
      number += "-";
      parser.next();
    }
    if( parser.current.type === "number" ) {
      number += parser.current.value;
      parser.next();
    }
    if( parser.current.type === "." ) {
      number += ".";
      parser.next();
    }
    if( parser.current.type === "number" ) {
      number += parser.current.value;
      parser.next();
    }

    if( numRe.test( number ) === false ) {
      throw new CSError( "NOT_A_NUMBER", firstToken );
    }

    return number;
  };

  Compiler.prototype.parseCoordinates = function( parser ) {
    var coordinates = {};
    coordinates.x = this.parseNumber( parser );
    parser.eat( "spaces" );
    coordinates.y = this.parseNumber( parser );
    parser.eat( "spaces" );
    coordinates.z = this.parseNumber( parser );
    return coordinates;
  };

  Compiler.prototype.parseUntil = function( parser, context, untilTypes ) {
    var output = "";

    if( typeof untilTypes === "string" ) untilTypes = [ untilTypes ];

    while( untilTypes.indexOf( parser.current.type ) === -1 ) {
      if( parser.current.type === "var" ) {
        output += this.parseVarCall( parser, context );
      }
      else {
        output += parser.current.value;
        parser.next();
      }
    }

    return output;
  };

  Compiler.prototype.parseChain = function( parser, context ) {
    parser.eat( "keyword", "chain" );
    parser.eat( "spaces" );
    var coordinates = this.parseCoordinates( parser, context );
    parser.skip( "spaces" );
    parser.eat( ":" );
    parser.eat( "eol" );

    var chain = new Chain( coordinates ),
      chainContext = new Context( context ),
      chainScope = context.get( "scope" ).push();

    chainContext.set( "mode", "chain" );
    chainContext.set( "indentation", this.requireIndentation( parser, context ) );
    chainContext.set( "scope", chainScope );
    chainContext.set( "output", chain );

    this.parseSection( parser, chainContext );

    return chain;
  };

  Compiler.prototype.parseInclude = function( parser, context ) {
    var includeToken = parser.current,
      fileName;

    parser.eat( "keyword", "include" );
    parser.eat( "spaces" );

    fileName = this.parseUntil( parser, context, "eol" );
    if( nameRe.test( fileName ) === false ) {
      throw new CSError( "INCORRECT_NAME", includeToken, fileName );
    }
    this.parseFile( fileName, context );

    parser.eat( "eol" );
  };

  Compiler.prototype.parseVarDeclaration = function( parser, context ) {
    var scope = context.get( "scope" ),
      varName, varValue = null;

    parser.eat( "keyword", "var" );
    parser.eat( "spaces" );
    varName = parser.eat( "var" ).value;

    scope.declareVar( varName );

    parser.skip( "spaces" );
    if( parser.current.type === "=" ) {
      parser.eat( "=" );
      parser.skip( "spaces" );
      varValue = this.parseUntil( parser, context, "eol" );
    }
    parser.eat( "eol" );

    scope.setVar( varName, varValue );
  };

  Compiler.prototype.parseVarAssignation = function( parser, context ) {
    var scope = context.get( "scope" ),
      varToken, varValue;

    varToken = parser.eat( "var" );
    parser.skip( "spaces" );

    if( parser.current.type !== "=" ) return false;

    parser.eat( "=" );
    parser.skip( "spaces" );
    varValue = this.parseUntil( parser, context, "eol" );
    parser.eat( "eol" );

    if( scope.setVar( varToken.value, varValue ) === false ) {
      throw new CSError( "UNDECLARED_VAR", varToken );
    }

    return true;
  };

  Compiler.prototype.parseVarCall = function( parser, context ) {
    var scope = context.get( "scope" ),
      varToken = parser.eat( "var" ),
      varValue = scope.getVar( varToken.value );

    if( varValue === null ) {
      throw new CSError( "UNDEFINED_VAR", varToken );
    }
    else if( varValue === false ) {
      throw new CSError( "UNDECLARED_VAR", varToken );
    }

    return varValue;
  };

  Compiler.prototype.parseCommand = function( parser, context ) {
    var command = this.parseUntil( parser, context, "eol" ),
      indentation = context.get( "indentation" );
    parser.next();

    if( parser.current.type === "spaces" && compareStrLength( parser.current.value, indentation ) > 0 ) {
      indentation = parser.current.value;
      while( parser.current.type === "spaces" && parser.current.value === indentation ) {
        parser.next();
        if( parser.current.type === "+" ) {
          parser.next();
          command += this.parseUntil( parser, context, "eol" );
        }
        else {
          command += " " + this.parseUntil( parser, context, "eol" );
        }
        parser.next();
      }
    }

    return command;
  };

  Compiler.prototype.parseCommandBlock = function( parser, context ) {
    var commandBlock = context.get( "output" ).currentBlock,
      part;

    commandBlock.applyAttr( context.get( "attr" ) );

    parser.save();
    part = this.parseUntil( parser, context, [ "eol", ":" ] );
    if( parser.current.type === ":" && attrRe.test( part ) ) {
      commandBlock.applyAttr( part );
      parser.next();
      parser.popSave();
    }
    else {
      parser.restore();
    }

    commandBlock.command = this.parseCommand( parser, context );

    return commandBlock;
  };

  Compiler.prototype.parseFile = function( fileName, context ) {
    var code = this.files[ fileName ],
      parser = new Parser( code );
    this.parseSection( parser, context );
  };

  Compiler.prototype.parseSection = function( parser, context ) {
    var mode = context.get( "mode" ),
      output = context.get( "output" ),
      currentIndentation = context.get( "indentation" ),
      token = parser.current;

    while( ! parser.eos() ) {
      token = parser.current;

      // Indentation checking
      if( token.type === "spaces" ) {
        var comp = compareStrLength( token.value, currentIndentation );
        if( comp < 0 ) break;
        else if( comp > 0 ) {
          throw new CSError( "INCORRECT_INDENTATION", token );
        }
        parser.next();
        token = parser.current;
      }
      else if( currentIndentation !== "" ) {
        break;
      }

      // Special instructions
      if( mode === "commands" ) {
        if( token.type === "keyword" && token.value === "chain" ) {
          var chain = this.parseChain( parser, context );
          output.push( chain );
          continue;
        }

        if( token.type === "keyword" && token.value === "include" ) {
          this.parseInclude( parser, context );
          continue;
        }
      }

      if( token.type === "keyword" && token.value === "var" ) {
        this.parseVarDeclaration( parser, context );
        continue;
      }

      if( token.type === "var" ) {
        parser.save();
        if( this.parseVarAssignation( parser, context ) ) {
          parser.popSave();
          continue;
        }
        else {
          parser.restore();
        }
      }

      // Command
      if( mode === "commands" ) {
        var command = this.parseCommand( parser, context );
        output.push( command );
      }
      // CommandBlock
      else if( mode === "chain" ) {
        var commandBlock = this.parseCommandBlock( parser, context );
        output.push( commandBlock );
      }
    }

    console.log( output );
  };

  Compiler.prototype.compileChain = function( chain ) {
    var output = [],
      command, commandBlock;

    for( var i = 0, l = chain.commandBlocks.length ; i < l ; i++ ) {
      commandBlock = chain.commandBlocks[i];
      command = "setblock " + commandBlock.x + " " + commandBlock.y + " " + commandBlock.z + " ";
      command += commandBlock.type + " " + commandBlock.getDataValue() + " replace " + commandBlock.getDataTag();
      output.push( command );
    }

    return output;
  };

  Compiler.prototype.compileCommands = function( input ) {
    var commands = [],
      minecarts = [],
      i, l;

    for( i = 0, l = input.length ; i < l ; i++ ) {
      if( typeof input[i] === "string" ) {
        commands.push( input[i] );
      }
      else {
        commands = commands.concat( this.compileChain( input[i] ) );
      }
    }

    if( commands.length === 0 ) {
      throw new CSError( "NO_COMMAND" );
    }

    commands.push( "setblock ~ ~-1 ~ command_block 0 replace {auto:1,Command:kill @e[type=MinecartCommandBlock,r=1]}" );

    for( i = 0, l = commands.length ; i < l ; i++ ) {
      minecarts.push( { id: "MinecartCommandBlock", Command: commands[i] } );
    }

    var root = {
      Block: "chain_command_block",
      TileEntityData: { Command: "fill ~ ~ ~ ~ ~2 ~ air" },
      Time: 1,
      Passengers: [ {
        id: "FallingSand",
        Block: "redstone_block",
        Time: 1,
        Passengers: [ {
          id: "FallingSand",
          Block: "activator_rail",
          Time: 1,
          Passengers: minecarts
        } ]
      } ]
    };

    var summonCommand = "summon FallingSand ~ ~.6 ~ " + CT.serialize( root );

    return summonCommand;
  };

  return Compiler;

} );