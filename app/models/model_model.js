var Model = require("models/model");

module.exports = Model.extend({
  defaults: {
      name: ""
    , brand: ""
    , type: ""
    , comment: ""
  }
});
