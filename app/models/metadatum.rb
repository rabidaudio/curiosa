class Metadatum < ActiveRecord::Base
  has_many :tags
  belongs_to :user
  belongs_to :image
end
