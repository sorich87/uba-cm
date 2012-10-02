class User < ActiveRecord::Base
  belongs_to :branch
  belongs_to :section
  has_and_belongs_to_many :computers
  attr_accessible :address, :first_name, :last_name
end
