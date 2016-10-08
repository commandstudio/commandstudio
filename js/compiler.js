define( [
  "compiler/scope",
  "compiler/parser",
  "commandtools"
], function(
  Scope,
  Parser,
  CT
) {

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

    this.commands = [];
    // var state = { mainChain: new Chain( "main" ) };
    this.parseFile( parser, scope );

    var compiledCommand = this.compileCommands( this.commands );
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
      command += parser.getCurrentToken().value;
      parser.next();
    }
    parser.next();
    return command;
  };

  Compiler.prototype.parseFile = function( parser, scope ) {
    var token;
    while( ! parser.eos() ) {

      token = parser.getCurrentToken();
      if( token.type === "keyword" && token.value === "chain" ) {
        console.log( "amdoula" );
        parser.next();
      }
      else {
        var command = this.parseCommand( parser, scope );
        this.commands.push( command );
      }
    }

    this.commandSet.flush();

    console.log( this.commandSet );
  };

  Compiler.prototype.compileCommands = function( commands ) {
    var minecarts = [],
      i, l;

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