class Tag < ActiveRecord::Base
  validates :name, presence: true

  # Implicit string conversions should print the value
  def to_s
    name
  end
end
