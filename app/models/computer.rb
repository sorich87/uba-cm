class Computer < ActiveRecord::Base
  belongs_to :model
  has_and_belongs_to_many :users
  attr_accessible :name
end
