define( [ "utils/scanner" ], function( Scanner ) {
  var CT = {};

  CT.serialize = function( data ) {
    var serialized = "",
      elements = [];
    if( typeof data === "object" ) {
      if( typeof data.length === "undefined" ) {
        var value;
        for( var attr in data ) {
          value = CT.serialize( data[attr] );
          elements.push( attr + ":" + value );
        }
        serialized = "{" + elements.join( "," ) + "}";
      } else {
        data.forEach( function( value ) {
          elements.push( CT.serialize( value ) );
        } );
        serialized = "[" + elements.join( "," ) + "]";
      }
    } else if( typeof data === "string" ) {
      serialized = data;
      var scanner = new Scanner( data ),
        balance = [],
        specialChars = /[\[\]\{\}\"\\]/;

      while( !scanner.eos() ) {
        scanner.scanUntil( specialChars );
        var specialChar = scanner.scan( specialChars );

        if( specialChar === "" ) continue;

        else if( specialChar === "\\" ) scanner.scan( /[.\n]/ );
        else if( specialChar.match( /[\[\{]/ ) ) {
          balance.unshift( specialChar );
        }
        else if( specialChar === "]" && balance[0] === "[" || specialChar === "}" && balance[0] === "{" ) {
          balance.shift();
        } else if( specialChar === "\"" ) {
          if( balance[0] === "\"" ) balance.shift();
          else balance.unshift( specialChar );
        } else {
          balance.unshift( "lol" );
          break;
        }
      }
      if( typeof balance[0] !== "undefined" ) {
        serialized = "\"" + serialized.replace( /(["\\])/g, "\\$1" ) + "\"";
      }

    } else {
      serialized = data;
    }
    return serialized;
  };

  CT.summonPiles = function( blockPiles, options ) {
    var mainPile, eraseBlocks = 0;

    blockPiles.forEach( function( blockPile ) {
      var pileLength = blockPile.blocks.length;
      if( blockPile.position === null ) {
        mainPile = blockPile;
      } else {
        if( pileLength > 0 ) {
          var blockPilePosition = blockPile.position,
            isHeightRelative =  blockPilePosition.match( /(?:~?-?\d+|~)\s+(?:~-?\d+|~)\s+(?:~?-?\d+|~)/ );

          if( isHeightRelative ) blockPilePosition = CT.addCoordinates( blockPilePosition, "0 " + ( -1 - mainPile.blocks.length ) + " 0" );

          var fillEnd = CT.addCoordinates( blockPilePosition, "0 " + ( pileLength + 2 ) + " 0" );

          mainPile.blocks.push( { Block: "command_block", TileEntityData: { Command: "fill " + blockPilePosition + " " + fillEnd + " air", auto: "1b" } } );
          var firstBlock = blockPile.blocks[0],
            firstBlockType = firstBlock.Block,
            firstBlockData = firstBlock.TileEntityData;

          if( isHeightRelative ) blockPilePosition = CT.addCoordinates( blockPilePosition, "0 -1 0" );
          mainPile.blocks.push( { Block: "command_block", TileEntityData: { Command: "setblock " + blockPilePosition + " " + firstBlockType + " 1 keep " + CT.serialize( firstBlockData ), auto: "1b" } } );
          eraseBlocks += 2;
        }
        if( pileLength > 1 ) {
          var summonPosition = CT.addCoordinates( blockPilePosition, "0 2 0" );
          if( isHeightRelative ) summonPosition = CT.addCoordinates( summonPosition, "0 -1 0" );

          var summonPile = { position: summonPosition, blocks: blockPile.blocks.splice( 1 ) };
          mainPile.blocks.push( { Block: "command_block", TileEntityData: { Command: CT.summonPile( summonPile, options ), auto: "1b" } } );
          eraseBlocks += 1;
        }
      }
    } );

    if( eraseBlocks > 0 ) {
      var fillEnd = "~ ~-" + eraseBlocks + " ~";
      mainPile.blocks.push( { Block: "command_block", TileEntityData: { Command: "fill ~ ~ ~ " + fillEnd + " air", auto: "1b" } } );
    }

    return CT.summonPile( mainPile, options );
  };

  CT.summonPile = function( blockPile, options ) {
    var pilePosition = blockPile.position,
      rootEntity,
      lastEntity;

    var entityNames;

    if( options.useOldEntityNames === true ) {
      entityNames = {
        "falling_block": "FallingSand"
      };
    }
    else {
      entityNames = {
        "falling_block": "falling_block"
      };
    }

    if( pilePosition === null ) {
      pilePosition = "~ ~2 ~";
    }

    blockPile.blocks.forEach( function( block, i ) {
      block.Time = 1;
      if( i > 0 ) {
        block.id = entityNames.falling_block;
        lastEntity.Passengers = [ block ];
      }
      else {
        rootEntity = block;
      }
      lastEntity = block;
    } );

    var command = "summon " + entityNames.falling_block + " " + pilePosition + " " + CT.serialize( rootEntity );

    return command;
  };

  CT.addCoordinates = function( c1, c2 ) {
    var match1 = c1.match( /(~?-?\d+|~)\s+(~?-?\d+|~)\s+(~?-?\d+|~)/ ),
      match2 = c2.match( /(~?-?\d+|~)\s+(~?-?\d+|~)\s+(~?-?\d+|~)/ ),
      finalCoords = [],
      i = 3,
      s1, i1, i2;

    while( i-- ) {
      s1 = match1[i + 1];
      i1 = +s1.replace( /~/, "" );
      i2 = +match2[i + 1].replace( /~/, "" );
      finalCoords[ i ] = i1 + i2;
      if( s1.match( /~/ ) ) finalCoords[i] = "~" + finalCoords[i];
    }

    return finalCoords.join( " " );
  };

  return CT;
} );