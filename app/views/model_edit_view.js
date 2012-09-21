var View = require("views/view")
  , template = require("views/templates/model_edit")
  , Model = require("models/model_model")
  , application = require("application");

module.exports = View.extend({
    tagName: "tr"
  , template: template

  , bindings: {
      ".name": {
      modelAttr: "name"
    }
    , ".model_brand": {
      modelAttr: "brand"
    }
    , ".type": {
      modelAttr: "type"
    }
    , ".comment": {
      modelAttr: "comment"
    }
  }

  , events: {
    "click a.save": "saveModel"
  }

  , saveModel: function (e) {
    var attrs = {};

    e.preventDefault();

    this.$("input").each(function (index, element) {
      attrs[element.className] = element.value;
    });

    this.model.save(attrs, {
      success: function () {
        var modelView = application.createView("model", {
          model: this.model
        });

        this.$el.replaceWith(modelView.render().$el);
      }.bind(this)

      , error: function (model, response) {
        console.log(response);
      }
    });
  }
});
