var util = require('util');
var stream = require('stream');

util.inherits(Driver,stream);

function Driver(opts, app) {
  var self = this;

  this.devices = {};

  this.log = app.log;

  this.opts = opts;

  opts.devices = opts.devices || {};

  app.once('client::up',function(){
    self.save();

    var keys = Object.keys(opts.devices);
    for (var i=0; i<keys.length; i++) {
      var id = keys[i];
      self.createDevice(id, opts.devices[id].name);
    }
  });

}

Driver.prototype.config = function(rpc,cb) {

  var self = this;

  if (!rpc) {
    return cb(null, {
        "contents":[
          { "type": "input_field_text", "field_name": "name", "value": '', "label": "Name", "placeholder": "blind", "required": true},
          { "type": "submit", "name": "Add", "rpc_method": "add" }
        ]
      });
  }

  switch (rpc.method) {
    case 'add':

      var name = rpc.params.name;
      var id = name.replace(/[^a-zA-Z0-9]/g, '');
      self.opts.devices[id] = { name: name };
      self.save();
      self.createDevice(id, name);

      cb(null, {
        "contents": [
          { "type":"paragraph", "text":"Successfully saved." },
          { "type":"close", "text":"Close" }
        ]
      });

      break;
    default:
      log('Unknown rpc method', rpc.method, rpc);
  }
};

Driver.prototype.createDevice = function(id, name) {

  var self = this;

  function State() {
    this.writable = true;
    this.readable = true;
    this.V = 0;
    this.D = 244;
    this.G = 'state' + id;
    this.name = name;

    var topic = 'data.state' + id

    this.write = function(data) {
      self.log.debug('State [%s] write data : %s', name, data);
      this.emit('data', data);
    };
  }

  util.inherits(State, stream);
  this.log.info("Registering state device '%s'", name);
  this.emit('register', new State());

};

module.exports = Driver;
