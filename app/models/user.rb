class User < ActiveRecord::Base
  validates :uuid, presence: true #TODO determine format

  has_many :images, through: :metadata
  has_many :metadata
end
