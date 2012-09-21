(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
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
  
}});

window.require.define({"collections/branches_collection": function(exports, require, module) {
  var Collection = require("collections/collection")
    , Branch = require("models/branch_model");

  module.exports = Collection.extend({
      model: Branch
    , url: "branches"
  });
  
}});

window.require.define({"collections/collection": function(exports, require, module) {
  // Base class for all collections.
  module.exports = Backbone.Collection.extend({
    remote: false
  });
  
}});

window.require.define({"collections/computers_collection": function(exports, require, module) {
  var Collection = require("collections/collection")
    , Computer = require("models/computer_model");

  module.exports = Collection.extend({
      model: Computer
    , url: "computers"
  });
  
}});

window.require.define({"collections/departments_collection": function(exports, require, module) {
  var Collection = require("collections/collection")
    , Department = require("models/department_model");

  module.exports = Collection.extend({
      model: Department
    , url: "departments"
  });
  
}});

window.require.define({"collections/models_collection": function(exports, require, module) {
  var Collection = require("collections/collection")
    , Model = require("models/model_model");

  module.exports = Collection.extend({
      model: Model
    , url: "models"
  });
  
}});

window.require.define({"collections/users_collection": function(exports, require, module) {
  var Collection = require("collections/collection")
    , User = require("models/user_model");

  module.exports = Collection.extend({
      model: User
    , url: "users"
  });
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var application = require('application');

  $(function() {
    application.initialize();

    Backbone.history.start({pushState: true});

    jQuery(function ($) {
      // All navigation that is relative should be passed through the navigate
      // method, to be processed by the router.
      // If the link has a `data-bypass` attribute, bypass the delegation completely.
      // If the link has a `data-replace` attribute, update the URL without creating
      // an entry in the browser history.
      $(document).on("click", "a:not([data-bypass])", function(e) {
        var href = { prop: $(this).prop("href"), attr: $(this).attr("href") }
          , root = location.protocol + "//" + location.host + "/";

        if (href.prop && href.prop.slice(0, root.length) === root) {
          e.preventDefault();

          Backbone.history.navigate(href.attr, {
            trigger: true,
            replace: !!$(this).data("replace")
          });
        }
      });
    });
  });
  
}});

window.require.define({"lib/router": function(exports, require, module) {
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
  
}});

window.require.define({"lib/view_helper": function(exports, require, module) {
  // Put your handlebars.js helpers here.
  
}});

window.require.define({"models/branch_model": function(exports, require, module) {
  var Model = require("models/model");

  module.exports = Model.extend({
    defaults: {
        name: ""
      , city: ""
    }
  });
  
}});

window.require.define({"models/computer_model": function(exports, require, module) {
  var Model = require("models/model")
    , tmp = {};

  Backbone.Relational.store.addModelScope(tmp);

  module.exports = tmp.Computer = Model.extend({
    defaults: {
        name: ""
      , ip_address: ""
    }

    , relations: [
      {
          type: "HasOne"
        , key: "model"
        , keySource: "model_id"
        , keyDestination: "model"
        , relatedModel: "Model"
        , reverseRelation: {
            type: "HasOne"
          , key: "computer"
        }
      }
    ]

    , relations: [
      {
          type: "HasOne"
        , key: "user"
        , keySource: "user_id"
        , keyDestination: "user"
        , relatedModel: "User"
        , reverseRelation: {
            type: "HasOne"
          , key: "computer"
        }
      }
    ]
  });
  
}});

window.require.define({"models/department_model": function(exports, require, module) {
  var Model = require("models/model");

  module.exports = Model.extend({
    defaults: {
        name: ""
      , sections: []
    }
  });
  
}});

window.require.define({"models/model": function(exports, require, module) {
  // Base class for all models.
  module.exports = Backbone.Model.extend({
  });
  
}});

window.require.define({"models/model_model": function(exports, require, module) {
  var Model = require("models/model");

  module.exports = Model.extend({
    defaults: {
        name: ""
      , brand: ""
      , type: ""
      , comment: ""
    }
  });
  
}});

window.require.define({"models/user_model": function(exports, require, module) {
  var Model = require("models/model")
    , tmp = {};

  Backbone.Relational.store.addModelScope(tmp);

  module.exports = Model.extend({
    defaults: {
        first_name: ""
      , last_name: ""
      , address: ""
    }

    , relations: [
      {
          type: "HasOne"
        , key: "computer"
        , relatedModel: "Computer"
        , reverseRelation: {
            type: "HasOne"
          , key: "user"
        }
      }
    ]
  });
  
}});

window.require.define({"views/branch_edit_view": function(exports, require, module) {
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
  
}});

window.require.define({"views/branch_view": function(exports, require, module) {
  var View = require("views/view")
    , template = require("views/templates/branch")
    , application = require("application");

  module.exports = View.extend({
      tagName: "tr"
    , template: template

    , events: {
        "click a.edit": "editBranch"
      , "click a.delete": "deleteBranch"
    }

    , editBranch: function (e) {
      var branchEditView;

      e.preventDefault();

      branchEditView = application.createView("branch_edit", {
        model: this.model
      });

      this.$el.replaceWith(branchEditView.render().$el);
    }

    , deleteBranch: function (e) {
      var result;

      e.preventDefault();

      result = this.model.destroy({
        success: function (model, response) {
          this.$el.remove();
        }.bind(this)

        , error: function (model, response) {
          console.log(response);
        }
      });

      // If result is a model, then it has never been synced before
      // and the success callback won't be called
      if (result.cid) {
        this.$el.remove();
      }
    }
  });
  
}});

window.require.define({"views/branches_view": function(exports, require, module) {
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
  
}});

window.require.define({"views/computer_edit_view": function(exports, require, module) {
  var View = require("views/view")
    , template = require("views/templates/computer_edit")
    , Computer = require("models/computer_model")
    , application = require("application");

  module.exports = View.extend({
      tagName: "tr"
    , template: template

    , bindings: {
        ".name": {
        modelAttr: "name"
      }
      , ".ip_address": {
        modelAttr: "ip_address"
      }
      , ".model": {
          modelAttr: "model_id"
        , selectOptions: {
            collection: function () { return this.models.toJSON(); }.bind(application)
          , labelPath: "name"
          , valuePath: "id"
        }
      }
      , ".user": {
          modelAttr: "user_id"
        , selectOptions: {
            collection: function () { return this.users.toJSON(); }.bind(application)
          , labelPath: "first_name"
          , valuePath: "id"
        }
      }
    }

    , events: {
      "click a.save": "saveComputer"
    }

    , saveComputer: function (e) {
      var attrs = {};

      e.preventDefault();

      this.$("input").each(function (index, element) {
        attrs[element.className] = element.value;
      });

      this.model.save(attrs, {
        success: function () {
          var computerView = application.createView("computer", {
            model: this.model
          });

          this.$el.replaceWith(computerView.render().$el);
        }.bind(this)

        , error: function (model, response) {
          console.log(response);
        }
      });
    }
  });
  
}});

window.require.define({"views/computer_view": function(exports, require, module) {
  var View = require("views/view")
    , template = require("views/templates/computer")
    , application = require("application");

  module.exports = View.extend({
      tagName: "tr"
    , template: template

    , events: {
        "click a.edit": "editComputer"
      , "click a.delete": "deleteComputer"
    }

    , editComputer: function (e) {
      var computerEditView;

      e.preventDefault();

      computerEditView = application.createView("computer_edit", {
        model: this.model
      });

      this.$el.replaceWith(computerEditView.render().$el);
    }

    , deleteComputer: function (e) {
      var result;

      e.preventDefault();

      result = this.model.destroy({
        success: function (model, response) {
          this.$el.remove();
        }.bind(this)

        , error: function (model, response) {
          console.log(response);
        }
      });

      // If result is a model, then it has never been synced before
      // and the success callback won't be called
      if (result.cid) {
        this.$el.remove();
      }
    }
  });
  
}});

window.require.define({"views/computers_view": function(exports, require, module) {
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
  
}});

window.require.define({"views/department_edit_view": function(exports, require, module) {
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
  
}});

window.require.define({"views/department_view": function(exports, require, module) {
  var View = require("views/view")
    , template = require("views/templates/department")
    , application = require("application");

  module.exports = View.extend({
      tagName: "tr"
    , template: template

    , events: {
        "click a.edit": "editDepartment"
      , "click a.delete": "deleteDepartment"
    }

    , editDepartment: function (e) {
      var departmentEditView;

      e.preventDefault();

      departmentEditView = application.createView("department_edit", {
        model: this.model
      });

      this.$el.replaceWith(departmentEditView.render().$el);
    }

    , deleteDepartment: function (e) {
      var result;

      e.preventDefault();

      result = this.model.destroy({
        success: function (model, response) {
          this.$el.remove();
        }.bind(this)

        , error: function (model, response) {
          console.log(response);
        }
      });

      // If result is a model, then it has never been synced before
      // and the success callback won't be called
      if (result.cid) {
        this.$el.remove();
      }
    }
  });
  
}});

window.require.define({"views/departments_view": function(exports, require, module) {
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
  
}});

window.require.define({"views/model_edit_view": function(exports, require, module) {
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
  
}});

window.require.define({"views/model_view": function(exports, require, module) {
  var View = require("views/view")
    , template = require("views/templates/model")
    , application = require("application");

  module.exports = View.extend({
      tagName: "tr"
    , template: template

    , events: {
        "click a.edit": "editModel"
      , "click a.delete": "deleteModel"
    }

    , editModel: function (e) {
      var modelEditView;

      e.preventDefault();

      modelEditView = application.createView("model_edit", {
        model: this.model
      });

      this.$el.replaceWith(modelEditView.render().$el);
    }

    , deleteModel: function (e) {
      var result;

      e.preventDefault();

      result = this.model.destroy({
        success: function (model, response) {
          this.$el.remove();
        }.bind(this)

        , error: function (model, response) {
          console.log(response);
        }
      });

      // If result is a model, then it has never been synced before
      // and the success callback won't be called
      if (result.cid) {
        this.$el.remove();
      }
    }
  });
  
}});

window.require.define({"views/models_view": function(exports, require, module) {
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
  
}});

window.require.define({"views/templates/branch": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<td>";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>";
    foundHelper = helpers.city;
    stack1 = foundHelper || depth0.city;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "city", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>\n  <a href=\"#\" data-bypass=\"true\" class=\"edit\" data-id=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"><i class=\"icon-pencil\"></i></a>\n  <a href=\"#\" data-bypass=\"true\" class=\"delete\" data-id=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"><i class=\"icon-remove\"></i></a>\n</td>\n";
    return buffer;});
}});

window.require.define({"views/templates/branch_edit": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<td><input class=\"name\" placeholder=\"Name\"></td>\n<td><input class=\"city\" placeholder=\"City\"></td>\n<td><a href=\"#\" data-bypass=\"true\" class=\"save\"><i class=\"icon-ok\"></i></a></td>\n";});
}});

window.require.define({"views/templates/branches": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h1 class=\"page-header\">Branches</h1>\n<table class=\"table table-striped\">\n  <thead>\n    <tr>\n      <th width=\"18%\">Name</th>\n      <th width=\"18%\">City</th>\n    </tr>\n  </thead>\n  <tbody>\n  </tbody>\n</table>\n\n<p><a class=\"add\" href=\"#\" data-bypass=\"true\"><i class=\"icon-plus\"></i> Add branch</a></p>\n";});
}});

window.require.define({"views/templates/computer": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<td>";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>";
    foundHelper = helpers.ip_address;
    stack1 = foundHelper || depth0.ip_address;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "ip_address", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>";
    foundHelper = helpers.model;
    stack1 = foundHelper || depth0.model;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "model", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>";
    foundHelper = helpers.user_id;
    stack1 = foundHelper || depth0.user_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "user_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>\n  <a href=\"#\" data-bypass=\"true\" class=\"edit\" data-id=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"><i class=\"icon-pencil\"></i></a>\n  <a href=\"#\" data-bypass=\"true\" class=\"delete\" data-id=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"><i class=\"icon-remove\"></i></a>\n</td>\n";
    return buffer;});
}});

window.require.define({"views/templates/computer_edit": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<td><input class=\"name\" placeholder=\"Name\"></td>\n<td><input class=\"ip_address\" placeholder=\"IP address\"></td>\n<td><select class=\"model\"></select>\n  <a class=\"add-model\" href=\"/models\">Add model</a></td>\n<td><select class=\"user\"></select>\n  <a class=\"add-user\" href=\"/users\">Add user</a></td>\n<td><a href=\"#\" data-bypass=\"true\" class=\"save\"><i class=\"icon-ok\"></i></a></td>\n";});
}});

window.require.define({"views/templates/computers": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h1 class=\"page-header\">Computers</h1>\n<table class=\"table table-striped\">\n  <thead>\n    <tr>\n      <th width=\"22.5%\">Name</th>\n      <th width=\"22.5%\">IP address</th>\n      <th width=\"22.5%\">Model</th>\n      <th width=\"22.5%\">User</th>\n      <th width=\"10%\">Action</th>\n    </tr>\n  </thead>\n  <tbody>\n  </tbody>\n</table>\n\n<p><a class=\"add\" href=\"#\" data-bypass=\"true\"><i class=\"icon-plus\"></i> Add computer</a></p>\n";});
}});

window.require.define({"views/templates/department": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<td>";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>";
    foundHelper = helpers.sections;
    stack1 = foundHelper || depth0.sections;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "sections", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>\n  <a href=\"#\" data-bypass=\"true\" class=\"edit\" data-id=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"><i class=\"icon-pencil\"></i></a>\n  <a href=\"#\" data-bypass=\"true\" class=\"delete\" data-id=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"><i class=\"icon-remove\"></i></a>\n</td>\n";
    return buffer;});
}});

window.require.define({"views/templates/department_edit": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<td><input class=\"name\" placeholder=\"Name\"></td>\n<td><input class=\"sections\" placeholder=\"Sections\"></td>\n<td><a href=\"#\" data-bypass=\"true\" class=\"save\"><i class=\"icon-ok\"></i></a></td>\n";});
}});

window.require.define({"views/templates/departments": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h1 class=\"page-header\">Departments</h1>\n<table class=\"table table-striped\">\n  <thead>\n    <tr>\n      <th width=\"18%\">Name</th>\n      <th width=\"18%\">Sections</th>\n    </tr>\n  </thead>\n  <tbody>\n  </tbody>\n</table>\n\n<p><a class=\"add\" href=\"#\" data-bypass=\"true\"><i class=\"icon-plus\"></i> Add department</a></p>\n";});
}});

window.require.define({"views/templates/model": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<td>";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>";
    foundHelper = helpers.brand;
    stack1 = foundHelper || depth0.brand;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "brand", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>";
    foundHelper = helpers.type;
    stack1 = foundHelper || depth0.type;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "type", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>";
    foundHelper = helpers.commment;
    stack1 = foundHelper || depth0.commment;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "commment", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>\n  <a href=\"#\" data-bypass=\"true\" class=\"edit\" data-id=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"><i class=\"icon-pencil\"></i></a>\n  <a href=\"#\" data-bypass=\"true\" class=\"delete\" data-id=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"><i class=\"icon-remove\"></i></a>\n</td>\n";
    return buffer;});
}});

window.require.define({"views/templates/model_edit": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<td><input class=\"name\" placeholder=\"Name\"></td>\n<td><input class=\"model_brand\" placeholder=\"Brand\"></td>\n<td><input class=\"type\" placeholder=\"Type\"></td>\n<td><input class=\"comment\" placeholder=\"Comment\"></td>\n<td><a href=\"#\" data-bypass=\"true\" class=\"save\"><i class=\"icon-ok\"></i></a></td>\n";});
}});

window.require.define({"views/templates/models": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h1 class=\"page-header\">Models</h1>\n<table class=\"table table-striped\">\n  <thead>\n    <tr>\n      <th width=\"22.5%\">Name</th>\n      <th width=\"22.5%\">Brand</th>\n      <th width=\"22.5%\">Type</th>\n      <th width=\"22.5%\">Comment</th>\n      <th width=\"10%\">Action</th>\n    </tr>\n  </thead>\n  <tbody>\n  </tbody>\n</table>\n\n<p><a class=\"add\" href=\"#\" data-bypass=\"true\"><i class=\"icon-plus\"></i> Add user</a></p>\n";});
}});

window.require.define({"views/templates/user": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<td>";
    foundHelper = helpers.first_name;
    stack1 = foundHelper || depth0.first_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "first_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>";
    foundHelper = helpers.last_name;
    stack1 = foundHelper || depth0.last_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "last_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>";
    foundHelper = helpers.address;
    stack1 = foundHelper || depth0.address;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "address", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>";
    foundHelper = helpers.department;
    stack1 = foundHelper || depth0.department;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "department", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>";
    foundHelper = helpers.section;
    stack1 = foundHelper || depth0.section;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "section", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>";
    foundHelper = helpers.branch;
    stack1 = foundHelper || depth0.branch;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "branch", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td>\n  <a href=\"#\" data-bypass=\"true\" class=\"edit\" data-id=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"><i class=\"icon-pencil\"></i></a>\n  <a href=\"#\" data-bypass=\"true\" class=\"delete\" data-id=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"><i class=\"icon-remove\"></i></a>\n</td>\n";
    return buffer;});
}});

window.require.define({"views/templates/user_edit": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<td><input class=\"first_name\" placeholder=\"First Name\"></td>\n<td><input class=\"last_name\" placeholder=\"Last Name\"></td>\n<td><input class=\"address\" placeholder=\"Address\"></td>\n<td><input class=\"department\" placeholder=\"Department\">\n<td><select class=\"department\"></select>\n  <a class=\"add-department\" href=\"/departments\">Add department</a></td>\n<td><select class=\"section\"></select>\n  <a class=\"add-section\" href=\"#\">Add section</a></td>\n<td><select class=\"branch\"></select>\n  <a class=\"add-branch\" href=\"/branches\">Add branch</a></td>\n<td><a href=\"#\" data-bypass=\"true\" class=\"save\"><i class=\"icon-ok\"></i></a></td>\n";});
}});

window.require.define({"views/templates/users": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h1 class=\"page-header\">Users</h1>\n<table class=\"table table-striped\">\n  <thead>\n    <tr>\n      <th width=\"18%\">First Name</th>\n      <th width=\"18%\">Last Name</th>\n      <th width=\"18%\">Address</th>\n      <th width=\"18%\">Department</th>\n      <th width=\"18%\">Section</th>\n      <th width=\"18%\">Branch</th>\n      <th width=\"10%\">Action</th>\n    </tr>\n  </thead>\n  <tbody>\n  </tbody>\n</table>\n\n<p><a class=\"add\" href=\"#\" data-bypass=\"true\"><i class=\"icon-plus\"></i> Add user</a></p>\n";});
}});

window.require.define({"views/user_edit_view": function(exports, require, module) {
  var View = require("views/view")
    , template = require("views/templates/user_edit")
    , User = require("models/user_model")
    , application = require("application");

  module.exports = View.extend({
      tagName: "tr"
    , template: template

    , bindings: {
        ".first_name": {
        modelAttr: "first_name"
      }
      , ".last_name": {
        modelAttr: ".last_name"
      }
      , ".address": {
        modelAttr: "address"
      }
      , ".department": {
          modelAttr: "department_id"
        , selectOptions: {
            collection: function () { return this.departments.toJSON(); }.bind(application)
          , labelPath: "name"
          , valuePath: "id"
        }
      }
      , ".branch": {
          modelAttr: "branch_id"
        , selectOptions: {
            collection: function () { return this.branches.toJSON(); }.bind(application)
          , labelPath: "name"
          , valuePath: "id"
        }
      }
    }

    , events: {
      "click a.save": "saveUser"
    }

    , saveUser: function (e) {
      var attrs = {};

      e.preventDefault();

      this.$("input").each(function (index, element) {
        attrs[element.className] = element.value;
      });

      this.model.save(attrs, {
        success: function () {
          var userView = application.createView("user", {
            model: this.model
          });

          this.$el.replaceWith(userView.render().$el);
        }.bind(this)

        , error: function (model, response) {
          console.log(response);
        }
      });
    }
  });
  
}});

window.require.define({"views/user_view": function(exports, require, module) {
  var View = require("views/view")
    , template = require("views/templates/user")
    , application = require("application");

  module.exports = View.extend({
      tagName: "tr"
    , template: template

    , events: {
        "click a.edit": "editUser"
      , "click a.delete": "deleteUser"
    }

    , editUser: function (e) {
      var userEditView;

      e.preventDefault();

      userEditView = application.createView("user_edit", {
        model: this.model
      });

      this.$el.replaceWith(userEditView.render().$el);
    }

    , deleteUser: function (e) {
      var result;

      e.preventDefault();

      result = this.model.destroy({
        success: function (model, response) {
          this.$el.remove();
        }.bind(this)

        , error: function (model, response) {
          console.log(response);
        }
      });

      // If result is a model, then it has never been synced before
      // and the success callback won't be called
      if (result.cid) {
        this.$el.remove();
      }
    }
  });
  
}});

window.require.define({"views/users_view": function(exports, require, module) {
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
  
}});

window.require.define({"views/view": function(exports, require, module) {
  require('lib/view_helper');

  // Base class for all views.
  module.exports = Backbone.View.extend({
    initialize: function() {
      this.render = _.bind(this.render, this);
    }

    , template: function() {}

    , renderData: function() {
      if (this.collection) {
        return {collection: this.collection.toJSON()};
      }

      if (this.model) {
        return this.model.toJSON();
      }
    }

    , render: function() {
      this.$el.empty().append(this.template(this.renderData()));

      if (this.collection) {
        this.collection.reset(this.collection.models);
      }

      this.afterRender();

      if (this.bindings) {
        this.stickit();
      }

      return this;
    }

    , afterRender: function() {}
  });
  
}});

