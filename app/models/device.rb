class Device < ActiveRecord::Base
  belongs_to :computer, inverse_of: :devices
  belongs_to :model, inverse_of: :devices
  belongs_to :branch, inverse_of: :devices
  belongs_to :section, inverse_of: :devices
  attr_accessible :name, :computer_id, :model_id, :branch_id, :section_id
end
