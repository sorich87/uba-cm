class CreateComputers < ActiveRecord::Migration
  def change
    create_table :computers do |t|
      t.string :name

      t.timestamps
    end
  end
end
