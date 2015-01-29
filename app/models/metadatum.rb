class Metadatum < ActiveRecord::Base
  has_many :tags
  belongs_to :user
  belongs_to :image

  def info
    {
      user: user.info,
      image: image.info,
      rating: rating,
      tags: tags.pluck(:name)
    }
  end
end
