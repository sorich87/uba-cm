var Collection = require("collections/collection")
  , Model = require("models/model_model");

module.exports = Collection.extend({
    model: Model
  , url: "models"
});
