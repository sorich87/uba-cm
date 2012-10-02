class Model < ActiveRecord::Base
  has_many :computers
  attr_accessible :brand, :comment, :name, :type
end
