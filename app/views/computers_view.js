var View = require("views/view")
  , template = require("views/templates/computers")
  , application = require("application");

module.exports = View.extend({
    id: "computers"
  , template: template
  , collection: application.computers

  , events: {
    "click a.add": "showForm"
  }

  , initialize: function () {
    this.collection.on("reset", this.addAll, this);
  }

  , addOne: function (computer) {
    var computerView = application.createView("computer", {
      model: computer
    });
    this.$("tbody").append(computerView.render().$el);
  }

  , addAll: function () {
    this.collection.each(function (computer) {
      this.addOne(computer);
    }, this);
  }

  , showForm: function (e) {
    var computerView;

    e.preventDefault();

    computerEditView = application.createView("computer_edit", {
      model: this.collection.create({})
    });
    this.$("tbody").append(computerEditView.render().$el);
  }
});
