'use strict';

var assert = require('assert');

var keychair = require('../keychair');
var constants = keychair.constants;
var offsets = constants.offsets.record;

function Record(section) {
  this.size = section.readUInt32BE(offsets.size);
  this.section = section.slice(0, this.size);

  // XXX content
  this.content = null;
  this.attributes = null;
}
module.exports = Record;

Record.prototype.parseAttributes = function parseAttributes(schema) {
  this.attributes = schema.parse(this.section, offsets.attributeOffsets);
  console.log(this.attributes);
};
