class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :address
      t.references :section
      t.references :branch

      t.timestamps
    end
  end
end
