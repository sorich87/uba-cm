ActiveAdmin.register Branch do
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

  menu priority: 5, parent: "Users"

  index do
    column :name
    column :city
    default_actions
  end

  form do |f|
    f.inputs "Branch Details" do
      f.input :name
      f.input :city
    end
    f.buttons
  end

  csv do
    column :name
    column :city
  end
end
