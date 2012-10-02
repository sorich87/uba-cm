class Branch < ActiveRecord::Base
  has_many :users
  attr_accessible :city, :name
end
