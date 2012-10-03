ActiveAdmin.register Computer do
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

  menu :priority => 2

  index do
    column :name
    column :model
    column "Devices" do |computer|
      computer.devices.map{ |device| device.name }.uniq.join(', ')
    end
    column "Users" do |computer|
      computer.users.map{ |user| user.full_name }.uniq.join(', ')
    end
    column "Branches" do |computer|
      computer.users.map{ |user| user.branch }.uniq.map{ |branch| branch.name }.join(', ')
    end
    default_actions
  end

  form do |f|
    f.inputs "Computer Details" do
      f.input :name
      f.input :model
      f.input :devices, member_label: :name
      f.input :users, member_label: :full_name
    end
    f.buttons
  end

  csv do
    column :name
    column("Model") do |computer|
      computer.model.name if computer.model
    end
    column("Devices") do |computer|
      computer.devices.map{ |device| device.name }.uniq.join(', ')
    end
    column "Users" do |computer|
      computer.users.map{ |user| user.full_name }.uniq.join(', ')
    end
    column "Branches" do |computer|
      computer.users.map{ |user| user.branch }.uniq.map{ |branch| branch.name }.join(', ')
    end
  end
end
