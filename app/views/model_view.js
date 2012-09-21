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
