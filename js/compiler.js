define( [
  "compiler/parser",
  "compiler/scope",
  "compiler/num",
  "compiler/commandset",
  "compiler/chain",
  "commandtools"
], function(
  Parser,
  Scope,
  Num,
  CommandSet,
  Chain,
  CT
) {

  function compareStrLength( a, b ) {
    return a.length - b.length;
  }

  function Compiler() {
    this.files = {};
  }

  Compiler.prototype.setFiles = function( files ) {
    this.files = files;
  };

  Compiler.prototype.compile = function( fileName, options ) {
    this.options = options;

    var code = this.files[ fileName ],
      scope = new Scope();

    var parser = new Parser( code );
      // scope.addInclude( fileName );
      // this.prepareScope( code, scope );
      // scope.resetIncludes();
      // scope.addInclude( fileName );

    console.log( parser );

    var commands = [];
    // var state = { mainChain: new Chain( "main" ) };
    this.parseSection( parser, scope, commands );

    var compiledCommand = this.compileCommands( commands );
      // var blockPiles = this.generateBlocks( output );

      // console.log( "blockPiles", blockPiles );
      // if( blockPiles.every( function( pile ){ return pile.blocks.length === 0; } ) ) {
      //   throw "Compilation resulted in no command blocks.";
      // }

      // var command = CT.summonPiles( blockPiles );
      // if( command.length > 32500 ) {
      //   throw "Summon command is too long! (" + command.length + " characters)";
      // }

    return compiledCommand;
  };

  Compiler.prototype.parseCommand = function( parser, scope ) {
    var command = "";
    while( ! parser.eol() ) {
      command += parser.current().value;
      parser.next();
    }
    parser.next();
    return command;
  };

  Compiler.prototype.parseNumber = function( parser ) {
    var number = new Num(),
      buffer = "";
    if( parser.current().type === "~" ) {
      number.relative = true;
      parser.next();
      if( parser.current().type !== "-" && parser.current().type !== "number" ) return number;
    }
    if( parser.current().type === "-" ) {
      buffer += "-";
      parser.next();
    }
    buffer += parser.eat( "number" ).value;
    number.value = +buffer;
    return number;
  };

  Compiler.prototype.parseCoordinates = function( parser, scope ) {
    var coordinates = {};
    coordinates.x = this.parseNumber( parser );
    parser.eat( "spaces" );
    coordinates.y = this.parseNumber( parser );
    parser.eat( "spaces" );
    coordinates.z = this.parseNumber( parser );
    return coordinates;
  };

  Compiler.prototype.parseChain = function( parser, scope ) {
    parser.eat( "keyword", "chain" );
    parser.eat( "spaces" );
    var coordinates = this.parseCoordinates( parser, scope );
    parser.skip( "spaces" );
    parser.eat( ":" );
    parser.eat( "eol" );
    var chain = new Chain( coordinates );
    this.parseSection( parser, scope, chain );
    return chain;
  };

  Compiler.prototype.parseSection = function( parser, scope, output, parentIndentation ) {
    var token = parser.current(),
      currentIndentation = "";

    if( token.type === "spaces" ) currentIndentation = token.value;

    while( ! parser.eos() ) {
      token = parser.current();

      if( currentIndentation !== "" ) {
        if( token.type !== "spaces" ) {
          break;
        }
        var comp = compareStrLength( token.value, currentIndentation );
        if( comp < 0 ) break;
        else if( comp > 0 ) {
          throw "Incorrect indentation";
        }
        parser.next();
      }

      if( token.type === "keyword" && token.value === "chain" ) {
        var chain = this.parseChain( parser, scope );
        output.push( chain );
      }
      else {
        var command = this.parseCommand( parser, scope );
        output.push( command );
      }
    }

    console.log( output );
  };

  Compiler.prototype.compileChain = function( chain ) {
    var output = [],
      command, commandBlock, dataTag;

    for( var i = 0, l = chain.commandBlocks.length ; i < l ; i++ ) {
      commandBlock = chain.commandBlocks[i];
      command = "setblock " + commandBlock.x + " " + commandBlock.y + " " + commandBlock.z + " ";
      command += commandBlock.type + " " + commandBlock.dataValue + " replace ";
      dataTag = { Command: commandBlock.command };
      command += CT.serialize( dataTag );
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