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

    f.inputs "Features" do
      f.has_many :features do |g|
        g.input :_destroy, :as => :boolean, :label => "delete" unless g.object.id.nil?
        g.input :name
        g.input :value
      end
    end
    f.buttons
  end

  csv do
    column :name
    column :brand
    column :model_type
  end
end
