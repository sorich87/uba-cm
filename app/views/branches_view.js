var View = require("views/view")
  , template = require("views/templates/branches")
  , application = require("application");

module.exports = View.extend({
    id: "branches"
  , template: template
  , collection: application.branches

  , events: {
    "click a.add": "showForm"
  }

  , initialize: function () {
    this.collection.on("reset", this.addAll, this);
  }

  , addOne: function (branch) {
    var branchView = application.createView("branch", {
      model: branch
    });
    this.$("tbody").append(branchView.render().$el);
  }

  , addAll: function () {
    this.collection.each(function (branch) {
      this.addOne(branch);
    }, this);
  }

  , showForm: function (e) {
    var branchView;

    e.preventDefault();

    branchEditView = application.createView("branch_edit", {
      model: this.collection.create()
    });
    this.$("tbody").append(branchEditView.render().$el);
  }
});
