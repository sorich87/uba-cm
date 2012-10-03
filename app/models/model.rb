class Model < ActiveRecord::Base
  has_many :computers, inverse_of: :model
  has_many :features, inverse_of: :model
  attr_accessible :brand, :name, :model_type, :feature_ids, :features_attributes
  accepts_nested_attributes_for :features, allow_destroy: true
end
