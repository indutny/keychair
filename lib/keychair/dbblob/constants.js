'use strict';

var Buffer = require('buffer').Buffer;

var keychair = require('../../keychair');
var base = keychair.constants;
var constants = exports;

constants.magic = 0xfade0711;

var wordSize = base.atomSize;

var offsets = {};
constants.offsets = offsets;

offsets.blob = {
  magic: wordSize * 0,
  version: wordSize * 1,
  startCrypto: wordSize * 2,
  totalLength: wordSize * 3,
  rndSignature: wordSize * 4,
  sequence: wordSize * 4 + base.signatureSize,
  timeout: wordSize * 5 + base.signatureSize,
  lockOnSleep: wordSize * 6 + base.signatureSize,
  salt: wordSize * 7 + base.signatureSize,
  iv: wordSize * 7 + base.signatureSize + base.saltSize,
  blobSignature: wordSize * 7 +
                 base.signatureSize +
                 base.saltSize +
                 base.ivSize
};

offsets.priv = {
  encryption: 0,
  signature: base.desKeySize
};
