class Branch < ActiveRecord::Base
  has_many :users, inverse_of: :branch
  attr_accessible :city, :name
end
