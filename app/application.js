// Application bootstrapper.
Application = {
  initialize: function() {
    var Router = require("lib/router")
      , ComputersCollection = require("collections/computers_collection")
      , ModelsCollection = require("collections/models_collection")
      , UsersCollection = require("collections/users_collection")
      , DepartmentsCollection = require("collections/departments_collection")
      , BranchesCollection = require("collections/branches_collection");

    this.router = new Router();

    this.computers = new ComputersCollection();
    this.computers.fetch();

    this.models = new ModelsCollection();
    this.models.fetch();

    this.users = new UsersCollection();
    this.users.fetch();

    this.departments = new DepartmentsCollection();
    this.departments.fetch();

    this.branches = new BranchesCollection();
    this.branches.fetch();

    if (typeof Object.freeze === "function") {
      Object.freeze(this);
    }
  }

  // Create a new view, cleanup if the view previously existed
  , createView: function (name, options) {
    var views = this.views || {}
    , View = require("views/" + name + "_view");

    if (views[name] !== void 0) {
      views[name].undelegateEvents();
      views[name].remove();
      views[name].off();
    }

    views[name] = new View(options);
    this.views = views;
    return views[name];
  }

  // Return existing view, otherwise create a new one
  , reuseView: function(name, options) {
    var views = this.views || {}
    , View = require("views/" + name + "_view");

    if (views[name] !== void 0) {
      return views[name];
    }

    views[name] = new View(options);
    this.views = views;
    return views[name];
  }
}

module.exports = Application;
