'use strict';

var assert = require('assert');

var constants = require('./constants');
var keychair = require('../../keychair');
var constants = require('./constants');
var offsets = constants.offsets.header;
var baseConstants = keychair.constants;

function Header(buffer) {
  this.buffer = buffer;
  this.size = constants.headerSize;

  this.version = this.buffer.readUInt32BE(offsets.version);
  this.guid = this.buffer.slice(offsets.guid, constants.guidSize);
  this.type = baseConstants.blobType[this.buffer.readUInt32BE(offsets.type)];
  this.format = baseConstants.blobFormat[this.buffer.readUInt32BE(offsets.format)];
  this.algorithm =
      baseConstants.algorithm[this.buffer.readUInt32BE(offsets.algorithmId)];
  this.keyClass =
      baseConstants.keyClass[this.buffer.readUInt32BE(offsets.keyClass)];
  this.bitSize = this.buffer.readUInt32BE(offsets.bitSize);
  this.keyAttr = this.buffer.readUInt32BE(offsets.keyAttr);
  this.startDate = this.buffer.slice(
      offsets.startDate,
      offsets.startDate + baseConstants.dateSize);
  this.endDate = this.buffer.slice(
      offsets.endDate,
      offsets.endDate + baseConstants.dateSize);
  this.wrapAlgorithm = baseConstants.algorithm[
      this.buffer.readUInt32BE(offsets.wrapAlgorithmId)];
  this.wrapMode = baseConstants.encryptMode[
      this.buffer.readUInt32BE(offsets.wrapMode)];
  this.reserved = this.buffer.readUInt32BE(offsets.reserved);
}
module.exports = Header;
