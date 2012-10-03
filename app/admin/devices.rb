ActiveAdmin.register Device do
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
end
