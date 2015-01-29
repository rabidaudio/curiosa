class User < ActiveRecord::Base
  validates :uuid, presence: true, strict: true #TODO determine format

  has_many :images, through: :metadata
  has_many :metadata

  #overload find method to use our `uuid`
  def self.find(uuid)
    find_by(uuid: uuid).first
  end

  def find_image(hash_id)
    images.find_by(hash_id: hash_id)
  end
end
