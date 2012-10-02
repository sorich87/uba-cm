class CreateUsersComputersJoin < ActiveRecord::Migration
  def change
    create_table :users_computers, :id => false do |t|
      t.integer :user_id
      t.integer :computer_id
    end
    add_index :users_computers, :user_id
    add_index :users_computers, :computer_id
  end
end
