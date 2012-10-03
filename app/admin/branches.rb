ActiveAdmin.register Branch do
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
