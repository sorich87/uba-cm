ActiveAdmin.register User do
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

  menu :priority => 4

  index do
    column :first_name
    column :last_name
    column :address
    column :branch
    column :section
    column "Computers" do |user|
      user.computers.map{|computer| computer.name}.uniq.join(', ')
    end
    default_actions
  end

  form do |f|
    f.inputs t(:"admin.labels.details") do
      f.input :first_name
      f.input :last_name
      f.input :address
      f.input :branch
      f.input :section
      f.input :computers, member_label: :name
    end
    f.buttons
  end

  csv do
    column :first_name
    column :last_name
    column :address
    column("Branch") do |user|
      user.branch.name if user.branch
    end
    column("Section") do |user|
      user.section.name if user.section
    end
    column("Computers") do |user|
      user.computers.map{ |computer| computer.name }.uniq.join(', ')
    end
  end
end
