var View = require("views/view")
  , template = require("views/templates/computer_edit")
  , Computer = require("models/computer_model")
  , application = require("application");

module.exports = View.extend({
    tagName: "tr"
  , template: template

  , bindings: {
      ".name": {
      modelAttr: "name"
    }
    , ".ip_address": {
      modelAttr: "ip_address"
    }
    , ".model": {
        modelAttr: "model_id"
      , selectOptions: {
          collection: function () { return this.models.toJSON(); }.bind(application)
        , labelPath: "name"
        , valuePath: "id"
      }
    }
    , ".user": {
        modelAttr: "user_id"
      , selectOptions: {
          collection: function () { return this.users.toJSON(); }.bind(application)
        , labelPath: "first_name"
        , valuePath: "id"
      }
    }
  }

  , events: {
    "click a.save": "saveComputer"
  }

  , saveComputer: function (e) {
    var attrs = {};

    e.preventDefault();

    this.$("input").each(function (index, element) {
      attrs[element.className] = element.value;
    });

    this.model.save(attrs, {
      success: function () {
        var computerView = application.createView("computer", {
          model: this.model
        });

        this.$el.replaceWith(computerView.render().$el);
      }.bind(this)

      , error: function (model, response) {
        console.log(response);
      }
    });
  }
});
