var View = require("views/view")
  , template = require("views/templates/branch_edit")
  , Branch = require("models/branch_model")
  , application = require("application");

module.exports = View.extend({
    tagName: "tr"
  , template: template

  , bindings: {
      ".name": {
      modelAttr: "name"
    }
    , ".city": {
      modelAttr: ".city"
    }
  }

  , events: {
    "click a.save": "saveBranch"
  }

  , saveBranch: function (e) {
    var attrs = {};

    e.preventDefault();

    this.$("input").each(function (index, element) {
      attrs[element.className] = element.value;
    });

    this.model.save(attrs, {
      success: function () {
        var branchView = application.createView("branch", {
          model: this.model
        });

        this.$el.replaceWith(branchView.render().$el);
      }.bind(this)

      , error: function (model, response) {
        console.log(response);
      }
    });
  }
});
