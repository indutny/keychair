'use strict';

var asn1 = require('asn1.js');
var assert = require('assert');

var keychair = require('../../keychair');
var constants = require('./constants');
var offsets = constants.offsets.keyBytes;
var baseConstants = keychair.constants;

var DSABsafeParams = asn1.define('DSABsafeParams', function() {
  this.seq().obj(
    this.key('keySizeInBits').int(),
    this.key('p').int(),
    this.key('q').int(),
    this.key('g').int()
  );
});

var DSAAlgorithmId = asn1.define('DSAAlgorithmId', function() {
  this.seq().obj(
    this.key('algorithm').objid({
      '1 2 840 113549 1 1 1': 'rsaEncryption'
    }),
    this.key('params').optional().use(DSABsafeParams)
  );
});

var DSAPrivateKey = asn1.define('DSAPrivateKey', function() {
  this.seq().obj(
    this.key('version').int(),
    this.key('dsaAlg').use(DSAAlgorithmId),
    this.key('privateKey').octstr()
  );
});

function Key(buffer) {
  this.buffer = buffer;

  this.descriptionSize = this.buffer.readUInt32BE(offsets.descriptionSize);
  this.description = this.buffer.slice(
      offsets.description,
      offsets.description + this.descriptionSize);
  this.raw = this.buffer.slice(offsets.description + this.descriptionSize);

  try {
    this.dsa = DSAPrivateKey.decode(this.raw, 'der');
  } catch (e) {
    this.dsa = null;
  }
}
module.exports = Key;
