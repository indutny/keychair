'use strict';

var assert = require('assert');

var keychair = require('../keychair');
var constants = keychair.constants;
var offsets = constants.offsets.table;
var Record = keychair.Record;

function Table(section) {
  var size = section.readUInt32BE(offsets.size);
  this.section = section.slice(0, size);

  var type = this.section.readUInt32BE(offsets.id);
  this.type = constants.recordType[type] || type;
  this.recordCount = this.section.readUInt32BE(offsets.recordCount);
  this.freeListHead = this.section.readUInt32BE(offsets.freeListHead);
  this.recordNumberCount = this.section.readUInt32BE(
      offsets.recordNumberCount);

  this.recordSection =
      this.section.slice(this.section.readUInt32BE(offsets.records));
  this.records = new Array(this.recordCount);

  this.attributeInfo = null;
}
module.exports = Table;

Table.prototype.setAttributeInfo = function setAttributeInfo(info) {
  this.attributeInfo = info;

  for (var i = 0, offset = 0; i < this.records.length; i++) {
    var section = this.recordSection.slice(offset);
    var record = new Record(section);
    record.parseAttributes(this.attributeInfo);
    this.records[i] = record;
    offset += record.size;
  }
};
