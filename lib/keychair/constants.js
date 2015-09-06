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

constants.recordTypeRange = {
  schemaStart: 0,
  schemaEnd: 4,
  openGroupStart: 0xa,
  openGroupEnd: 0xa + 8,
  appDefinedStart: 0x80000000,
  appDefinedEnd: 0xffffffff
};

constants.schema = {
  info: [
    { type: 'U32', name: 'RelationID' },
    { type: 'STRING', name: 'RelationName' }
  ],

  attributes: [
    { type: 'U32', name: 'RelationID', singular: true },
    { type: 'U32', name: 'AttributeID', singular: true },
    { type: 'U32', name: 'AttributeNameFormat', singular: true },
    { type: 'STRING', name: 'AttributeName', singular: true },
    { type: 'BLOB', name: 'AttributeNameID', singular: true },
    { type: 'U32', name: 'AttributeFormat', singular: true }
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

constants.attrNameFormat = {
  0: 'STRING',
  1: 'OID',
  2: 'INTEGER'
};

constants.attrFormat = {
  0: 'STRING',
  1: 'S32',
  2: 'U32',
  3: 'BIG_NUM',
  4: 'REAL',
  5: 'TIME_DATE',
  6: 'BLOB',
  7: 'MULTI_U32',
  8: 'COMPLEX'
};

constants.timeDateSize = 16;
constants.dateSize = 8;

constants.blobType = {
  0: 'raw',
  2: 'reference',
  3: 'wrapped',
  0xffffffff: 'other'
};

constants.blobFormat = {
  0: 'none',
  1: 'pkcs1',
  2: 'pkcs3',
  3: 'mscapi',
  4: 'pgp',
  5: 'fips186',
  6: 'bsafe',
  9: 'cca',
  10: 'pkcs8',
  11: 'spki',
  12: 'octet',
  100: 'apple_custom',
  101: 'openssl',
  102: 'openssh1',
  0xffffffff: 'other'
};

constants.algorithm = {
  0: 'none',
  1: 'custom',
  2: 'dh',
  3: 'ph',
  4: 'kea',
  5: 'md2',
  6: 'md4',
  7: 'md5',
  8: 'sha1',
  9: 'nhash',
  10: 'haval',
  11: 'ripemd',
  12: 'ibchash',
  13: 'ripemac',
  14: 'des',
  15: 'desx',
  16: 'rdes',
  17: '3des_3key_ede',
  18: '3des_2key_ede',
  19: '3des_1key_eee',
  20: '3des_3key_eee',
  21: '3des_2key_eee',
  20: '3des_1key',
  22: 'idea',
  23: 'rc2',
  24: 'rc5',
  25: 'rc4',
  26: 'seal',
  27: 'cast',
  28: 'blowfish',
  29: 'skipjack',
  30: 'lucifer',
  31: 'madryga',
  32: 'feal',
  33: 'redoc',
  34: 'redoc3',
  35: 'loki',
  36: 'khufu',
  37: 'khafre',
  38: 'mmb',
  39: 'gost',
  40: 'safer',
  41: 'crab',
  42: 'rsa',
  43: 'dsa',
  44: 'md5withrsa',
  45: 'md2withrsa',
  46: 'elgamal',
  47: 'md2random',
  48: 'md5random',
  49: 'sharandom',
  50: 'desrandom',
  51: 'sha1withrsa',
  52: 'cdmf',
  53: 'cast3',
  54: 'cast5',
  55: 'genericsecret',
  56: 'concatbaseandkey',
  57: 'concatkeyandbase',
  58: 'concatbaseanddata',
  59: 'concatdataandbase',
  60: 'xorbaseanddata',
  61: 'extractfromkey',
  62: 'ssl3premastergen',
  63: 'ssl3masterderive',
  64: 'ssl3keyandmacderive',
  65: 'ssl3md5_mac',
  66: 'ssl3sha1_mac',
  67: 'pkcs5_pbkdf1_md5',
  68: 'pkcs5_pbkdf1_md2',
  69: 'pkcs5_pbkdf1_sha1',
  70: 'wraplynks',
  71: 'wrapset_oaep',
  72: 'baton',
  73: 'ecdsa',
  74: 'mayfly',
  75: 'juniper',
  76: 'fasthash',
  77: '3des',
  78: 'ssl3md5',
  79: 'ssl3sha1',
  80: 'fortezzatimestamp',
  81: 'sha1withdsa',
  82: 'sha1withecdsa',
  83: 'dsa_bsafe',
  84: 'ecdh',
  85: 'ecmqv',
  86: 'pkcs12_sha1_pbe',
  87: 'ecnra',
  88: 'sha1withecnra',
  89: 'eces',
  90: 'ecaes',
  91: 'sha1hmac',
  92: 'fips186random',
  93: 'ecc',
  94: 'mqv',
  95: 'nra',
  96: 'intelplatformrandom',
  97: 'utc',
  98: 'haval3',
  99: 'haval4',
  100: 'haval5',
  101: 'tiger',
  102: 'md5hmac',
  103: 'pkcs5_pbkdf2',
  104: 'running_counter',
  0x7fffffff: 'last',
  0x80000000: 'vendor'
};

constants.keyClass = {
  0: 'public',
  1: 'private',
  2: 'session',
  3: 'secret',
  0xffffffff: 'other'
};

constants.keyFlags = {
  permanent: 0x00000001,
  priv: 0x00000002,
  modifiable: 0x00000004,
  sensitive: 0x00000008,
  alwaysSensitive: 0x00000010,
  extractable: 0x00000020,
  neverExtractable: 0x00000040
};

constants.keyUse = {
  any: 0x80000000,
  encrypt: 0x00000001,
  decrypt: 0x00000002,
  sign: 0x00000004,
  verify: 0x00000008,
  signRecover: 0x00000010,
  verifyRecover: 0x00000020,
  wrap: 0x00000040,
  unwrap: 0x00000080,
  derive: 0x00000100
};

constants.encryptMode = {
  0: 'none',
  1: 'custom',
  2: 'ecb',
  3: 'ecb_pad',
  4: 'cbc',
  5: 'cbc_iv8',
  6: 'cbc_pad_iv8',
  7: 'cfb',
  8: 'cfb_iv8',
  9: 'cfb_pad_iv8',
  10: 'ofb',
  11: 'ofb_iv8',
  12: 'ofb_pad_iv8',
  13: 'counter',
  14: 'bc',
  15: 'pcbc',
  16: 'cbcc',
  17: 'ofbnlf',
  18: 'pbc',
  19: 'pfb',
  20: 'cbcpd',
  21: 'public_key',
  22: 'private_key',
  23: 'shuffle',
  24: 'ecb64',
  25: 'cbc64',
  26: 'ofb64',
  28: 'cfb32',
  29: 'cfb16',
  30: 'cfb8',
  31: 'wrap',
  32: 'private_wrap',
  33: 'relayx',
  34: 'ecb128',
  35: 'ecb96',
  36: 'cbc128',
  37: 'oaep_hash',
  38: 'pkcs1_eme_v15',
  39: 'pkcs1_eme_oaep',
  40: 'pkcs1_emsa_v15',
  41: 'iso_9796',
  42: 'x9_31',
  0x7fffffff: 'last',
  0x80000000: 'vendor'
};

constants.signatureSize = 16;
constants.blobSignatureSize = 20;
constants.saltSize = 20;
constants.ivSize = 8;
constants.desKeySize = 24;
constants.pbkdf2Iterations = 1000;
