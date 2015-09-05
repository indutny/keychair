'use strict';

var util = require('util');
var assert = require('assert');

var keychair = require('../keychair');
var constants = keychair.constants;

function Attr() {
  this.name = null;
}

Attr.prototype.put = function put(out, value) {
  out[this.name].push(value);
};

function U32Attr() {
  Attr.call(this);
}
util.inherits(U32Attr, Attr);

U32Attr.prototype.parse = function parse(buffer, offset, out) {
  this.put(out, buffer.readUInt32BE(offset));
  return 4;
};

function BlobAttr() {
  Attr.call(this);
}
util.inherits(BlobAttr, Attr);

BlobAttr.prototype.parse = function parse(buffer, offset, out) {
  var size = buffer.readUInt32BE(offset);
  var data = buffer.slice(offset + constants.atomSize,
                          offset + constants.atomSize + size);

  this.put(out, data);

  return constants.atomAlign(constants.atomSize + size);
};

function StringAttr() {
  BlobAttr.call(this);
}
util.inherits(StringAttr, BlobAttr);

StringAttr.prototype.parse = function parse(buffer, offset, out) {
  var res = BlobAttr.prototype.parse.call(this, buffer, offset, out);
  var list = out[this.name];
  list[list.length - 1] += '';
  return res;
};

function Schema(attrs) {
  this.attrs = new Array(attrs.length);
  this.numbers = new Array(this.attrs.length);
  this.offsets = new Array(this.attrs.length);

  for (var i = 0; i < attrs.length; i++) {
    var current = attrs[i];

    var attr;
    if (current.type === 'U32')
      attr = new U32Attr();
    else if (current.type === 'STRING')
      attr = new StringAttr();
    else if (current.type === 'BLOB')
      attr = new BlobAttr();
    else
      throw new Error('Unknown attribute type: ' + current.type);

    attr.name = current.name;
    this.attrs[i] = attr;
  }
}
module.exports = Schema;

Schema.prototype.parse = function parse(buffer, start) {
  var out = {};

  var numbers = this.numbers;
  var offsets = this.offsets;

  // Get numbers and offsets of attributes
  for (var i = 0, off = start; i < this.attrs.length; i++, off += 4) {
    var number = buffer.readUInt32BE(off);
    if (number === 0) {
      numbers[i] = 0;
      offsets[i] = 0;
    } else if ((number & 1) !== 0) {
      numbers[i] = 1;
      offsets[i] = number ^ 1;
    } else {
      offsets[i] = number + constants.atomSize;
      numbers[i] = buffer.readUInt32BE(number);
    }
  }

  for (var i = 0; i < this.attrs.length; i++) {
    var attr = this.attrs[i];
    var offset = offsets[i];
    var number = numbers[i];

    out[attr.name] = [];
    for (var j = 0; j < number; j++)
      offset += attr.parse(buffer, offset, out);
  }

  return out;
};
