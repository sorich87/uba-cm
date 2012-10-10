class AddRoleAndLanguageToAdminUsers < ActiveRecord::Migration
  def change
    add_column :admin_users, :role, :string
    add_column :admin_users, :language, :string
  end
end
