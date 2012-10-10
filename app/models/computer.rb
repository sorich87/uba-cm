class Computer < ActiveRecord::Base
  has_many :devices, inverse_of: :computer
  has_many :features, inverse_of: :computer
  has_and_belongs_to_many :users, join_table: :users_computers
  attr_accessible :name, :fincon_number, :user_ids, :device_ids, :feature_ids, :features_attributes
  accepts_nested_attributes_for :features, allow_destroy: true
end
