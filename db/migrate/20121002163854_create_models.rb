class CreateModels < ActiveRecord::Migration
  def change
    create_table :models do |t|
      t.string :name
      t.string :brand
      t.string :model_type

      t.timestamps
    end
  end
end
