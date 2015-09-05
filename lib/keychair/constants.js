'use strict';

var constants = exports;

var atomSize = 4;
constants.atomSize = 4;

constants.atomAlign = function atomAlign(offset) {
  return (offset + atomSize - 1) & ~atomSize;
};

// 'kych'
constants.magic = 0x6b796368;
constants.version = 0x00010000;

var offsets = {};
constants.offsets = offsets;

offsets.header = {
  magic: atomSize * 0,
  version: atomSize * 1,
  authOffset: atomSize * 2,
  schemaOffset: atomSize * 3
};

offsets.schema = {
  size: atomSize * 0,
  tableCount: atomSize * 1,
  tables: atomSize * 2
},

offsets.table = {
  size: atomSize * 0,
  id: atomSize * 1,
  recordCount: atomSize * 2,
  records: atomSize * 3,
  indexesOffset: atomSize * 4,
  freeListHead: atomSize * 5,
  recordNumberCount: atomSize * 6,
  recordNumbers: atomSize * 7
};

offsets.record = {
  size: atomSize * 0,
  number: atomSize * 1,
  createVersion: atomSize * 2,
  recordVersion: atomSize * 3,
  dataSize: atomSize * 4,
  semanticInfo: atomSize * 5,
  attributeOffsets: atomSize * 6
};

constants.recordType = {
  0: 'info',
  1: 'indexes',
  2: 'attributes',
  3: 'parsingModule',

  0x0a: 'any',
  0x0b: 'cert',
  0x0c: 'crl',
  0x0d: 'policy',
  0x0e: 'generic',
  0x0f: 'publicKey',
  0x10: 'privateKey',
  0x11: 'symmetricKey',
  0x12: 'allKeys',

  0x80000000: 'genericPassword',
  0x80000001: 'internetPassword',
  0x80000002: 'applesharePassword',
  0x80001000: 'x509',
  0x80001001: 'userTrust',
  0x80001002: 'x509CRL',
  0x80001003: 'unlockReferral',
  0x80001004: 'extendedAttribute',
  0x80008000: 'metadata'
};

constants.schema = {
  info: [
    { type: 'U32', name: 'RelationID' },
    { type: 'STRING', name: 'RelationName' }
  ],

  attributes: [
    { type: 'U32', name: 'RelationID' },
    { type: 'U32', name: 'AttributeID' },
    { type: 'U32', name: 'AttributeNameFormat' },
    { type: 'STRING', name: 'AttributeName' },
    { type: 'BLOB', name: 'AttributeNameID' },
    { type: 'U32', name: 'AttributeFormat' }
  ],

  indexes: [
    { type: 'U32', name: 'RelationID' },
    { type: 'U32', name: 'IndexID' },
    { type: 'U32', name: 'AttributeID' },
    { type: 'U32', name: 'IndexType' },
    { type: 'U32', name: 'IndexedDataLocation' }
  ],

  parsingModule: [
    { type: 'U32', name: 'RelationID' },
    { type: 'U32', name: 'AttributeID' },
    { type: 'BLOB', name: 'ModuleID' },
    { type: 'STRING', name: 'AddinVersion' },
    { type: 'U32', name: 'SSID' },
    { type: 'U32', name: 'SubserviceType' }
  ]
};
