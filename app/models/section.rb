class Section < ActiveRecord::Base
  belongs_to :department
  has_many :users
  attr_accessible :name
end
