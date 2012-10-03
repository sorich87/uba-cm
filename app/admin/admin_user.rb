ActiveAdmin.register AdminUser do
  menu :priority => 10

  index do
    column :email
    column :first_name
    column :last_name
    column :current_sign_in_at
    column :last_sign_in_at
    default_actions
  end

  filter :email

  form do |f|
    f.inputs "Admin Details" do
      f.input :first_name
      f.input :last_name
      f.input :email
      f.input :password
      f.input :password_confirmation
    end
    f.buttons
  end
end
