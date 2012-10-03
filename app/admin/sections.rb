ActiveAdmin.register Section do
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

  menu priority: 6, parent: "Users"

  index do
    column :name
    column :department
    default_actions
  end

  form do |f|
    f.inputs "Model Details" do
      f.input :name
      f.input :department
    end
    f.buttons
  end

  csv do
    column :name
    column :department
  end
end
