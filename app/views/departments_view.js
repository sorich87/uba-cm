var View = require("views/view")
  , template = require("views/templates/departments")
  , application = require("application");

module.exports = View.extend({
    id: "departments"
  , template: template
  , collection: application.departments

  , events: {
    "click a.add": "showForm"
  }

  , initialize: function () {
    this.collection.on("reset", this.addAll, this);
  }

  , addOne: function (department) {
    var departmentView = application.createView("department", {
      model: department
    });
    this.$("tbody").append(departmentView.render().$el);
  }

  , addAll: function () {
    this.collection.each(function (department) {
      this.addOne(department);
    }, this);
  }

  , showForm: function (e) {
    var departmentView;

    e.preventDefault();

    departmentEditView = application.createView("department_edit", {
      model: this.collection.create()
    });
    this.$("tbody").append(departmentEditView.render().$el);
  }
});
