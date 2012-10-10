class Computer < ActiveRecord::Base
  has_many :devices, inverse_of: :computer
  has_and_belongs_to_many :users, join_table: :users_computers
  attr_accessible :name, :user_ids, :device_ids
end
