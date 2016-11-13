define( [
  "compiler/parser",
  "compiler/context",
  "compiler/scope",
  "compiler/output",
  "compiler/chain",
  "compiler/cserror",
  "utils/commandtools"
], function(
  Parser,
  Context,
  Scope,
  Output,
  Chain,
  CSError,
  CT
) {

  var numRe = /^(?:~?[\+-]?(?:\.\d+|\d+\.?\d*)|~)$/,
    numsRe = /^(?:~?[\+-]?(?:\.\d+|\d+\.?\d*)|~)(?:[ \t]+(?:~?[\+-]?(?:\.\d+|\d+\.?\d*)|~))*$/,
    nameRe = /^\w+$/,
    attrRe = /^[irc01!\?]+$/,
    directionRe = /^[\+-][xyz]$/,

    termOperators = [ "*", "/", "%" ],
    exprOperators = [ "+", "-" ];

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
      commandSet = new Output();

    context.set( "scope", scope );
    context.set( "mode", "commands" );
    context.set( "output", commandSet );
    context.set( "indentation", "" );
    context.set( "block_attr", "" );
    context.set( "chain_direction", "+y" );

    this.parseFile( fileName, context );

    var compiledCommand = this.compileCommands( commandSet.values );

    if( compiledCommand > 32500 ) {
      throw new CSError( "TOO_LONG", null, compiledCommand.length );
    }

    return compiledCommand;
  };

  Compiler.prototype.compareIndentation = function( parser, context ) {
    var currentIndentation = context.get( "indentation" ),
      token = parser.current,
      minLength;

    if( token.type !== "spaces" ) {
      if( currentIndentation === "" ) return 0;
      else return -1;
    }
    else {
      minLength = Math.min( currentIndentation.length, token.value.length );
      if( currentIndentation.substr( 0, minLength ) !== token.value.substr( 0, minLength ) ) {
        throw new CSError( "INCORRECT_INDENTATION", token );
      }
      else {
        return token.value.length - currentIndentation.length;
      }
    }
  };

  Compiler.prototype.requireIndentation = function( parser, context ) {
    var token = parser.current;

    if( this.compareIndentation( parser, context ) > 0 ) {
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

  Compiler.prototype.parseNumbers = function( parser, context, untilTypes ) {
    var firstToken = parser.current,
      numbers = [],
      rawNumbers,
      buffer = "",
      untilSpaces = false;

    if( untilTypes.indexOf( "spaces" ) === -1 ) {
      untilTypes.push( "spaces" );
    }
    else {
      untilSpaces = true;
    }

    buffer = this.parseUntil( parser, context, untilTypes );
    if( numsRe.test( buffer ) ) {
      rawNumbers = buffer;
    }
    else {
      throw new CSError( "NOT_A_NUMBER", firstToken );
    }

    while( untilSpaces === false && parser.current.type === "spaces" ) {
      parser.save();
      parser.next();
      buffer = this.parseUntil( parser, context, untilTypes );
      if( numsRe.test( buffer ) ) {
        rawNumbers += " " + buffer;
        parser.popSave();
      }
      else {
        parser.restore();
        break;
      }
    }

    numbers = rawNumbers.split( /[ \t]+/ );

    return numbers;
  };

  Compiler.prototype.parseCoordinates = function( parser, context, untilTypes ) {
    var firstToken = parser.current,
      coordinates = this.parseNumbers( parser, context, untilTypes );

    if( coordinates.length !== 3 ) {
      throw new CSError( "INVALID_COORDINATES", firstToken );
    }

    return coordinates;
  };

  Compiler.prototype.parseFactor = function( parser, context ) {
    var result;

    if( parser.current.type === "(" ) {
      result = this.parseOperation( parser, context );
    }
    else if( parser.current.type === "|" ) {
      parser.next();
      parser.skip( "spaces" );
      result = this.parseNumbers( parser, context, [ "|", "eol" ] );
      parser.skip( "spaces" );
      parser.eat( "|" );
    }
    else {
      result = this.parseNumbers( parser, context, [ "spaces", "eol", "+", "-", "*", "/", "%", ")" ] );
    }

    return result;
  };

  Compiler.prototype.parseExpr = function( parser, context ) {
    var result = this.parseTerm( parser, context ),
      operator;
    parser.skip( "spaces" );

    if( exprOperators.indexOf( parser.current.type ) !== -1 ) {
      operator = parser.current.type;
      parser.next();
      parser.skip( "spaces" );
      result = CT.numsOp( operator, result, this.parseExpr( parser, context ) );
    }

    return result;
  };

  Compiler.prototype.parseTerm = function( parser, context ) {
    var result = this.parseFactor( parser, context ),
      operator;
    parser.skip( "spaces" );

    if( termOperators.indexOf( parser.current.type ) !== -1 ) {
      operator = parser.current.type;
      parser.next();
      parser.skip( "spaces" );
      result = CT.numsOp( operator, result, this.parseTerm( parser, context ) );
    }

    return result;
  };

  Compiler.prototype.parseOperation = function( parser, context ) {
    var result;
    parser.eat( "(" );
    parser.skip( "spaces" );
    result = this.parseExpr( parser, context );
    parser.skip( "spaces" );
    parser.eat( ")" );
    return result;
  };

  Compiler.prototype.parseValue = function( parser, context ) {
    var output, token;

    if( parser.current.type === "(" ) {
      token = parser.current;
      try {
        output = this.parseOperation( parser, context ).join( " " );
      }
      catch( exception ) {
        if( typeof exception === "string" ) throw new CSError( exception, token );
        throw exception;
      }
    }
    else if( parser.current.type === "def" ) {
      output = this.parseDefCall( parser, context, true );
    }
    else if( parser.current.type === "var" ) {
      output = this.parseVarCall( parser, context );
    }
    else {
      output =  parser.current.value;
      parser.next();
    }

    return output;
  };

  Compiler.prototype.parseUntil = function( parser, context, untilTypes, trim ) {
    var output = "";
    trim = trim != null ? trim : false;

    if( typeof untilTypes === "string" ) untilTypes = [ untilTypes ];
    untilTypes.push( "eos" );

    while( untilTypes.indexOf( parser.current.type ) === -1 ) {

      if( parser.current.type === "spaces" && trim === true && untilTypes.indexOf( parser.peek().type ) !== -1 ) {
        parser.next();
        continue;
      }

      output += this.parseValue( parser, context );
    }

    return output;
  };

  Compiler.prototype.parseChain = function( parser, context ) {
    var coordinates,
      direction = context.get( "chain_direction" ),
      chainToken = parser.eat( "keyword", "chain" );
    parser.eat( "spaces" );

    coordinates = this.parseCoordinates( parser, context, [ ":", ",", "eol" ] );

    parser.skip( "spaces" );
    if( parser.current.type === "," ) {
      parser.next();
      parser.skip( "spaces" );

      direction = this.parseUntil( parser, context, [ ":", ",", "eol" ] );
      if( directionRe.test( direction ) === false ) {
        throw new CSError( "INVALID_DIRECTION", chainToken );
      }
    }

    parser.eat( ":" );
    parser.eat( "eol" );

    var chain = new Chain( coordinates, direction ),
      chainContext = context.push(),
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
    else if( typeof this.files[fileName] === "undefined" ) {
      throw new CSError( "INCLUDE_FAIL", includeToken, fileName );
    }
    this.parseFile( fileName, context );

    parser.eat( "eol" );
  };

  Compiler.prototype.parseDefault = function( parser, context ) {
    var defaultToken, param, value;

    defaultToken = parser.eat( "keyword", "default" );
    parser.eat( "spaces" );
    param = this.parseUntil( parser, context, [ "spaces", "eol" ] );
    parser.eat( "spaces" );
    value = this.parseUntil( parser, context, [ "spaces", "eol" ] );

    if( param === "block_attr" && attrRe.test( value ) ) {
      context.set( "block_attr", value );
    }
    else if( param === "chain_direction" && directionRe.test( value ) ) {
      context.set( "chain_direction", value );
    }
    else {
      throw new CSError( "INCORRECT_DEFAULT", defaultToken );
    }

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
    parser.skip( "eol" );

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
    parser.skip( "eol" );

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

  Compiler.prototype.parseDefDeclaration = function( parser, context ) {
    var def = {},
      defToken,
      argument;

    parser.eat( "keyword", "def" );
    parser.eat( "spaces" );
    defToken = parser.eat( "def" );
    def.name = defToken.value;

    parser.skip( "spaces" );
    parser.eat( "(" );
    parser.skip( "spaces" );

    def.arguments = [];
    while( parser.current.type !== ")" ) {
      argument = {};
      argument.name = parser.eat( "var" ).value;
      parser.skip( "spaces" );

      argument.defaultValue = null;
      if( parser.current.type === "=" ) {
        parser.eat( "=" );
        parser.skip( "spaces" );
        argument.defaultValue = this.parseUntil( parser, context, [ ")", ";" ], true );
      }

      def.arguments.push( argument );
      if( parser.current.type !== ")" ) {
        parser.eat( ";" );
        parser.skip( "spaces" );
      }
    }

    parser.eat( ")" );
    parser.skip( "spaces" );
    parser.eat( ":" );
    parser.eat( "eol" );

    var bodyContext = context.push(), comp;
    bodyContext.set( "indentation", this.requireIndentation( parser, context ) );
    def.body = [];

    while( ! parser.eos() ) {
      comp = this.compareIndentation( parser, bodyContext );
      if( comp === 0 && parser.current.type === "spaces" ) parser.next();
      else if( comp < 0 ) break;

      while( parser.current.type !== "eol" ) {
        def.body.push( parser.current );
        parser.next();
      }
      def.body.push( parser.current );
      parser.next();
    }

    def.body[ def.body.length - 1 ].type = "eos";

    return def;
  };

  Compiler.prototype.parseDefCall = function( parser, context, read ) {
    read = read != null ? read : false;

    var scope = context.get( "scope" ),
      defToken = parser.eat( "def" ),
      def = scope.getDef( defToken.value );

    if( def === null ) throw new CSError( "UNDEFINED_DEF", defToken );

    var defContext = context.push(),
      defScope = scope.push(),
      defParser = new Parser( def.body ),
      defOutput;

    defContext.set( "scope", defScope );
    defContext.set( "indentation", "" );
    if( read === true ) {
      defOutput = new Output();
      defContext.set( "mode", "output" );
      defContext.set( "output", defOutput );
    }

    parser.skip( "spaces" );
    parser.eat( "(" );
    parser.skip( "spaces" );

    var part, i = def.arguments.length;
    while( i-- ) {
      defScope.declareVar( def.arguments[i].name );
      defScope.setVar( def.arguments[i].name, def.arguments[i].defaultValue );
    }

    i = 0;
    while( parser.current.type !== ")" ) {
      part = this.parseUntil( parser, context, [ ";", ")", "eol" ], true );
      if( parser.current.type !== ")" ) {
        parser.eat( ";" );
        parser.skip( "spaces" );
      }
      if( i >= def.arguments.length ) {
        throw new CSError( "TOO_MANY_ARGUMENTS", defToken );
      }
      defScope.setVar( def.arguments[i].name, part );
      i++;
    }

    parser.eat( ")" );

    this.parseSection( defParser, defContext );

    if( read === true ) {
      defOutput.flush();
      return defOutput.values.join( " " );
    }
  };

  Compiler.prototype.parseLine = function( parser, context ) {
    var output = context.get( "output" ),
      content;

    while( ! parser.eol() ) {
      content = this.parseUntil( parser, context, [ "eol", "def" ] );
      output.feed( content );

      if( parser.current.type === "def" ) {
        this.parseDefCall( parser, context );
      }
    }
  };

  Compiler.prototype.parseCommand = function( parser, context ) {
    var output = context.get( "output" ),
      lastToken;

    this.parseLine( parser, context );
    lastToken = parser.current;
    parser.skip( "eol" );

    if( this.compareIndentation( parser, context ) > 0 ) {
      var indentation = parser.current.value;
      while( parser.current.type === "spaces" && parser.current.value === indentation ) {
        parser.next();
        if( parser.current.type === "+" ) parser.next();
        else output.feed( " " );
        this.parseLine( parser, context );
        lastToken = parser.current;
        parser.skip( "eol" );
      }
    }

    if( lastToken.type === "eol" ) output.flush();
  };

  Compiler.prototype.parseCommandBlock = function( parser, context ) {
    var commandBlock = context.get( "output" ).currentBlock,
      part;

    commandBlock.applyAttr( context.get( "block_attr" ) );

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

    this.parseCommand( parser, context );

    return commandBlock;
  };

  Compiler.prototype.parseFile = function( fileName, context ) {
    var code = this.files[ fileName ],
      parser = new Parser( code );
    this.parseSection( parser, context );
  };

  Compiler.prototype.prepareScope = function( parser, context ) {
    var scope = context.get( "scope" ),
      comp;
    parser.save();

    while( ! parser.eos() ) {
      comp = this.compareIndentation( parser, context );
      if( comp === 0 && parser.current.type === "spaces" ) parser.next();
      else if( comp < 0 ) break;

      if( parser.current.type === "keyword" && parser.current.value === "def" ) {
        var def = this.parseDefDeclaration( parser, context );
        scope.setDef( def.name, def );
        continue;
      }

      parser.skipUntil( "eol" );
      parser.skip( "eol" );
    }

    parser.restore();
  };

  Compiler.prototype.parseSection = function( parser, context ) {
    var mode = context.get( "mode" ),
      output = context.get( "output" );

    this.prepareScope( parser, context );

    var token, comp;
    while( ! parser.eos() ) {
      // Indentation checking
      comp = this.compareIndentation( parser, context );
      if( comp === 0 && parser.current.type === "spaces" ) parser.next();
      else if( comp < 0 ) break;
      else if( comp > 0 ) {
        throw new CSError( "INCORRECT_INDENTATION", parser.current );
      }

      token = parser.current;

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

      if( token.type === "keyword" && token.value === "def" ) {
        parser.skipUntil( "eol" );
        parser.next();
        while( this.compareIndentation( parser, context ) > 0 ) {
          parser.skipUntil( "eol" );
          parser.next();
        }
        continue;
      }

      if( token.type === "keyword" && token.value === "default" ) {
        this.parseDefault( parser, context );
        continue;
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
        this.parseCommand( parser, context );
      }
      // CommandBlock
      else if( mode === "chain" ) {
        this.parseCommandBlock( parser, context );
      }
      // Simple output
      else if( mode === "output" ) {
        this.parseCommand( parser, context );
      }
    }
  };

  Compiler.prototype.compileChain = function( chain ) {
    var output = [],
      command, commandBlock;

    for( var i = 0, l = chain.commandBlocks.length ; i < l ; i++ ) {
      commandBlock = chain.commandBlocks[i];
      command = "setblock " + commandBlock.position.join( " " ) + " ";
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

    commands.push( "setblock ~ ~-1 ~ command_block 0 1 {auto:1,Command:kill @e[type=MinecartCommandBlock,r=1]}" );

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