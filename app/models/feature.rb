class Feature < ActiveRecord::Base
  attr_accessible :name, :value
  belongs_to :computer, inverse_of: :features
  belongs_to :model, inverse_of: :features
end
