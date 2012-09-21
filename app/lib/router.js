var application = require('application');

module.exports = Backbone.Router.extend({
    routes: {
      "": "computers"
    , "models": "models"
    , "users": "users"
    , "departments": "departments"
    , "branches": "branches"
  }

  , computers: function() {
    $("#main").empty()
      .append(application.createView("computers").render().el);
  }

  , models: function () {
    $("#main").empty()
      .append(application.createView("models").render().el);
  }

  , users: function () {
    $("#main").empty()
      .append(application.createView("users").render().el);
  }

  , departments: function () {
    $("#main").empty()
      .append(application.createView("departments").render().el);
  }

  , branches: function () {
    $("#main").empty()
      .append(application.createView("branches").render().el);
  }
});
