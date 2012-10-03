class CreateFeatures < ActiveRecord::Migration
  def change
    create_table :features do |t|
      t.string :name
      t.string :value
      t.references :model

      t.timestamps
    end
    add_index :features, :model_id
  end
end
