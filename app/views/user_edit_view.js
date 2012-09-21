var View = require("views/view")
  , template = require("views/templates/user_edit")
  , User = require("models/user_model")
  , application = require("application");

module.exports = View.extend({
    tagName: "tr"
  , template: template

  , bindings: {
      ".first_name": {
      modelAttr: "first_name"
    }
    , ".last_name": {
      modelAttr: ".last_name"
    }
    , ".address": {
      modelAttr: "address"
    }
    , ".department": {
        modelAttr: "department_id"
      , selectOptions: {
          collection: function () { return this.departments.toJSON(); }.bind(application)
        , labelPath: "name"
        , valuePath: "id"
      }
    }
    , ".branch": {
        modelAttr: "branch_id"
      , selectOptions: {
          collection: function () { return this.branches.toJSON(); }.bind(application)
        , labelPath: "name"
        , valuePath: "id"
      }
    }
  }

  , events: {
    "click a.save": "saveUser"
  }

  , saveUser: function (e) {
    var attrs = {};

    e.preventDefault();

    this.$("input").each(function (index, element) {
      attrs[element.className] = element.value;
    });

    this.model.save(attrs, {
      success: function () {
        var userView = application.createView("user", {
          model: this.model
        });

        this.$el.replaceWith(userView.render().$el);
      }.bind(this)

      , error: function (model, response) {
        console.log(response);
      }
    });
  }
});
