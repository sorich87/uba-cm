ActiveAdmin.register Department do
  menu priority: 7, parent: "Users"

  index do
    column :name
    column "Sections" do |department|
      department.sections.map{|section| section.name}.join(', ')
    end
    default_actions
  end

  form do |f|
    f.inputs "Model Details" do
      f.input :name
      f.input :sections
    end
    f.buttons
  end
end
