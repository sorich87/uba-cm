var View = require("views/view")
  , template = require("views/templates/users")
  , application = require("application");

module.exports = View.extend({
    id: "users"
  , template: template
  , collection: application.users

  , events: {
    "click a.add": "showForm"
  }

  , initialize: function () {
    this.collection.on("reset", this.addAll, this);
  }

  , addOne: function (user) {
    var userView = application.createView("user", {
      model: user
    });
    this.$("tbody").append(userView.render().$el);
  }

  , addAll: function () {
    this.collection.each(function (user) {
      this.addOne(user);
    }, this);
  }

  , showForm: function (e) {
    var userView;

    e.preventDefault();

    userEditView = application.createView("user_edit", {
      model: this.collection.create()
    });
    this.$("tbody").append(userEditView.render().$el);
  }
});
