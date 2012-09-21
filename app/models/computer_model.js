var Model = require("models/model")
  , tmp = {};

Backbone.Relational.store.addModelScope(tmp);

module.exports = tmp.Computer = Model.extend({
  defaults: {
      name: ""
    , ip_address: ""
  }

  , relations: [
    {
        type: "HasOne"
      , key: "model"
      , keySource: "model_id"
      , keyDestination: "model"
      , relatedModel: "Model"
      , reverseRelation: {
          type: "HasOne"
        , key: "computer"
      }
    }
  ]

  , relations: [
    {
        type: "HasOne"
      , key: "user"
      , keySource: "user_id"
      , keyDestination: "user"
      , relatedModel: "User"
      , reverseRelation: {
          type: "HasOne"
        , key: "computer"
      }
    }
  ]
});
