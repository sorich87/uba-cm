class CreateDevices < ActiveRecord::Migration
  def change
    create_table :devices do |t|
      t.string :name
      t.references :model
      t.references :computer
      t.references :section
      t.references :branch

      t.timestamps
    end
    add_index :devices, :model_id
    add_index :devices, :computer_id
    add_index :devices, :section_id
    add_index :devices, :branch_id
  end
end
