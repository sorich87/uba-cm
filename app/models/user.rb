class User < ActiveRecord::Base
  belongs_to :branch, inverse_of: :users
  belongs_to :section, inverse_of: :users
  has_and_belongs_to_many :computers, join_table: :users_computers
  attr_accessible :address, :first_name, :last_name, :branch_id, :section_id, :computer_ids

  def full_name
    full_name = [first_name, last_name].join(' ')
    full_name unless full_name.blank?
  end
end
