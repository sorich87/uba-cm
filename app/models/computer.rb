class Computer < ActiveRecord::Base
  belongs_to :model, inverse_of: :computers
  has_many :devices, inverse_of: :computer
  has_and_belongs_to_many :users, join_table: :users_computers
  attr_accessible :name, :model_id, :user_ids, :device_ids
end
