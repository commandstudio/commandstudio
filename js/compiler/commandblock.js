define( [
  "utils/commandtools"
], function(
  CT
) {
  var directionValues = {
    "-x": 4,
    "+x": 5,
    "-y": 0,
    "+y": 1,
    "-z": 2,
    "+z": 3
  };

  function CommandBlock() {
    this.type = "chain_command_block";
    this.command = "";
    this.conditional = false;
    this.auto = true;
  }

  CommandBlock.prototype.applyAttr = function( attr ) {
    if( attr.match( /i/ ) ) this.type = "command_block";
    if( attr.match( /c/ ) ) this.type = "chain_command_block";
    if( attr.match( /r/ ) ) this.type = "repeating_command_block";
    if( attr.match( /0/ ) ) this.auto = false;
    if( attr.match( /1/ ) ) this.auto = true;
    if( attr.match( /\?/ ) ) this.conditional = true;
    if( attr.match( /!/ ) ) this.conditional = false;
  };

  CommandBlock.prototype.getPosition = function() {
    return this.position.join( " " );
  };

  CommandBlock.prototype.getDataValue = function() {
    var dataValue = directionValues[ this.direction ];
    if( this.conditional === true ) dataValue += 8;
    return dataValue;
  };

  CommandBlock.prototype.getDataTag = function() {
    var dataTag = {};
    dataTag.Command = this.command;
    if( this.auto === true ) dataTag.auto = 1;
    dataTag.TrackOutput = "0b";

    return CT.serialize( dataTag );
  };

  return CommandBlock;

} );