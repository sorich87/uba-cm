var Collection = require("collections/collection")
  , Computer = require("models/computer_model");

module.exports = Collection.extend({
    model: Computer
  , url: "computers"
});
