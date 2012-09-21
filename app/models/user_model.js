var Model = require("models/model")
  , tmp = {};

Backbone.Relational.store.addModelScope(tmp);

module.exports = Model.extend({
  defaults: {
      first_name: ""
    , last_name: ""
    , address: ""
  }

  , relations: [
    {
        type: "HasOne"
      , key: "computer"
      , relatedModel: "Computer"
      , reverseRelation: {
          type: "HasOne"
        , key: "user"
      }
    }
  ]
});
