class Tag < ActiveRecord::Base
  validates :name, presence: true, length: {maximum: 100}, strict: true

  belongs_to :metadata

  # Implicit string conversions (e.g. `puts`) should print the value
  def to_s
    name
  end

  # def self.get(name)
  #   find_by(name: name) or Tag.new name: name
  # end

  #issue with tags this way: it's hard to find all images associated with a tag....

  #overload push to accept strings
  # def push(string)
  # end

end
