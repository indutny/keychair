'use strict';

var Buffer = require('buffer').Buffer;

var keychair = require('../../keychair');
var base = keychair.constants;
var constants = exports;

constants.magic = 0xfade0711;

var wordSize = base.atomSize;

var offsets = {};
constants.offsets = offsets;

constants.guidSize = 4 + 2 + 2 + 8;

offsets.header = {
  version: wordSize * 0,
  guid: wordSize * 1,
  type: wordSize * 1 + constants.guidSize,
  format: wordSize * 2 + constants.guidSize,
  algorithmId: wordSize * 3 + constants.guidSize,
  keyClass: wordSize * 4 + constants.guidSize,
  bitSize: wordSize * 5 + constants.guidSize,
  keyAttr: wordSize * 6 + constants.guidSize,
  keyUsage: wordSize * 7 + constants.guidSize,
  startDate: wordSize * 8 + constants.guidSize,
  endDate: wordSize * 8 + constants.guidSize + base.dateSize,
  wrapAlogrithmId: wordSize * 8 + constants.guidSize + 2 * base.dateSize,
  wrapMode: wordSize * 9 + constants.guidSize + 2 * base.dateSize,
  reserved: wordSize * 10 + constants.guidSize + 2 * base.dateSize
};
constants.headerSize = offsets.header.reserved + wordSize;

offsets.blob = {
  magic: wordSize * 0,
  version: wordSize * 1,
  startCrypto: wordSize * 2,
  totalLength: wordSize * 3,
  iv: wordSize * 4,
  header: wordSize * 4 + base.ivSize,
  type: wordSize * 4 + base.ivSize + constants.headerSize,
  format: wordSize * 5 + base.ivSize + constants.headerSize,
  wrapAlgorithm: wordSize * 6 + base.ivSize + constants.headerSize,
  wrapMode: wordSize * 7 + base.ivSize + constants.headerSize,
  signature: wordSize * 8 + base.ivSize + constants.headerSize
};

offsets.keyBytes = {
  descriptionSize: wordSize * 0,
  description: wordSize * 1
};

constants.appleIV = new Buffer('4adda22c79e82105', 'hex');

constants.blobSignatureSize = 20;
