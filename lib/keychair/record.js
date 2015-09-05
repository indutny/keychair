'use strict';

var assert = require('assert');

var keychair = require('../keychair');
var constants = keychair.constants;
var offsets = constants.offsets.record;

function Record(section) {
  this.size = section.readUInt32BE(offsets.size);
  this.section = section.slice(0, this.size);

  this.number = this.section.readUInt32BE(offsets.number);
  this.createVersion = this.section.readUInt32BE(offsets.createVersion);
  this.recordVersion = this.section.readUInt32BE(offsets.recordVersion);
  this.dataSize = this.section.readUInt32BE(offsets.dataSize);
  this.semanticInfo = this.section.readUInt32BE(offsets.semanticInfo);

  // XXX content
  this.content = null;
  this.attributes = null;
}
module.exports = Record;

Record.prototype.parseAttributes = function parseAttributes(schema) {
  this.attributes = schema.parse(this.section, offsets.attributeOffsets);
};
