var Buffer = require('buffer').Buffer;

var keychair = require('../../');

function App() {
  this.elem = {
    file: document.getElementById('keychain'),
    drop: document.getElementById('drop'),
    select: document.getElementById('key-list'),
    out: document.getElementById('key'),
    passphrase: document.getElementById('passphrase'),

    upload: document.getElementById('upload'),
    enter: document.getElementById('enter')
  };

  this.state = 'upload';
  this.file = null;
  this.passphrase = null;
  this.keys = null;

  this.initFile();
  this.initDrop();
  this.initPassphrase();
  this.initSelect();
}

App.prototype.handleFiles = function handleFiles(files) {
  if (files.length < 1)
    return;

  var reader = new FileReader();

  var self = this;
  reader.onloadend = function onloadend() {
    var buffer = new Uint8Array(this.result);

    self.file = buffer;
    self.transition();
  };

  reader.readAsArrayBuffer(files[0]);
};

App.prototype.transition = function transition() {
  if (this.state === 'upload') {
    this.state = 'enter';
    this.elem.upload.classList.remove('active');
    this.elem.enter.classList.add('active');
  } else {
    this.state = 'upload';
    this.elem.enter.classList.remove('active');
    this.elem.upload.classList.add('active');
  }
};

function ignore(e) {
  e.stopPropagation();
  e.preventDefault();
}

App.prototype.initFile = function initFile() {
  var self = this;

  this.elem.file.addEventListener('change', function(e) {
    ignore(e);

    self.handleFiles(this.files);
  }, false);
};

App.prototype.initDrop = function initDrop() {
  var self = this;

  var elem = this.elem.drop;

  drop.addEventListener('dragover', ignore);

  drop.addEventListener('dragenter', function(e) {
    ignore(e);

    this.classList.add('dropping');
  }, false);

  drop.addEventListener('dragleave', function(e) {
    ignore(e);

    this.classList.remove('dropping');
  }, false);

  drop.addEventListener('drop', function(e) {
    ignore(e);
    this.classList.remove('dropping');

    self.handleFiles(event.dataTransfer.files);
  }, false);
};

App.prototype.initPassphrase = function initPassphrase() {
  var self = this;

  var elem = this.elem.passphrase;

  elem.addEventListener('keydown', function(e) {
    if (e.keyCode !== 13)
      return;

    ignore(e);

    self.passphrase = elem.value;
    this.value = '';

    try {
      self.run();
    } catch (e) {
      console.error(e);
      self.renderKeys([]);
    }
    self.transition();
  }, false);
};

App.prototype.run = function run() {
  var file = new Buffer(this.file);
  var passphrase = new Buffer(this.passphrase);

  var kc = keychair.parse(file, passphrase);
  var privateKeys = kc.tables.privateKey.records;

  this.file = null;
  this.passphrase = null;

  privateKeys = privateKeys.map(function(record) {
    var name = record.attributes.PrintName + '';
    name = name.replace(/[^a-z0-9\-_\.\s@]+/ig, '');
    var key = record.data.key.dsa;
    if (!key)
      return null;
    if (key.dsaAlg.algorithm !== 'rsaEncryption')
      return null;

    var out = '-----BEGIN RSA PRIVATE KEY-----\n';

    var pem = key.privateKey.toString('base64');
    for (var i = 0; i < pem.length; i += 64)
      out += pem.slice(i, i + 64) + '\n';

    out += '-----END RSA PRIVATE KEY-----';

    return {
      name: name,
      pem: out
    };
  }).filter(function(key) {
    return key !== null;
  });

  this.renderKeys(privateKeys);
};

App.prototype.renderKeys = function renderKeys(keys) {
  var select = this.elem.select;

  select.innerHTML = '';
  this.elem.out.value = '';

  var self = this;

  keys.forEach(function(key, i) {
    var option = document.createElement('option');
    option.text = key.name;
    option.value = i;

    select.appendChild(option);
  });

  if (keys.length === 0) {
    select.setAttribute('disabled');
  } else {
    select.removeAttribute('disabled');
    select.value = '0';
    this.selectKey(keys[0]);
  }

  this.keys = keys;
};

App.prototype.initSelect = function initSelect() {
  var select = this.elem.select;

  var self = this;
  select.addEventListener('change', function(e) {
    var key = self.keys[this.value | 0];

    self.selectKey(key);
  }, false);
};

App.prototype.selectKey = function selectKey(key) {
  this.elem.out.value = key.pem;
};

var app = new App();
