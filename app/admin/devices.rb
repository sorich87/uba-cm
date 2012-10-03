ActiveAdmin.register Device do
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

  menu priority: 4, parent: "Computers"

  index do
    column :name
    column :model
    column :computer
    column :branch
    column :section
    default_actions
  end

  form do |f|
    f.inputs "Model Details" do
      f.input :name
      f.input :model
      f.input :computer
      f.input :branch
      f.input :section
    end
    f.buttons
  end

  csv do
    column :name
    column("Model") do |device|
      device.model.name if device.model
    end
    column("Computer") do |device|
      device.computer.name if device.computer
    end
    column("Branch") do |device|
      device.branch.name if device.branch
    end
    column("Section") do |device|
      device.section.name if device.section
    end
  end
end
