ActiveAdmin.register Computer do
  menu :priority => 2

  index do
    column :name
    column :model
    column "Devices" do |computer|
      computer.devices.map{ |device| device.name }.join(', ')
    end
    column "Users" do |computer|
      computer.users.map{ |user| user.full_name }.join(', ')
    end
    column "Branches" do |computer|
      computer.users.map{ |user| user.branch }.map{ |branch| branch.name if branch }.join(', ')
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
end
