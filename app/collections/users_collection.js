var Collection = require("collections/collection")
  , User = require("models/user_model");

module.exports = Collection.extend({
    model: User
  , url: "users"
});
