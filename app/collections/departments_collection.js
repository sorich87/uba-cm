var Collection = require("collections/collection")
  , Department = require("models/department_model");

module.exports = Collection.extend({
    model: Department
  , url: "departments"
});
