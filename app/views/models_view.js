var View = require("views/view")
  , template = require("views/templates/models")
  , application = require("application");

module.exports = View.extend({
    id: "models"
  , template: template
  , collection: application.models

  , events: {
    "click a.add": "showForm"
  }

  , initialize: function () {
    this.collection.on("reset", this.addAll, this);
  }

  , addOne: function (model) {
    var modelView = application.createView("model", {
      model: model
    });
    this.$("tbody").append(modelView.render().$el);
  }

  , addAll: function () {
    this.collection.each(function (model) {
      this.addOne(model);
    }, this);
  }

  , showForm: function (e) {
    var modelView;

    e.preventDefault();

    modelEditView = application.createView("model_edit", {
      model: this.collection.create()
    });
    this.$("tbody").append(modelEditView.render().$el);
  }
});
