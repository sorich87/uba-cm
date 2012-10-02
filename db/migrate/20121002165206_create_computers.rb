class CreateComputers < ActiveRecord::Migration
  def change
    create_table :computers do |t|
      t.string :name
      t.references :model

      t.timestamps
    end
    add_index :computers, :model_id
  end
end
