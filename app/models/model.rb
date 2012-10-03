class Model < ActiveRecord::Base
  has_many :computers, inverse_of: :model
  attr_accessible :brand, :name, :model_type
end
