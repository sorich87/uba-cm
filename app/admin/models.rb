ActiveAdmin.register Model do
  menu priority: 3, parent: "Computers"

  index do
    column :name
    column :brand
    column :model_type
    default_actions
  end

  form do |f|
    f.inputs "Model Details" do
      f.input :name
      f.input :brand
      f.input :model_type, label: "Type"
    end
    f.buttons
  end
end
