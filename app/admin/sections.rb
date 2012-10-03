ActiveAdmin.register Section do
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
