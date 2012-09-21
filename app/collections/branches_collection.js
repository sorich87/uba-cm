var Collection = require("collections/collection")
  , Branch = require("models/branch_model");

module.exports = Collection.extend({
    model: Branch
  , url: "branches"
});
