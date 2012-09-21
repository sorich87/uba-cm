var View = require("views/view")
  , template = require("views/templates/department_edit")
  , Department = require("models/department_model")
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
    "click a.save": "saveDepartment"
  }

  , saveDepartment: function (e) {
    var attrs = {};

    e.preventDefault();

    this.$("input").each(function (index, element) {
      attrs[element.className] = element.value;
    });

    this.model.save(attrs, {
      success: function () {
        var departmentView = application.createView("department", {
          model: this.model
        });

        this.$el.replaceWith(departmentView.render().$el);
      }.bind(this)

      , error: function (model, response) {
        console.log(response);
      }
    });
  }
});
