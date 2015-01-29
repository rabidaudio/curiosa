class Image < ActiveRecord::Base
  validates :hash_id, format: {with: /\A[0-9a-f]{32}\z/, message: "Hashes should be in 32 digit hexadecimal format" }, strict: true

  has_many :users, through: :metadata
  has_many :metadata

  #overload find method to use our `hash_id`
  def self.find hash_id 
    find_by hash_id: hash_id 
  end

  def average_rating
    metadata.pluck(:rating).sum / metadata.length
  end

  def info
    {
      id: hash_id,
      average_rating: average_rating,
      tags: metadata.tags.pluck(:name) #TODO return count of each as well
    }
  end
end
