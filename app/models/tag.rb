class Tag < ActiveRecord::Base
  validates :name, presence: true, length: {maximum: 100}, strict: true

  belongs_to :metadata

  # Implicit string conversions (e.g. `puts`) should print the value
  def to_s
    name
  end
end
