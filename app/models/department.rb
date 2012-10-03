class Department < ActiveRecord::Base
  has_many :sections, inverse_of: :department
  attr_accessible :name, :section_ids
end
