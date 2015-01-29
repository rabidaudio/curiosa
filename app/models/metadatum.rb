class Metadatum < ActiveRecord::Base
  has_many :tags
  belongs_to :user
  belongs_to :image

  def info
    {
      user_id: user.uuid,
      image_hash: image.hash_id,
      rating: rating,
      tags: tags.pluck(:name)
    }
  end
end
