'use strict';

var assert = require('assert');
var crypto = require('crypto');
var des = require('des.js');

var keychair = require('../../keychair');
var constants = require('./constants');
var offsets = constants.offsets.blob;
var baseConstants = keychair.constants;
var Header = require('./header');
var Key = require('./key');

function KeyBlob(buffer) {
  this.buffer = buffer;

  this.magic = this.buffer.readUInt32BE(offsets.magic);
  assert.equal(this.magic, constants.magic);
  this.version = this.buffer.readUInt32BE(offsets.version);
  this.startCrypto = this.buffer.readUInt32BE(offsets.startCrypto);
  this.totalLength = this.buffer.readUInt32BE(offsets.totalLength);
  this.iv = this.buffer.slice(offsets.iv,
                              offsets.iv + baseConstants.ivSize);

  this.header = new Header(this.buffer.slice(offsets.header));

  this.type = baseConstants.blobType[this.buffer.readUInt32BE(offsets.type)];
  this.format =
      baseConstants.blobFormat[this.buffer.readUInt32BE(offsets.format)];
  this.wrapAlgorithm =
      baseConstants.algorithm[this.buffer.readUInt32BE(offsets.wrapAlgorithm)];
  this.wrapMode =
      baseConstants.encryptMode[this.buffer.readUInt32BE(offsets.wrapMode)];
  this.signature = this.buffer.slice(offsets.signature,
                                     offsets.signature +
                                         baseConstants.blobSignatureSize);

  this.acl = this.buffer.slice(offsets.signature + constants.blobSignatureSize,
                               this.startCrypto);
  this.crypto = this.buffer.slice(this.startCrypto, this.totalLength);
}
module.exports = KeyBlob;

KeyBlob.parse = function parse(buffer, key) {
  var blob = new KeyBlob(buffer);
  blob.decrypt(key);
  return blob;
};

KeyBlob.prototype.decrypt = function decrypt(key) {
  if (this.type !== 'wrapped')
    return;

  if (this.format !== 'apple_custom')
    return;

  if (this.wrapAlgorithm !== '3des_3key_ede')
    return;

  var decipher = des.CBC.instantiate(des.EDE).create({
    type: 'decrypt',
    key: key,
    iv: constants.appleIV
  });
  var temp3 = decipher.final(this.crypto);

  var temp2 = new Buffer(temp3.length);
  for (var i = 0; i < temp3.length; i++)
    temp2[i] = temp3[temp3.length - i - 1];

  var iv = temp2.slice(0, baseConstants.ivSize);
  var temp1 = temp2.slice(iv.length);

  decipher = des.CBC.instantiate(des.EDE).create({
    type: 'decrypt',
    key: key,
    iv: iv
  });

  var bytes = decipher.final(temp1);
  bytes = new Buffer(bytes);

  this.key = new Key(bytes);
};
