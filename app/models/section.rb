class Section < ActiveRecord::Base
  belongs_to :department, inverse_of: :sections
  has_many :users, inverse_of: :section
  attr_accessible :name, :department_id
end
