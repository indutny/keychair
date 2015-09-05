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

  this.initAttributes(tables);

  return tables;
};

Parser.prototype.initAttributes = function initAttributes(tables) {
  var attrsTable = tables.attributes;

  var schemas = {};
  for (var i = 0; i < attrsTable.records.length; i++) {
    var record = attrsTable.records[i];
    var attrs = record.attributes;

    var relationId = attrs.RelationID[0];

    // Skip schema relations
    if (constants.recordTypeRange.schemaStart <= relationId &&
        relationId < constants.recordTypeRange.schemaEnd) {
      continue;
    }

    // Table for relation init
    var key = constants.recordType[relationId] || relationId;
    if (!schemas[key])
      schemas[key] = [];
    var schema = schemas[key];

    var attrId = attrs.AttributeID[0];
    var attrNameFormat = constants.attrNameFormat[attrs.AttributeNameFormat[0]];
    var attrFormat = constants.attrFormat[attrs.AttributeFormat[0]];

    var attrName = attrs.AttributeName[0];
    var attrOID = attrs.AttributeNameID[0];

    schema.push({
      type: attrFormat,
      id: attrId,
      name: attrName,
      oid: attrOID
    });
  }

  var keys = Object.keys(schemas);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var schema = schemas[key];

    tables[key].setAttributeInfo(new Schema(schema));
  }

  return tables;
};
