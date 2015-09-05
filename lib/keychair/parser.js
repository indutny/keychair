'use strict';

var assert = require('assert');

var keychair = require('../keychair');
var constants = keychair.constants;
var offsets = constants.offsets;
var Table = keychair.Table;
var Schema = keychair.Schema;

function Parser(buffer) {
  this.buffer = buffer;
}
module.exports = Parser;

Parser.parse = function parse(buffer) {
  return new Parser(buffer).parse();
};

Parser.prototype.parse = function parse() {
  var magic = this.buffer.readUInt32BE(offsets.header.magic);
  assert.equal(magic, constants.magic);

  var version = this.buffer.readUInt32BE(offsets.header.version);
  assert.equal(version, constants.version);

  var schemaOffset = this.buffer.readUInt32BE(offsets.header.schemaOffset);
  var schema = this.parseSchema(this.buffer.slice(schemaOffset));

  return {
    magic: magic,
    version: version,
    schema: schema
  };
};

Parser.prototype.parseSchema = function parseSchema(buffer) {
  var size = buffer.readUInt32BE(offsets.schema.size);
  assert(size <= buffer.length);
  var section = buffer.slice(0, size);

  var tableCount = section.readUInt32BE(offsets.schema.tableCount);
  var tables = {};
  for (var i = 0; i < tableCount; i++) {
    var offset = section.readUInt32BE(offsets.schema.tables +
                                      i * constants.atomSize);
    var table = new Table(section.slice(offset));

    tables[table.type] = table;
  }

  tables.info.setAttributeInfo(new Schema(constants.schema.info));
  tables.indexes.setAttributeInfo(new Schema(constants.schema.indexes));
  tables.parsingModule.setAttributeInfo(
      new Schema(constants.schema.parsingModule));

  tables.attributes.setAttributeInfo(new Schema(constants.schema.attributes));

  tables.attributes.parse();

  return tables;
};
