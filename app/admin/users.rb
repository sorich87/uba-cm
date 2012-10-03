ActiveAdmin.register User do
  menu :priority => 4

  index do
    column :first_name
    column :last_name
    column :branch
    column :section
    column "Computers" do |user|
      user.computers.map{|computer| computer.name}.join(', ')
    end
    default_actions
  end

  form do |f|
    f.inputs "User Details" do
      f.input :first_name
      f.input :last_name
      f.input :address
      f.input :branch
      f.input :section
      f.input :computers, member_label: :name
    end
    f.buttons
  end
end
