'use strict';

var assert = require('assert');
var crypto = require('crypto');
var des = require('des.js');
var Buffer = require('buffer').Buffer;

var keychair = require('../../keychair');
var constants = require('./constants');
var offsets = constants.offsets;
var baseConstants = keychair.constants;

function DbBlob(buffer) {
  this.buffer = buffer;

  this.magic = this.buffer.readUInt32BE(offsets.blob.magic);
  assert.equal(this.magic, constants.magic);
  this.version = this.buffer.readUInt32BE(offsets.blob.version);
  this.startCrypto = this.buffer.readUInt32BE(offsets.blob.startCrypto);
  this.totalLength = this.buffer.readUInt32BE(offsets.blob.totalLength);
  this.rndSignature = this.buffer.slice(
      offsets.blob.rndSignature,
      offsets.blob.rndSignature + baseConstants.signatureSize);
  this.sequence = this.buffer.readUInt32BE(offsets.blob.sequence);
  this.timeout = this.buffer.readUInt32BE(offsets.blob.timeout);
  this.lockOnSleep = this.buffer.readUInt8(offsets.blob.lockOnSleep);
  this.salt = this.buffer.slice(offsets.blob.salt,
                                offsets.blob.salt + baseConstants.saltSize);
  this.iv = this.buffer.slice(offsets.blob.iv,
                              offsets.blob.iv + baseConstants.ivSize);
  this.blobSignature = this.buffer.slice(
      offsets.blob.blobSignature,
      offsets.blob.blobSignature + baseConstants.blobSignatureSize);

  this.acl = this.buffer.slice(
      offsets.blob.blobSignature + baseConstants.blobSignatureSize,
      this.startCrypto);
  this.crypto = this.buffer.slice(this.startCrypto, this.totalLength);

  this.master = null;
  this.masterIV = null;
}
module.exports = DbBlob;

DbBlob.parse = function parse(buffer, passphrase) {
  var blob = new DbBlob(buffer);
  blob.decrypt(passphrase);
  return blob;
};

// http://www.opensource.apple.com/source/securityd/securityd-55137.1/doc/BLOBFORMAT
DbBlob.prototype.decrypt = function decrypt(passphrase) {
  var block = crypto.pbkdf2Sync(
      passphrase,
      this.salt,
      baseConstants.pbkdf2Iterations,
      baseConstants.desKeySize + baseConstants.ivSize,
      'sha1');

  var key = block.slice(0, baseConstants.desKeySize);
  var iv = block.slice(key.length);

  this.master = key;
  this.masterIV = iv;

  var decipher = des.CBC.instantiate(des.EDE).create({
    type: 'decrypt',
    key: this.master,
    iv: this.iv
  });
  var priv = new Buffer(decipher.final(this.crypto));

  this.encryptionKey = priv.slice(
      offsets.priv.encryption,
      offsets.priv.encryption + baseConstants.desKeySize);
};
