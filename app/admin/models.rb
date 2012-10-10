ActiveAdmin.register Model do
  controller.authorize_resource

  controller do
    def action_methods
      if current_admin_user.admin?
        super
      else
        super - ['new', 'edit', 'destroy']
      end
    end
  end

  menu priority: 3, parent: "Devices"

  index do
    column :name
    column :brand
    column :model_type
    default_actions
  end

  form do |f|
    f.inputs t(:"admin.labels.details") do
      f.input :name
      f.input :brand
      f.input :model_type, label: "Type"
    end

    f.inputs t(:'activerecord.models.feature') do
      f.has_many :features do |g|
        g.input :_destroy, :as => :boolean, :label => "delete" unless g.object.id.nil?
        g.input :name
        g.input :value
      end
    end
    f.buttons
  end

  csv do
    column :name
    column :brand
    column :model_type
  end
end
