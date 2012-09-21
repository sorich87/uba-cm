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
