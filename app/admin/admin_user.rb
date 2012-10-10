ActiveAdmin.register AdminUser do
  controller.authorize_resource

  controller do
    def action_methods
      if can?(:manage, AdminUser)
        super
      else
        super - ['new', 'edit', 'destroy']
      end
    end
  end

  menu priority: 10, if: proc{ can?(:manage, AdminUser) }

  index do
    column :email
    column :first_name
    column :last_name
    column :role
    column :current_sign_in_at
    column :last_sign_in_at
    default_actions
  end

  filter :email

  form do |f|
    f.inputs t(:"admin.labels.details") do
      f.input :first_name
      f.input :last_name
      f.input :email
      f.input :password
      f.input :password_confirmation
      f.input :role, as: :select, collection: AdminUser::ROLES
      f.input :language, as: :select, collection: AdminUser::LANGUAGES
    end
    f.buttons
  end
end
